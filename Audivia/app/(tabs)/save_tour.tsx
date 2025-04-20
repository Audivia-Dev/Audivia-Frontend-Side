import { useState } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { COLORS } from "@/constants/theme"
import styles from "@/styles/save_tour.styles"

// Dữ liệu mẫu cho các tour đã lưu
const SAVED_TOURS = [
  {
    id: "2",
    name: "Tuyến Metro Số 1",
    image: require("@/assets/images/metro.jpg"),
    savedTime: "5 ngày trước",
    location: "TP.HCM",
    duration: "1 giờ 30 phút",
    rating: 4.8,
  },
  {
    id: "3",
    name: "Bảo tàng Lịch sử Việt Nam",
    image: require("@/assets/images/cung-dinh-hue.jpg"),
    savedTime: "1 tuần trước",
    location: "Quận 1, TP.HCM",
    duration: "3 giờ",
    rating: 4.5,
  },
  {
    id: "4",
    name: "Chợ Bến Thành",
    image: require("@/assets/images/benthanh.png"),
    savedTime: "3 tuần trước",
    location: "Quận 1, TP.HCM",
    duration: "2 giờ 30 phút",
    rating: 4.3,
  },
]

export default function SavedToursScreen() {
  const avatarUrl = "https://res.cloudinary.com/dgzn2ix8w/image/upload/v1745141656/Audivia/a1wqzwrxluklxcwubzrc.jpg"

  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const filteredTours = SAVED_TOURS.filter((tour) => tour.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const navigateToPlanTour = (tourId: string) => {
    router.push(`/plan_tour?id=${tourId}`)
  }

  const renderTourItem = ({ item }: { item: any }) => (
    <View style={styles.tourCard}>
      <Image source={item.image} style={styles.tourImage} />
      <View style={styles.tourContent}>
        <View style={styles.tourHeader}>
          <View>
            <Text style={styles.tourName}>{item.name}</Text>
            <Text style={styles.tourLocation}>
              <Ionicons name="location-outline" size={14} color={COLORS.grey} /> {item.location}
            </Text>
          </View>
          <View style={styles.tourRating}>
            <Ionicons name="star" size={16} color={COLORS.orange} />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>

        <View style={styles.tourFooter}>
          <Text style={styles.savedTime}>Đã lưu {item.savedTime}</Text>
          <View style={styles.tourActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigateToPlanTour(item.id)}>
              <View style={[styles.actionButtonInner, styles.scheduleButton]}>
                <Ionicons name="calendar-outline" size={18} color={COLORS.light} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionButtonInner, styles.favoriteButton]}>
                <Ionicons name="heart" size={18} color={COLORS.light} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tour Yêu Thích</Text>
        <View style={styles.headerIcons}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.dark} style={styles.icon} />
            <View style={styles.avatarWrapper}>
  {avatarUrl ? (
    <Image
      source={{ uri: avatarUrl }}
      style={styles.avatarImage}
      resizeMode="cover"
    />
  ) : (
    <Ionicons name="person-circle-outline" size={22} color={COLORS.primary} />
  )}
            </View>
        </View>
      </View>

      {/* Notification */}
      <View style={styles.notification}>
        <View style={styles.notificationContent}>
          <View style={styles.notificationIconContainer}>
            <Ionicons name="time-outline" size={24} color={COLORS.orange} />
          </View>
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationTitle}>Đến lúc khám phá!</Text>
            <Text style={styles.notificationMessage}>
              Bạn có {SAVED_TOURS.length} tour đã lưu đang chờ được khám phá
            </Text>
          </View>
        </View>
        <Image
          source={
            require("@/assets/images/avatar.jpg")
          }
          style={styles.notificationImage}
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.grey} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm tour đã lưu"
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
        data={filteredTours}
        renderItem={renderTourItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.tourList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

