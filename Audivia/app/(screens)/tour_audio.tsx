import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "@/constants/theme"
import { router, useLocalSearchParams, useRouter } from "expo-router"
import styles from "@/styles/tour_audio.styles"
import { useEffect, useState } from "react"
import { Tour } from "@/models"
import { getTourById } from "@/services/tour"
import { useUser } from "@/hooks/useUser"
import { checkUserPurchasedTour } from "@/services/historyTransaction"

export default function TourAudioScreen() {
    const router = useRouter()
    const { tourId } = useLocalSearchParams()
    const [tour, setTour] = useState<Tour>()
    const {user} = useUser()
    const [characterId, setCharacterId] = useState(null)
    useEffect(() => {
        const fetchTourById = async () => {
          const response = await getTourById(tourId as string)
          setTour(response.response)
        }
        fetchTourById()
        if (user?.id) {
          checkIfUserPurchasedTour()
        }
      }, [user?.id, tourId])

  const checkIfUserPurchasedTour = async () => {
        if (!user?.id) return
        const response = await checkUserPurchasedTour(user?.id, tourId as string)
        console.log('HHUHU',response)
        setCharacterId(response.audioCharacterId)
      }
  const handleBack = () => {
    router.back()
  }
  const handleAudioPlay = (checkpointId: string) => {
    if (!characterId) {
      console.error('No character ID found. Please select a character first.')
      return
    }
    router.push(`/audio_player?checkpointId=${checkpointId}&characterId=${characterId}`)
  }
  const handleEndtour = () => {
    router.push(`/(screens)/end_tour_confirm?tourId=${tourId}`)
  }
  return (
    <SafeAreaView style={styles.container}>
        {/* Header */}
      <View style={styles.headerContainer}>
        <Image source={{
            uri: tour?.thumbnailUrl,
          }}
          style={styles.headerImage}
        />
      </View>
      {/* Back Button */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
      >
        {/* Tour Title */}
        <View
          style={styles.titleContainer}
        >
          <Text style={styles.title}>{tour?.title}</Text>
        </View>

        {/* Tour Stops */}
        <View style={styles.stopsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Các trạm</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>Xem bản đồ</Text>
              <Ionicons name="map-outline" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {tour?.checkpoints.map((stop) => (
            <TouchableOpacity key={stop.id} style={styles.stopItem} onPress={() => handleAudioPlay(stop.id)}>
              <View style={[styles.stopNumber, { backgroundColor: COLORS.secondary }]}>
              </View>
              <View style={styles.stopInfo}>
                <Text style={styles.stopTitle}>{stop.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={{ marginHorizontal: 20, marginVertical: 15 }} onPress={handleEndtour}>
          <View style={{
            backgroundColor: COLORS.primary,
            paddingVertical: 15,
            paddingHorizontal: 20,
            borderRadius: 12,
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
            <Text style={{
              color: "white",
              fontSize: 16,
              fontWeight: "600",
            }}>Kết thúc</Text>
          </View>
        </TouchableOpacity>
        {/* Bottom spacing for fixed details panel */}
        <View style={{ height: 220 }} />
      </ScrollView>

      {/* Fixed Experience Details */}
      <View style={styles.fixedDetailsContainer}>
        <View style={styles.detailsHeader}>
          <Text style={styles.detailsTitle}>Kinh nghiệm thực tế</Text>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={20} color={COLORS.primary} style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>Tổng thời gian</Text>
              <Text style={styles.detailValue}>{tour?.duration} giờ</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="sunny-outline" size={20} color={COLORS.primary} style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>THời gian tuyệt nhất</Text>
              <Text style={styles.detailValue}>Buổi sáng</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="walk-outline" size={20} color={COLORS.primary} style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>Độ khó</Text>
              <Text style={styles.detailValue}>Dễ</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="cash-outline" size={20} color={COLORS.primary} style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>Giá</Text>
              <Text style={styles.detailValue}>{tour?.price} VND</Text>
            </View>
          </View>
        </View>

      </View>
     
    </SafeAreaView>
  )
}

