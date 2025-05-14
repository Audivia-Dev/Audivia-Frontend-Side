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
} from "react-native"
import { Ionicons, FontAwesome } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { styles } from "@/styles/filter_tour.styles"
import { getToursByTypeId } from "@/services/tour"
import { useUser } from "@/hooks/useUser"
import { COLORS } from "@/constants/theme"
import { createSaveTour } from "@/services/save_tour"


export default function FilterTourScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { typeId, tourTypeName } = useLocalSearchParams()
  const [tours, setTours] = useState([])
  const {user} = useUser()
  
  useEffect(() => {
    const fetchToursByTypeId = async () => {
      try{
        const response = await getToursByTypeId(typeId as string)
        setTours(response.response.data)
      }catch(error){
        console.error("Lỗi khi lấy danh sách tour:", error)
      }
    }
    fetchToursByTypeId()
  }, [typeId])
 
  const navigateToTourDetail = (tourId: string) => {
    router.push(`/detail_tour?tourId=${tourId}`)
  }
  const handleSaveTour = async (tourId: string) => {
    try {
      await createSaveTour(user?.id, tourId)
      Alert.alert("Đã lưu tour", "Tour đã được thêm vào danh sách yêu thích.")
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu tour.")
    }
  }
  const goBack = () => {
    router.back()
  }

  const renderTourItem = ({ item }: { item: any }) => (
    
    <TouchableOpacity style={styles.tourCard} onPress={() => navigateToTourDetail(item.id)}>
       <TouchableOpacity style={styles.favoriteButton} onPress={() => handleSaveTour(item.id)}>
          <Ionicons name="heart-outline" size={20} color={COLORS.light} />
        </TouchableOpacity>
      <Image source={{ uri: item.thumbnailUrl || "https://maps.googleapis.com/maps/api/staticmap?center=10.8700,106.8030&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C10.8700,106.8030&key=YOUR_API_KEY" }} style={styles.tourImage} />
      <View style={styles.priceTag}>
        <Text style={styles.priceText}>{item.price === 0 ? "Miễn phí" : `${item.price} VND`}</Text>
      </View>

      <View style={styles.tourInfo}>
        <Text style={styles.tourName}>{item.title}</Text>

        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.locationText}>{item.description}</Text>
        </View>

          <View style={styles.durationContainer}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.durationText}>{item.duration} giờ</Text>
          </View>

          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color={COLORS.orange} />
            <Text style={styles.ratingText}>
              {item.avgRating}
            </Text>
          </View>

        <TouchableOpacity style={styles.bookButton} onPress={() => navigateToTourDetail(item.id)}>
          <Text style={styles.bookButtonText}>Đặt Ngay</Text>
        </TouchableOpacity>
      </View>

    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lọc Tour</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <Image source={{ uri: user?.avatarUrl }} style={styles.avatarImage} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <View>
          <Text style={styles.title}>{tourTypeName}</Text>
          <Text style={styles.subtitle}>{tours.length} tour audio khả dụng</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm địa điểm để khám phá"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#999" />
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

