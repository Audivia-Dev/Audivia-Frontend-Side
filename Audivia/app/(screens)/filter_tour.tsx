import { useState } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  FlatList,
  StatusBar,
} from "react-native"
import { Ionicons, FontAwesome } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { styles } from "@/styles/filter_tour.styles"

// Dữ liệu mẫu cho các tour lịch sử
const HISTORICAL_TOURS = [
  {
    id: "1",
    name: "Lăng Chủ tịch Hồ Chí Minh",
    image: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=1000&auto=format&fit=crop",
    price: 29,
    location: "Hà Nội",
    duration: "2 giờ",
    rating: 4.8,
    reviews: 128,
  },
  {
    id: "2",
    name: "Cố đô Huế",
    image: "https://images.unsplash.com/photo-1558321601-6de0f76ff4b8?q=80&w=1000&auto=format&fit=crop",
    price: 19,
    location: "Huế",
    duration: "3 giờ",
    rating: 4.7,
    reviews: 95,
  },
  {
    id: "3",
    name: "Phố cổ Hội An",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=1000&auto=format&fit=crop",
    price: 15,
    location: "Quảng Nam",
    duration: "2 giờ 30 phút",
    rating: 4.9,
    reviews: 210,
  },
]

export default function FilterTourScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("list") // list or grid
  const router = useRouter()

  const filteredTours = HISTORICAL_TOURS.filter((tour) => tour.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const navigateToTourDetail = (tourId: string) => {
    router.push(`/detail_tour`)
  }

  const goBack = () => {
    router.back()
  }

  const renderTourItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.tourCard} onPress={() => navigateToTourDetail(item.id)}>
      <Image source={{ uri: item.image }} style={styles.tourImage} />
      <View style={styles.priceTag}>
        <Text style={styles.priceText}>{item.price === 0 ? "Miễn phí" : `${item.price}$`}</Text>
      </View>

      <View style={styles.tourInfo}>
        <Text style={styles.tourName}>{item.name}</Text>

        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>

        <View style={styles.tourMeta}>
          <View style={styles.durationContainer}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>

          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>
              {item.rating} ({item.reviews})
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.bookButton} onPress={() => navigateToTourDetail(item.id)}>
          <Text style={styles.bookButtonText}>Đặt Ngay</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mascotContainer}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/5229/5229537.png",
          }}
          style={styles.mascotImage}
        />
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch Sử</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Title and View Mode */}
      <View style={styles.titleContainer}>
        <View>
          <Text style={styles.title}>Tour Lịch Sử</Text>
          <Text style={styles.subtitle}>{filteredTours.length} tour audio khả dụng</Text>
        </View>
        <View style={styles.viewModeContainer}>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === "list" && styles.activeViewMode]}
            onPress={() => setViewMode("list")}
          >
            <Ionicons name="list" size={20} color={viewMode === "list" ? "#000" : "#999"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === "grid" && styles.activeViewMode]}
            onPress={() => setViewMode("grid")}
          >
            <Ionicons name="grid" size={20} color={viewMode === "grid" ? "#000" : "#999"} />
          </TouchableOpacity>
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
        data={filteredTours}
        renderItem={renderTourItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.tourList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

