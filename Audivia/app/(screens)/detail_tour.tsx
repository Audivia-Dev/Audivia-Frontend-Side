
import { useState } from "react"
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, StatusBar } from "react-native"
import { Ionicons, FontAwesome } from "@expo/vector-icons"
import { useRouter, useLocalSearchParams } from "expo-router"
import { styles } from "@/styles/tour_detail.styles"

// Dữ liệu mẫu cho chi tiết tour
const TOUR_DETAILS = {
  "1": {
    id: "1",
    name: "Lăng Chủ tịch Hồ Chí Minh",
    location: "Hà Nội",
    rating: 4.8,
    reviews: 128,
    price: 29,
    duration: "2 giờ",
    language: "Tiếng Việt",
    placesTotal: 5,
    bestTime: "Buổi sáng",
    description:
      "Lăng Chủ tịch Hồ Chí Minh là công trình lịch sử văn hóa quan trọng của Việt Nam, nơi lưu giữ thi hài của Chủ tịch Hồ Chí Minh. Công trình này được xây dựng từ năm 1973 đến 1975, với kiến trúc đặc trưng và ý nghĩa lịch sử sâu sắc.",
    destinations: [
      {
        id: "d1",
        name: "Quảng trường Ba Đình",
        image: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=1000&auto=format&fit=crop",
      },
      {
        id: "d2",
        name: "Bảo tàng Hồ Chí Minh",
        image: "https://images.unsplash.com/photo-1599707312320-1a3608fcbf31?q=80&w=1000&auto=format&fit=crop",
      },
      {
        id: "d3",
        name: "Nhà sàn Bác Hồ",
        image: "https://images.unsplash.com/photo-1599707387765-f6471e2e09d7?q=80&w=1000&auto=format&fit=crop",
      },
    ],
  },
  "2": {
    id: "2",
    name: "Cố đô Huế",
    location: "Huế",
    rating: 4.7,
    reviews: 95,
    price: 19,
    duration: "3 giờ",
    language: "Tiếng Việt",
    placesTotal: 8,
    bestTime: "Buổi sáng",
    description:
      "Cố đô Huế là quần thể di tích lịch sử văn hóa gắn liền với triều đại nhà Nguyễn, được UNESCO công nhận là Di sản Văn hóa Thế giới. Quần thể này bao gồm Kinh thành Huế, các lăng tẩm vua chúa và các công trình kiến trúc nghệ thuật đặc sắc.",
    destinations: [
      {
        id: "d1",
        name: "Đại Nội",
        image: "https://images.unsplash.com/photo-1558321601-6de0f76ff4b8?q=80&w=1000&auto=format&fit=crop",
      },
      {
        id: "d2",
        name: "Lăng Tự Đức",
        image: "https://images.unsplash.com/photo-1558321608-2a96b3e7e13f?q=80&w=1000&auto=format&fit=crop",
      },
      {
        id: "d3",
        name: "Chùa Thiên Mụ",
        image: "https://images.unsplash.com/photo-1558321630-78ea9ca27c1d?q=80&w=1000&auto=format&fit=crop",
      },
    ],
  },
  "3": {
    id: "3",
    name: "Nhà Văn hóa ĐHQG TP.HCM",
    location: "Bình Dương",
    rating: 4.8,
    reviews: 47,
    price: 0,
    duration: "40 phút",
    language: "Tiếng Việt",
    placesTotal: 6,
    bestTime: "Buổi sáng",
    description:
      "Nhà Văn hóa ĐHQG TP.HCM là trung tâm văn hóa nằm trong khuôn viên rộng hơn 3 hecta, với nhiều chức năng phục vụ hoạt động của sinh viên. Công trình bao gồm các không gian học tập, thư viện, phòng triển lãm, không gian sinh hoạt chung, rạp chiếu phim...",
    destinations: [
      {
        id: "d1",
        name: "Thư viện",
        image: "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=1000&auto=format&fit=crop",
      },
      {
        id: "d2",
        name: "Không gian triển lãm",
        image: "https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=1000&auto=format&fit=crop",
      },
      {
        id: "d3",
        name: "Khu vực ngoài trời",
        image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1000&auto=format&fit=crop",
      },
    ],
  },
}

