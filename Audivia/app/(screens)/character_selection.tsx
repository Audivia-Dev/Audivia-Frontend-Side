import { COLORS } from '@/constants/theme';
import styles from '@/styles/character_selection';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

const CharacterSelectionScreen = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const characters = [
    {
      id: 1,
      name: 'Luna',
      gender: 'Female',
      voiceDescription: 'Friendly and cheerful',
      image: 'https://via.placeholder.com/150',
      color: '#FF9EE5', // Pink
      emoji: '👧',
    },
    {
      id: 2,
      name: 'Max',
      gender: 'Male',
      voiceDescription: 'Energetic and fun',
      image: 'https://via.placeholder.com/150',
      color: '#92E3A9', // Green
      emoji: '👦',
    },
    {
      id: 3,
      name: 'Mia',
      gender: 'Female',
      voiceDescription: 'Soft and gentle',
      image: 'https://via.placeholder.com/150',
      color: '#8ECDFF', // Blue
      emoji: '👩',
    },
    {
      id: 4,
      name: 'Leo',
      gender: 'Male',
      voiceDescription: 'Deep and clear',
      image: 'https://via.placeholder.com/150',
      color: '#FFD166', // Yellow
      emoji: '👨',
    },
    {
      id: 5,
      name: 'Robo',
      gender: 'Neutral',
      voiceDescription: 'Digital and precise',
      image: 'https://via.placeholder.com/150',
      color: '#B088F9', // Purple
      emoji: '🤖',
    },
  ];

  const handleSelectCharacter = (character) => {
    setSelectedCharacter(character);
  };

  const handleConfirm = () => {
    console.log('Selected character voice:', selectedCharacter);
    // Apply the selected voice to your audio tour
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.title}>Choose a Voice</Text>
        <Text style={styles.subtitle}>Select a character voice for your audio tour</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarsContainer}>
          {characters.map((character) => (
            <TouchableOpacity
              key={character.id}
              style={[
                styles.avatarWrapper,
                selectedCharacter?.id === character.id && styles.selectedAvatarWrapper
              ]}
              onPress={() => handleSelectCharacter(character)}
              activeOpacity={0.8}
            >
              <View 
                style={[
                  styles.avatarCircle,
                  { backgroundColor: character.color + '40' },
                  selectedCharacter?.id === character.id && { 
                    borderColor: character.color,
                    backgroundColor: character.color + '20',
                  }
                ]}
              >
                <Text style={styles.emoji}>{character.emoji}</Text>
              </View>
              <Text style={styles.characterName}>{character.name}</Text>
              <View style={[styles.genderBadge, { backgroundColor: character.color }]}>
                <Text style={styles.genderText}>{character.gender}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {selectedCharacter && (
          <View style={styles.selectedCharacterInfo}>
            <View style={[styles.infoCard, { backgroundColor: selectedCharacter.color + '15' }]}>
              <View style={styles.infoHeader}>
                <View style={[styles.miniAvatar, { backgroundColor: selectedCharacter.color + '40' }]}>
                  <Text style={styles.miniEmoji}>{selectedCharacter.emoji}</Text>
                </View>
                <View style={styles.infoText}>
                  <Text style={styles.infoName}>{selectedCharacter.name}</Text>
                  <Text style={[styles.infoGender, { color: selectedCharacter.color }]}>
                    {selectedCharacter.gender} Voice
                  </Text>
                </View>
              </View>
              <Text style={styles.voiceDescription}>
                Voice characteristics: {selectedCharacter.voiceDescription}
              </Text>
              <TouchableOpacity 
                style={[styles.previewButton, { backgroundColor: selectedCharacter.color }]}
              >
                <Text style={styles.previewButtonText}>Preview Voice</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            !selectedCharacter && styles.disabledButton,
            selectedCharacter && { backgroundColor: selectedCharacter.color }
          ]}
          disabled={!selectedCharacter}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmButtonText}>
            Use This Voice
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


export default CharacterSelectionScreen;