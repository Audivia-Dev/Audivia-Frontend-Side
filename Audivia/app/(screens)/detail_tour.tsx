import { useEffect, useState } from "react"
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, StatusBar } from "react-native"
import { Ionicons, FontAwesome } from "@expo/vector-icons"
import { useRouter, useLocalSearchParams } from "expo-router"
import { styles } from "@/styles/tour_detail.styles"
import { Checkpoint, Tour } from "@/models"
import { getTourById } from "@/services/tour"
import { COLORS } from "@/constants/theme"

export default function TourDetailScreen() {
  const [activeTab, setActiveTab] = useState("about")
  const router = useRouter()
  const { tourId } = useLocalSearchParams()
  const [tour, setTour] = useState<Tour>()

  useEffect(() => {
    const fetchTourById = async () => {
      const response = await getTourById(tourId as string)
      console.log('HEHE',response.response)
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
    // router.push(`/tour-start?id=${tourId}`)
  }

  const renderDestinationItem = (destination: any, index: number) => (
    <View key={destination.id} style={styles.destinationItem}>
      <Image source={{ uri: destination.imageUrl || "https://maps.googleapis.com/maps/api/staticmap?center=10.8700,106.8030&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C10.8700,106.8030&key=YOUR_API_KEY" }} style={styles.destinationImage} />
      <Text style={styles.destinationName}>{destination.title}</Text>
      <View style={styles.destinationBadge}>
        <Text style={styles.destinationBadgeText}>{index + 1}</Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>

      {/* Header with Map */}
      <View style={styles.mapContainer}>
        <Image
          source={{
            uri: "https://maps.googleapis.com/maps/api/staticmap?center=10.8700,106.8030&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C10.8700,106.8030&key=YOUR_API_KEY",
          }}
          style={styles.mapImage}
        />

        <View style={styles.headerOverlay}>
          <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết Tour</Text>
          </View>
          <View>
          <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
            <Ionicons name="heart-outline" size={24} color="#fff" />
          </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "about" && styles.activeTab]}
          onPress={() => setActiveTab("about")}
        >
          <Text style={[styles.tabText, activeTab === "about" && styles.activeTabText]}>Giới thiệu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "before" && styles.activeTab]}
          onPress={() => setActiveTab("before")}
        >
          <Text style={[styles.tabText, activeTab === "before" && styles.activeTabText]}>Trước khi đi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "reviews" && styles.activeTab]}
          onPress={() => setActiveTab("reviews")}
        >
          <Text style={[styles.tabText, activeTab === "reviews" && styles.activeTabText]}>Đánh giá</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Tour Title */}
        <View style={styles.tourTitleContainer}>
          <Text style={styles.tourName}>{tour?.title}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#00BCD4" />
            <Text style={styles.locationText}>{tour?.checkpoints[0].title}</Text>
          </View>

          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesome
                  key={star}
                  name={star <= Math.floor(tour?.avgRating || 0) ? "star" : star <= (tour?.avgRating || 0) ? "star-half-o" : "star-o"}
                  size={16}
                  color="#FFD700"
                  style={styles.starIcon}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {tour?.avgRating}
            </Text>
          </View>

          <Text style={styles.priceText}>{tour?.price === 0 ? "Miễn phí" : `${tour?.price} VND`}</Text>
        </View>

        {/* Tour Overview */}
        <View style={styles.overviewContainer}>
          <Text style={styles.sectionTitle}>Tổng quan Tour</Text>

          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Ionicons name="time-outline" size={20} color={COLORS.primary} />
              <View style={styles.overviewItemTextContainer}>
                <Text style={styles.overviewItemLabel}>Thời lượng</Text>
                <Text style={styles.overviewItemValue}>{tour?.duration} giờ</Text>
              </View>
            </View>

            <View style={styles.overviewItem}>
              <Ionicons name="location" size={20} color={COLORS.primary} />
              <View style={styles.overviewItemTextContainer}>
                <Text style={styles.overviewItemLabel}>Tổng điểm đến</Text>
                <Text style={styles.overviewItemValue}>{tour?.checkpoints.length} nơi</Text>
              </View>
            </View>

            <View style={styles.overviewItem}>
              <Ionicons name="globe-outline" size={20} color={COLORS.primary} />
              <View style={styles.overviewItemTextContainer}>
                <Text style={styles.overviewItemLabel}>Ngôn ngữ</Text>
                <Text style={styles.overviewItemValue}>{tour?.price}</Text>
              </View>
            </View>

            <View style={styles.overviewItem}>
              <Ionicons name="sunny-outline" size={20} color={COLORS.primary} />
              <View style={styles.overviewItemTextContainer}>
                <Text style={styles.overviewItemLabel}>Thời gian tốt nhất</Text>
                <Text style={styles.overviewItemValue}>{tour?.price}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.descriptionText}>{tour?.description}</Text>
        </View>

        {/* Destinations */}
        <View style={styles.destinationsContainer}>
          <Text style={styles.sectionTitle}>Điểm đến</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destinationsScrollContent}
          >
            {tour?.checkpoints.map((destination: Checkpoint, index: number) => renderDestinationItem(destination, index))}
          </ScrollView>
        </View>

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

