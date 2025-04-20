import { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
} from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useRouter, useLocalSearchParams } from "expo-router"
import { COLORS } from "@/constants/theme"
import styles from "@/styles/plan_tour.styles"

// Dữ liệu mẫu cho các tour đã lưu
const SAVED_TOURS = [
  {
    id: "2",
    name: "Tuyến Metro Số 1",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1000&auto=format&fit=crop",
    savedTime: "5 ngày trước",
    location: "TP.HCM",
    duration: "1 giờ 30 phút",
    rating: 4.8,
  },
  {
    id: "3",
    name: "Bảo tàng Lịch sử Việt Nam",
    image: "https://images.unsplash.com/photo-1577720643272-265f09367456?q=80&w=1000&auto=format&fit=crop",
    savedTime: "1 tuần trước",
    location: "Quận 1, TP.HCM",
    duration: "3 giờ",
    rating: 4.5,
  },
  {
    id: "4",
    name: "Chợ Bến Thành",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1000&auto=format&fit=crop",
    savedTime: "3 tuần trước",
    location: "Quận 1, TP.HCM",
    duration: "2 giờ 30 phút",
    rating: 4.3,
  },
]

export default function PlanTourScreen() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [notes, setNotes] = useState("")
  const router = useRouter()
  const searchParams = useLocalSearchParams()
  const tourId = searchParams.id || "1"

  const tour = SAVED_TOURS.find((t) => t.id === tourId) || SAVED_TOURS[0]

  const goBack = () => {
    router.back()
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lên Lịch Tour</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Tour Info */}
        <View style={styles.tourInfoCard}>
          <Image source={{ uri: tour.image }} style={styles.tourImage} />
          <View style={styles.tourInfoContent}>
            <Text style={styles.tourName}>{tour.name}</Text>
            <View style={styles.tourDetails}>
              <View style={styles.tourDetailItem}>
                <Ionicons name="location-outline" size={16} color={COLORS.grey} />
                <Text style={styles.tourDetailText}>{tour.location}</Text>
              </View>
              <View style={styles.tourDetailItem}>
                <Ionicons name="time-outline" size={16} color={COLORS.grey} />
                <Text style={styles.tourDetailText}>{tour.duration}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notification */}
        <View style={styles.notification}>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationMessage}>
              <Text style={styles.notificationHighlight}>* </Text>
              Bằng cách lên lịch chuyến đi, Audy sẽ nhắc nhở bạn trước khi chuyến đi bắt đầu!
            </Text>
          </View>
          <Image
            source={
              require("@/assets/images/avatar.jpg")
            }
            style={styles.notificationImage}
          />
        </View>

        {/* Plan Visit Section */}
        <View style={styles.planSection}>
          <Text style={styles.sectionTitle}>Lên Lịch Chuyến Đi</Text>

          <View style={styles.dateInputContainer}>
            <Text style={styles.dateLabel}>Ngày Bắt Đầu</Text>
            <TouchableOpacity style={styles.dateInput}>
              <Text style={startDate ? styles.dateText : styles.datePlaceholder}>{startDate || "dd/mm/yyyy"}</Text>
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.dateInputContainer}>
            <Text style={styles.dateLabel}>Ngày Kết Thúc</Text>
            <TouchableOpacity style={styles.dateInput}>
              <Text style={endDate ? styles.dateText : styles.datePlaceholder}>{endDate || "dd/mm/yyyy"}</Text>
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Xác Nhận Lịch Trình</Text>
          </TouchableOpacity>
        </View>

        {/* Notes Section */}
        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Ghi Chú Của Bạn</Text>
          <View style={styles.notesInputContainer}>
            <TextInput
              style={styles.notesInput}
              placeholder="Thêm ghi chú về chuyến đi này..."
              placeholderTextColor={COLORS.grey}
              multiline
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          <View style={styles.notesActions}>
            <TouchableOpacity style={styles.attachmentButton}>
              <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
              <Text style={styles.attachmentButtonText}>Thêm tệp đính kèm</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveNotesButton}>
              <Text style={styles.saveNotesButtonText}>Lưu ghi chú</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}>Đề Xuất Cho Bạn</Text>
          <View style={styles.recommendationCard}>
            <View style={styles.recommendationIconContainer}>
              <Ionicons name="sunny-outline" size={24} color="#FF9500" />
            </View>
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationTitle}>Thời Tiết Lý Tưởng</Text>
              <Text style={styles.recommendationText}>
                Dự báo thời tiết cho địa điểm này trong tuần tới rất lý tưởng cho chuyến đi của bạn!
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 80 }} />
      </ScrollView>

    </SafeAreaView>
  )
}

