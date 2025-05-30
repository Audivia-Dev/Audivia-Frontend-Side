import { useEffect, useState } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  FlatList,
  StatusBar,
  Alert,
  StyleSheet,
} from "react-native"
import { Ionicons, FontAwesome } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { styles } from "@/styles/filter_tour.styles"
import { getToursByTypeId, getAllTours } from "@/services/tour"
import { useUser } from "@/hooks/useUser"
import { COLORS } from "@/constants/theme"
import { createSaveTour } from "@/services/save_tour"
import { NotificationButton } from "@/components/common/NotificationButton"
import { BackButton } from "@/components/common/BackButton"
import { ChatMessageButton } from "@/components/common/ChatMessage"
import { LinearGradient } from "expo-linear-gradient"


export default function FilterTourScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { typeId, tourTypeName } = useLocalSearchParams()
  const [tours, setTours] = useState([])
  const { user } = useUser()

  useEffect(() => {
    const fetchTours = async () => {
      try {
        let response;
        if (typeId) {
          response = await getToursByTypeId(typeId as string)
        } else {
          response = await getAllTours()
        }
        setTours(response.response.data)
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tour:", error)
      }
    }
    fetchTours()
  }, [typeId])

  const navigateToTourDetail = (tourId: string) => {
    router.push(`/detail_tour?tourId=${tourId}`)
  }
  const handleSaveTour = async (tourId: string) => {
    try {
      await createSaveTour(user?.id as string, tourId)
      Alert.alert("Đã lưu tour", "Tour đã được thêm vào danh sách yêu thích.")
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu tour.")
    }
  }
  const renderTourItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.tourCard} onPress={() => navigateToTourDetail(item.id)}>
      <View>
        {/* Image */}
        <Image source={{ uri: item.thumbnailUrl || "https://maps.googleapis.com/maps/api/staticmap?center=10.8700,106.8030&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C10.8700,106.8030&key=YOUR_API_KEY" }} style={styles.tourImage} />
      </View>

      {/* Tour Info */}
      <View style={styles.tourInfo}>
        {/* Heart Button */}
        <TouchableOpacity style={styles.favoriteButton} onPress={() => handleSaveTour(item.id)}>
          <FontAwesome name="heart" size={20} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Tour Name */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 4 }} numberOfLines={2}>{item.title}</Text>

        {/* Location */}
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>

        {/* Tour Description */}
        <View style={styles.locationContainer}>
          <Ionicons name="information-circle-outline" size={16} color="#666" />
          <Text style={{ fontSize: 16, color: COLORS.grey, marginLeft: 4 }} numberOfLines={2}>{item.description}</Text>
        </View>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <FontAwesome name="star" size={16} color={COLORS.orange} />
          <Text style={styles.ratingText}>
            {item.avgRating}
          </Text>
        </View>

          {/* Price and Book Button Container */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Price */}
            <View style={styles.priceTag}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.primary }}>
                {item.price === 0 ? "Miễn phí" : ` ${item.price} Đ`}
              </Text>
            </View>

            {/* Book Button */}
            <TouchableOpacity
              onPress={() => navigateToTourDetail(item.id)}
            >
              <View style={[
                styles.bookButton,
                {
                  
                }
              ]}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.purpleGradient]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.bookButton}
                >
                  <Text style={styles.bookButtonText}>
                    Đặt Ngay
                  </Text>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </View>
        </View>

    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.backIcon}>
          <BackButton />
          </View>
          <Text style={{ fontSize: 24, color: COLORS.darkGrey, marginLeft: 10, }}>Lọc Tour</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.notification}>
            <NotificationButton />
          </View>
          <View style={styles.chat}>
            <ChatMessageButton />
          </View>
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <View>
          <Text style={styles.title}>{tourTypeName || "Tất cả tour"}</Text>
          <Text style={styles.subtitle}>{tours.length} tour audio khả dụng</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.primary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm địa điểm để khám phá"
          placeholderTextColor={COLORS.grey}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={COLORS.grey} />
          </TouchableOpacity>
        )}
      </View>

      {/* Tour List */}
      <FlatList
        data={tours}
        renderItem={renderTourItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.tourList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

