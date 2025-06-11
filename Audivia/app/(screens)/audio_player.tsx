import { useState, useEffect, useCallback } from "react"
import { ActivityIndicator, SafeAreaView, ScrollView, View } from "react-native"
import styles from "@/styles/audio_player"
import AudioHeader from "../../components/audio_player/AudioHeader"
import AudioImage from "../../components/audio_player/AudioImage"
import PlayerControls from "../../components/audio_player/PlayerControls"
import Transcript from "../../components/audio_player/Transcript"
import { router, useLocalSearchParams } from "expo-router"
import { Audio, AVPlaybackStatus } from "expo-av"
import { getNextAudioByCheckpointId, getPrevAudioByCheckpointId, getTourAudioByCheckpointId } from "@/services/tour"
import { createCheckpointProgress, getByTourProgressAndCheckpoint, updateCheckpointProgress } from "@/services/progress"
import { useUser } from "@/hooks/useUser"
import AudioVideo from "../../components/audio_player/AudioImage"

interface AudioData {
  id: string;
  fileUrl: string;
  image: string;
  transcript: string;
  videoUrl: string;
}

export default function AudioPlayerScreen() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const params = useLocalSearchParams<{ checkpointId: string; characterId: string; tourProgressId: string }>()
  const { checkpointId, characterId, tourProgressId } = params;
  const [audioData, setAudioData] = useState<AudioData | null>(null)
  const { user } = useUser()
  const [currentProgress, setCurrentProgress] = useState(0)
  const [currentAudioDataForCleanup, setCurrentAudioDataForCleanup] = useState<AudioData | null>(null);

  const saveTrackProgress = useCallback(async (progressSecs: number, trackData: AudioData) => {
    if (!user?.id || !params.checkpointId || !trackData.id || !params.tourProgressId) {
      console.log('SaveTrackProgress: Missing critical IDs.', {
        userId: user?.id, checkpointId: params.checkpointId, audioId: trackData.id, tourProgressId: params.tourProgressId
      });
      return;
    }
    try {
      const existingCheckpointData = await getByTourProgressAndCheckpoint(params.tourProgressId, params.checkpointId);
      const existingCheckpointProgress = existingCheckpointData.response;
      if (existingCheckpointProgress) {
        const progressDataToUpdate = {
          progressSeconds: progressSecs,
          isCompleted: existingCheckpointProgress.isCompleted || false,
          lastListenedTime: new Date().toISOString()
        };
        if (progressSecs > existingCheckpointProgress.progressSeconds) {
          await updateCheckpointProgress(existingCheckpointProgress.id, progressDataToUpdate);
        }
      } else {
        const progressDataToCreate = {
          userTourProgressId: params.tourProgressId,
          tourCheckpointId: params.checkpointId,
          checkpointAudioId: trackData.id,
          progressSeconds: progressSecs,
          isCompleted: false,
          lastListenedTime: new Date().toISOString()
        };
        await createCheckpointProgress(progressDataToCreate);
      }
    } catch (error) {
      console.error('Error in saveTrackProgress:', error);
    }
  }, [user?.id, params.checkpointId, params.tourProgressId]);

  useEffect(() => {
    const fetchAndSetAudioData = async () => {
      if (checkpointId && characterId) {
        const response = await getTourAudioByCheckpointId(checkpointId, characterId)
        if (response && response.response) {
          setCurrentAudioDataForCleanup(audioData);
          setAudioData(response.response)
        } else {
          setCurrentAudioDataForCleanup(audioData);
          setAudioData(null)
        }
      }
    }
    fetchAndSetAudioData()
  }, [checkpointId, characterId])

  useEffect(() => {
    let isMounted = true
    let activeSoundInstance: Audio.Sound | null = null;

    const loadSound = async () => {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      setCurrentProgress(0);
      setIsPlaying(false);

      if (!audioData?.fileUrl) {
        return;
      }

      try {
        const { sound: newSound, status } = await Audio.Sound.createAsync(
          { uri: audioData.fileUrl },
          { shouldPlay: false },
          onPlaybackStatusUpdate
        );
        if (isMounted) {
          activeSoundInstance = newSound;
          setSound(newSound);
        }
      } catch (error) {
        console.error("Error loading sound:", error);
        if (isMounted) setSound(null);
      }
    };

    loadSound();

    return () => {
      isMounted = false;
      if (currentAudioDataForCleanup && currentProgress > 0 && activeSoundInstance) {
        console.log(`Cleanup: Saving progress for ${currentAudioDataForCleanup.id} at ${currentProgress}s`);
        saveTrackProgress(currentProgress, currentAudioDataForCleanup);
      }
      if (activeSoundInstance) {
        console.log(`Cleanup: Unloading sound for ${currentAudioDataForCleanup?.id || 'unknown'}`);
        activeSoundInstance.unloadAsync();
      }
      if (sound === activeSoundInstance) {
        setSound(null);
      }
    };
  }, [audioData, saveTrackProgress]);

  const onPlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setCurrentProgress(Math.ceil(status.positionMillis / 1000))
      if (status.didJustFinish) {
        setIsPlaying(false)
        if (typeof status.durationMillis === 'number' && user?.id && checkpointId && audioData?.id && tourProgressId) {
          try {
            const existingProgressData = await getByTourProgressAndCheckpoint(tourProgressId, checkpointId);
            const existingProgress = existingProgressData.response;
            const totalDuration = Math.ceil(status.durationMillis / 1000);
            const progressData = {
              progressSeconds: totalDuration,
              isCompleted: true,
              lastListenedTime: new Date().toISOString()
            };
            if (existingProgress) {
              await updateCheckpointProgress(existingProgress.id, progressData);
            } else {
              await createCheckpointProgress({
                ...progressData,
                userTourProgressId: tourProgressId,
                tourCheckpointId: checkpointId,
                checkpointAudioId: audioData.id
              });
            }
          } catch (error) {
            console.error('Error updating checkpoint progress on completion:', error);
          }
        } else if (status.didJustFinish) {
          console.warn("Audio finished but durationMillis is not available. Progress might not be marked as complete accurately.");
        }
      }
    }
  };

  const prepareForTrackChangeOrExit = async () => {
    if (sound) {
      await sound.stopAsync();
      if (currentProgress > 0 && audioData) {
        console.log(`Explicit Save: Saving progress for ${audioData.id} at ${currentProgress}s`);
        await saveTrackProgress(currentProgress, audioData);
      }
      console.log(`Explicit Unload: Unloading sound for ${audioData?.id}`);
      await sound.unloadAsync();
      setSound(null);
    }
    setCurrentProgress(0);
    setIsPlaying(false);
  };

  const togglePlayPause = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNextAudio = async () => {
    await prepareForTrackChangeOrExit();
    const res = await getNextAudioByCheckpointId(checkpointId);
    if (res.response?.id) {
      router.setParams({ checkpointId: res.response.id });
    } else {
      console.log("No next audio found or no ID in response.");
    }
  };

  const handlePrevAudio = async () => {
    await prepareForTrackChangeOrExit();
    const res = await getPrevAudioByCheckpointId(checkpointId);
    if (res.response?.id) {
      router.setParams({ checkpointId: res.response.id });
    } else {
      console.log("No previous audio found or no ID in response.");
    }
  };

  const handleBack = async () => {
    await prepareForTrackChangeOrExit();
    router.back();
  };

  if (!audioData) {
    return (
      <SafeAreaView style={styles.container}>
        <AudioHeader onBackPress={handleBack} checkpointId={checkpointId as string} />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AudioHeader onBackPress={handleBack} checkpointId={checkpointId as string} />
      <AudioVideo videoUrl={audioData.videoUrl} />
      <PlayerControls
        isPlaying={isPlaying}
        onPlayPause={togglePlayPause}
        onNext={handleNextAudio}
        onPrevious={handlePrevAudio}
      />
      <ScrollView style={{ flex: 1, margin: 20 }} showsVerticalScrollIndicator={false}>
        <Transcript text={audioData.transcript} />
      </ScrollView>
    </SafeAreaView>
  );
}

