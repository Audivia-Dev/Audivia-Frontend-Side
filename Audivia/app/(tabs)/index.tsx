import { Image, Text, TouchableOpacity, View, ScrollView, TextInput, Dimensions } from "react-native"
import { Ionicons, FontAwesome } from "@expo/vector-icons"
import styles from "@/styles/home.styles"
import { COLORS } from "@/constants/theme"
import { getTop3Tours } from "@/services/tour"
import { useEffect, useState, useRef } from "react"
import { Tour, TourType } from "@/models"
import { getTourTypes } from "@/services/tour_type"
import { useUser } from "@/hooks/useUser"
import { router } from "expo-router"
import { navigate } from "expo-router/build/global-state/routing"
import UserLocationMap from "@/components/UserLocationMap"


const carouselImages = [
  require('@/assets/images/benthanh.png'),
  require('@/assets/images/cung-dinh-hue.jpg'),
  require('@/assets/images/ben-nha-rong.jpg'),
  require('@/assets/images/lang-khai-dinh.jpg'),
  require('@/assets/images/nvh1.jpg'),
]

export default function Index() {
  const [top3Tours, setTop3Tours] = useState<Tour[]>([])
  const [tourTypes, setTourTypes] = useState<TourType[]>([])
  const { user } = useUser()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    getTop3Tours().then((res) => {
      setTop3Tours(res.response.data)
    })
  }, [])

  useEffect(() => {
    getTourTypes().then((res) => {
      setTourTypes(res.response)
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % carouselImages.length
        scrollViewRef.current?.scrollTo({
          x: newIndex * Dimensions.get('window').width,
          animated: true
        })
        return newIndex
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleCategoryPress = (typeId: string) => {
    router.push(`/filter_tour?typeId=${typeId}&tourTypeName=${tourTypes.find(type => type.id === typeId)?.name}`)
  }
  const handleTourPress = (tourId: string) => {
    router.push(`/detail_tour?tourId=${tourId}`)
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Trang chủ</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.dark} style={styles.icon} />
          <TouchableOpacity onPress={() => router.push('/(screens)/message_inbox')}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color={COLORS.dark} style={styles.icon} />
          </TouchableOpacity>
          <View style={styles.avatarWrapper}>
            {user?.avatarUrl ? (
              <Image
                source={{ uri: user?.avatarUrl }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="person-circle-outline" size={22} color={COLORS.primary} />
            )}
          </View>
        </View>
      </View>

      <View style={styles.locationContainer}>
        <Ionicons name="location-outline" size={18} color="#000" />
        <Text style={styles.locationText}>Thu Duc, HCM</Text>
      </View>
     
      <ScrollView showsVerticalScrollIndicator={false}>
         {/* Main Image Carousel */}
         <View style={styles.mainImageContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              const contentOffset = event.nativeEvent.contentOffset
              const index = Math.round(contentOffset.x / Dimensions.get('window').width)
              setCurrentImageIndex(index)
            }}
            scrollEventThrottle={16}
            style={{ width: '100%', height: 200 }}
          >
            {carouselImages.map((image, index) => (
              <Image
                key={index}
                source={image}
                style={[styles.mainImage, { width: Dimensions.get('window').width, height: 200 }]}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          <View style={styles.carouselIndicators}>
            {carouselImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentImageIndex && styles.activeIndicator
                ]}
              />
            ))}
          </View>
        </View>
      
        {/* Categories */}
        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Danh mục</Text>
          </View>

          <View style={styles.categoriesContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {tourTypes.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryItem}
                  onPress={() => handleCategoryPress(category.id)}
                >
                  <View style={styles.categoryIconContainer}>
                    <Ionicons name="location-outline" size={24} color={COLORS.primary} />
                  </View>
                  <Text style={styles.categoryName} numberOfLines={2}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

         {/* Google Map View */}
         <View style={{ alignItems: 'center', width: '100%' }}>
           <UserLocationMap width={Dimensions.get('window').width - 40} />
         </View>

        {/* Suggested Tours */}
        <View style={styles.toursSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Các địa điểm được đề xuất</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.tourSubtitle}>Dựa trên sở thích và vị trí của bạn</Text>

          <View style={styles.tourCard}>
            <Image
              source={require('../../assets/images/nvh1.jpg')}
              style={styles.tourImage}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart-outline" size={20} color={COLORS.light} />
            </TouchableOpacity>

            <View style={styles.tourDetails}>
              <Text style={styles.tourName}>NHÀ VĂN HÓA SINH VIÊN</Text>
              <Text style={styles.tourLocation}>HCM, Vietnam</Text>

              <View style={styles.tourRating}>
                <FontAwesome name="star" size={14} color={COLORS.orange} />
                <Text style={styles.ratingText}>4.6 • 2 giờ</Text>
              </View>

              <View style={styles.tourFooter}>
                <Text style={styles.freeTag}>Miễn phí</Text>
                <TouchableOpacity style={styles.bookButton}>
                  <Text style={styles.bookButtonText}>Đặt ngay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Top Places */}
        <View style={styles.topPlacesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>3 địa điểm nổi bật</Text>
          </View>

          {Array.isArray(top3Tours) && top3Tours.map((tour, index) => (
              <TouchableOpacity  key={index} style={styles.placeItem} onPress={() => handleTourPress(tour.id)}>
              {tour.thumbnailUrl? (
                <Image
                source={{ uri: tour.thumbnailUrl }}
                style={styles.placeImage}
                resizeMode="cover"
              />
              ): <Text>No image</Text>}
              <View style={styles.placeDetails}>
                <Text style={styles.placeName}>{tour.title}</Text>
                <Text style={styles.placeRating}>★★★★☆ {tour.avgRating} • {tour.duration} giờ</Text>
                <Text style={styles.placePrice}>{tour.price} VND</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