export default function TourDetailScreen() {
  const [activeTab, setActiveTab] = useState("about")
  const router = useRouter()
  const searchParams = useLocalSearchParams()
  const tourId = searchParams.id || "3"

  const tour = TOUR_DETAILS[tourId as keyof typeof TOUR_DETAILS]

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
      <Image source={{ uri: destination.image }} style={styles.destinationImage} />
      <Text style={styles.destinationName}>{destination.name}</Text>
      <View style={styles.destinationBadge}>
        <Text style={styles.destinationBadgeText}>{index + 1}</Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#006064" />

      {/* Header with Map */}
      <View style={styles.mapContainer}>
        <Image
          source={{
            uri: "https://maps.googleapis.com/maps/api/staticmap?center=10.8700,106.8030&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C10.8700,106.8030&key=YOUR_API_KEY",
          }}
          style={styles.mapImage}
        />

        <View style={styles.headerOverlay}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết Tour</Text>
          <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
            <Ionicons name="heart-outline" size={24} color="#fff" />
          </TouchableOpacity>
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
          <Text style={styles.tourName}>{tour.name}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#00BCD4" />
            <Text style={styles.locationText}>{tour.location}</Text>
          </View>

          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesome
                  key={star}
                  name={star <= Math.floor(tour.rating) ? "star" : star <= tour.rating ? "star-half-o" : "star-o"}
                  size={16}
                  color="#FFD700"
                  style={styles.starIcon}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {tour.rating} ({tour.reviews})
            </Text>
          </View>

          <Text style={styles.priceText}>{tour.price === 0 ? "Miễn phí" : `${tour.price}$`}</Text>
        </View>

        {/* Tour Overview */}
        <View style={styles.overviewContainer}>
          <Text style={styles.sectionTitle}>Tổng quan Tour</Text>

          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Ionicons name="time-outline" size={20} color="#00BCD4" />
              <View style={styles.overviewItemTextContainer}>
                <Text style={styles.overviewItemLabel}>Thời lượng</Text>
                <Text style={styles.overviewItemValue}>{tour.duration}</Text>
              </View>
            </View>

            <View style={styles.overviewItem}>
              <Ionicons name="location" size={20} color="#00BCD4" />
              <View style={styles.overviewItemTextContainer}>
                <Text style={styles.overviewItemLabel}>Tổng điểm đến</Text>
                <Text style={styles.overviewItemValue}>{tour.placesTotal}</Text>
              </View>
            </View>

            <View style={styles.overviewItem}>
              <Ionicons name="globe-outline" size={20} color="#00BCD4" />
              <View style={styles.overviewItemTextContainer}>
                <Text style={styles.overviewItemLabel}>Ngôn ngữ</Text>
                <Text style={styles.overviewItemValue}>{tour.language}</Text>
              </View>
            </View>

            <View style={styles.overviewItem}>
              <Ionicons name="sunny-outline" size={20} color="#00BCD4" />
              <View style={styles.overviewItemTextContainer}>
                <Text style={styles.overviewItemLabel}>Thời gian tốt nhất</Text>
                <Text style={styles.overviewItemValue}>{tour.bestTime}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.descriptionText}>{tour.description}</Text>
          <TouchableOpacity>
            <Text style={styles.seeMoreText}>Xem thêm</Text>
          </TouchableOpacity>
        </View>

        {/* Destinations */}
        <View style={styles.destinationsContainer}>
          <Text style={styles.sectionTitle}>Điểm đến</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destinationsScrollContent}
          >
            {tour.destinations.map((destination, index) => renderDestinationItem(destination, index))}
          </ScrollView>
        </View>

        {/* Mascot */}
        <View style={styles.mascotContainer}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/5229/5229537.png",
            }}
            style={styles.mascotImage}
          />
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

