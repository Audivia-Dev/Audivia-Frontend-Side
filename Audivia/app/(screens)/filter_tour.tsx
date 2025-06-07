import { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  FlatList
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { styles } from "@/styles/filter_tour.styles"
import { getToursByTypeId, getAllTours } from "@/services/tour"
import { COLORS } from "@/constants/theme"
import { NotificationButton } from "@/components/common/NotificationButton"
import { BackButton } from "@/components/common/BackButton"
import { ChatMessageButton } from "@/components/common/ChatMessage"
import { TourItem } from "@/components/common/TourItem"
import { Tour } from "@/models"


export default function FilterTourScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const { typeId, tourTypeName } = useLocalSearchParams()
  const [tours, setTours] = useState<Tour[]>([])

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
      <View style={{ flex: 1 }}>
        <FlatList
          data={tours}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TourItem tour={item} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  )
}

