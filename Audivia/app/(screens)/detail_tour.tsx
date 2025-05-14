import { useEffect, useState } from "react"
import { View, TouchableOpacity, Text, SafeAreaView, ScrollView } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { styles } from "@/styles/tour_detail.styles"
import type { Tour } from "@/models"
import { getTourById } from "@/services/tour"
import { TourHeader } from "@/components/detail_tour/TourHeader"
import { AboutTab } from "@/components/detail_tour/AboutTab"
import { BeforeTab } from "@/components/detail_tour/BeforeTab"
import { ReviewsTab } from "@/components/detail_tour/ReviewsTab"
import { TourTabs } from "@/components/detail_tour/TourTabs"

export default function TourDetailScreen() {
  const [activeTab, setActiveTab] = useState("about")
  const router = useRouter()
  const { tourId } = useLocalSearchParams()
  const [tour, setTour] = useState<Tour>()

  useEffect(() => {
    const fetchTourById = async () => {
      const response = await getTourById(tourId as string)
      setTour(response.response)
    }
    fetchTourById()
  }, [])

  const goBack = () => {
    router.back()
  }

  const toggleFavorite = () => {
    // Xử lý thêm vào danh sách yêu thích
  }

  const startTour = () => {
    // Xử lý bắt đầu tour
    router.push(`/tour_audio?tourId=${tourId}`)
  }

  return (
    <SafeAreaView style={styles.container}>
      <TourHeader onBack={goBack} onToggleFavorite={toggleFavorite} />
      
      <TourTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Tab Content */}
        {activeTab === "about" && <AboutTab tour={tour} />}
        {activeTab === "before" && <BeforeTab tour={tour} />}
        {activeTab === "reviews" && <ReviewsTab tour={tour} />}

        {/* Bottom spacing */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Start Button */}
      <View style={styles.startButtonContainer}>
        <TouchableOpacity style={styles.startButton} onPress={startTour}>
          <Text style={styles.startButtonText}>Bắt đầu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
