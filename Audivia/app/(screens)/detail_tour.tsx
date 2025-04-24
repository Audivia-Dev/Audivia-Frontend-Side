"use client"

import { useEffect, useState } from "react"
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView } from "react-native"
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons"
import { useRouter, useLocalSearchParams } from "expo-router"
import { styles } from "@/styles/tour_detail.styles"
import type { Checkpoint, Tour } from "@/models"
import { getTourById } from "@/services/tour"
import { COLORS } from "@/constants/theme"

// Dữ liệu mẫu cho đánh giá
const SAMPLE_REVIEWS = [
  {
    id: "2",
    user: {
      name: "Trần Thị B",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    rating: 4,
    comment:
      "Tuyệt vời! Tour được thiết kế rất tốt và tôi đã tận hưởng từng phút. Một số phần của thông tin lịch sử có thể chi tiết hơn.",
    timeAgo: "1 tuần trước",
    likes: 18,
    replies: 3,
  },
  {
    id: "3",
    user: {
      name: "Lê Văn C",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    },
    rating: 5,
    comment:
      "Hoàn toàn yêu thích tour này! Người hướng dẫn thực sự rất thân thiện và am hiểu. Các điểm dừng chân được chọn lựa rất tốt. Chắc chắn sẽ giới thiệu cho bạn bè!",
    timeAgo: "2 tuần trước",
    likes: 31,
    replies: 4,
  },
]

export default function TourDetailScreen() {
  const [activeTab, setActiveTab] = useState("about")
  const router = useRouter()
  const { tourId } = useLocalSearchParams()
  const [tour, setTour] = useState<Tour>()

  useEffect(() => {
    const fetchTourById = async () => {
      const response = await getTourById(tourId as string)
      console.log("HEHE", response.response)
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
      <Image
        source={{
          uri:
            destination.imageUrl ||
            "https://maps.googleapis.com/maps/api/staticmap?center=10.8700,106.8030&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C10.8700,106.8030&key=YOUR_API_KEY",
        }}
        style={styles.destinationImage}
      />
      <Text style={styles.destinationName}>{destination.title}</Text>
      <View style={styles.destinationBadge}>
        <Text style={styles.destinationBadgeText}>{index + 1}</Text>
      </View>
    </View>
  )

  const renderReviewItem = (review: any) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Image source={{ uri: review.user.avatar }} style={styles.reviewerAvatar} />
        <View style={styles.reviewerInfo}>
          <Text style={styles.reviewerName}>{review.user.name}</Text>
          <View style={styles.reviewRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesome
                key={star}
                name={star <= review.rating ? "star" : "star-o"}
                size={14}
                color={COLORS.orange}
                style={styles.reviewStarIcon}
              />
            ))}
          </View>
        </View>
        <Text style={styles.reviewTime}>{review.timeAgo}</Text>
      </View>

      <Text style={styles.reviewComment}>{review.comment}</Text>
    </View>
  )

  const renderRouteItem = (item: any, index: number) => (
    <View style={styles.routeItem}>
      <View style={styles.routeNumberContainer}>
        <Text style={styles.routeNumber}>{index + 1}</Text>
      </View>
      <View style={styles.routeContent}>
        <Text style={styles.routeName}>{item.title}</Text>
        <Text style={styles.routeDescription}>{item.description || "Không có mô tả"}</Text>
      </View>
    </View>
  )

  const renderAboutTab = () => (
    <View>
      {/* Tour Title */}
      <View style={styles.tourTitleContainer}>
          <Text style={styles.tourName}>{tour?.title}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color={COLORS.primary} />
            <Text style={styles.locationText}>{tour?.checkpoints?.[0]?.title}</Text>
          </View>

          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesome
                  key={star}
                  name={
                    star <= Math.floor(tour?.avgRating || 0)
                      ? "star"
                      : star <= (tour?.avgRating || 0)
                        ? "star-half-o"
                        : "star-o"
                  }
                  size={16}
                  color={COLORS.orange}
                  style={styles.starIcon}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>{tour?.avgRating}</Text>
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
              <Text style={styles.overviewItemValue}>{tour?.checkpoints?.length || 0} nơi</Text>
            </View>
          </View>

          <View style={styles.overviewItem}>
            <Ionicons name="globe-outline" size={20} color={COLORS.primary} />
            <View style={styles.overviewItemTextContainer}>
              <Text style={styles.overviewItemLabel}>Ngôn ngữ</Text>
              <Text style={styles.overviewItemValue}>Tiếng Việt</Text>
            </View>
          </View>

          <View style={styles.overviewItem}>
            <Ionicons name="sunny-outline" size={20} color={COLORS.primary} />
            <View style={styles.overviewItemTextContainer}>
              <Text style={styles.overviewItemLabel}>Thời gian tốt nhất</Text>
              <Text style={styles.overviewItemValue}>Buổi sáng</Text>
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
          {tour?.checkpoints?.map((destination: Checkpoint, index: number) =>
            renderDestinationItem(destination, index),
          )}
        </ScrollView>
      </View>
    </View>
  )

  const renderBeforeTab = () => (
    <View style={styles.beforeContainer}>
      <Text style={styles.sectionTitle}>Tổng quan Lộ trình</Text>

      <View style={styles.startLocationContainer}>
        <View style={styles.startLocationIcon}>
          <Ionicons name="flag" size={20} color="#fff" />
        </View>
        <View>
          <Text style={styles.startLocationTitle}>Điểm bắt đầu</Text>
          <Text style={styles.startLocationText}>{tour?.checkpoints?.[0]?.title || "Điểm xuất phát"}</Text>
        </View>
      </View>

      <View>
        {tour?.checkpoints?.map((checkpoint, index) => renderRouteItem(checkpoint, index))}
      </View>
      <View style={styles.startLocationContainer}>
      <View style={styles.startLocationIcon}>
          <Ionicons name="flag" size={20} color={COLORS.red}/>
        </View>
          <View>
            <Text style={styles.startLocationTitle}>Điểm kết thúc</Text>
            <Text style={styles.startLocationText}>{tour?.checkpoints?.[tour?.checkpoints?.length - 1]?.title || "Điểm kết thúc"}</Text>
          </View>
      </View>
      <TouchableOpacity style={styles.viewMapButton}>
        <Ionicons name="map" size={18} color={COLORS.primary} />
        <Text style={styles.viewMapText}>Xem Bản đồ</Text>
      </TouchableOpacity>
    </View>
  )

  const renderReviewsTab = () => (
    <View style={styles.reviewsContainer}>
      <View style={styles.ratingOverview}>
        <Text style={styles.ratingBig}>{tour?.avgRating}</Text>
        <View style={styles.ratingStarsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <FontAwesome
              key={star}
              name={
                star <= Math.floor(tour?.avgRating || 4.8)
                  ? "star"
                  : star <= (tour?.avgRating || 4.8)
                    ? "star-half-o"
                    : "star-o"
              }
              size={16}
              color={COLORS.orange}
              style={styles.starIcon}
            />
          ))}
        </View>
        <Text style={styles.ratingCount}>Dựa trên {tour?.avgRating} đánh giá</Text>
      </View>

      <View style={styles.reviewsHeader}>
        <Text style={styles.sectionTitle}>Đánh giá Tour</Text>
      </View>

      {SAMPLE_REVIEWS.map((review) => renderReviewItem(review))}
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
        {/* Tab Content */}
        {activeTab === "about" && renderAboutTab()}
        {activeTab === "before" && renderBeforeTab()}
        {activeTab === "reviews" && renderReviewsTab()}

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
