import { useEffect, useState } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
} from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { COLORS } from "@/constants/theme"
import styles from "@/styles/save_tour.styles"
import { useUser } from "@/hooks/useUser"
import { deleteSaveTour, getAllSaveTourByUserId } from "@/services/save_tour"
import { SaveTour } from "@/models"

export default function SavedToursScreen() {
  const {user} = useUser()

  const router = useRouter()
  const [saveTours, setSaveTour] = useState<SaveTour[]>([])
  const [showPostOptions, setShowPostOptions] = useState<string | null>(null)
  
  
  useEffect(() => {
    if (user?.id) {
      getAllSaveTourByUserId(user.id).then((res) => {
        setSaveTour(res);
      });
    }
  }, [user?.id]);
  

  const navigateToPlanTour = (tourId: string) => {
    router.push(`/plan_tour?id=${tourId}`)
  }

  const handleDeleteSaveTour = async (tourId: string) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa tour yêu thích này?',
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSaveTour(tourId)
              setSaveTour(saveTours.filter((post: SaveTour) => post.id !== tourId))
              setShowPostOptions(null)
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa bài viết. Vui lòng thử lại.')
            }
          }
        }
      ]
    )
  }
  const renderTourItem = ({ item }: { item: any }) => (
    <View style={styles.tourCard}>
      <View style={{alignItems: 'flex-end', marginEnd: 10, marginTop: 10}}>
      <TouchableOpacity onPress={() => setShowPostOptions(showPostOptions === item.id ? null : item.id)}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
      </TouchableOpacity>
      </View>
        {showPostOptions === item.id && (
        <View style={styles.postOptions}>
          <TouchableOpacity 
            style={styles.postOption} 
            onPress={() => handleDeleteSaveTour(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.red} />
            <Text style={[styles.postOptionText, { color: COLORS.red }]}>Xóa</Text>
          </TouchableOpacity>
        </View>
      )}
      <Image source={{ uri: item.tour.thumbnailUrl }} style={styles.tourImage} />
      <View style={styles.tourContent}>
      
        <View style={styles.tourHeader}>
          <View>
            <Text style={styles.tourName}>{item.tour.title}</Text>
            <Text style={styles.tourLocation}>
              <Ionicons name="location-outline" size={14} color={COLORS.grey} /> {item.tour.location}
            </Text>
          </View>
          <View style={styles.tourRating}>
            <Ionicons name="star" size={16} color={COLORS.orange} />
            <Text style={styles.ratingText}>{item.tour.avgRating}</Text>
          </View>
        </View>

        <View style={styles.tourFooter}>
          <Text style={styles.savedTime}>Đã lưu {item.timeAgo}</Text>
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

      {/* Notification */}
      <View style={styles.notification}>
        <View style={styles.notificationContent}>
          <View style={styles.notificationIconContainer}>
            <Ionicons name="time-outline" size={24} color={COLORS.orange} />
          </View>
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationTitle}>Đến lúc khám phá!</Text>
            <Text style={styles.notificationMessage}>
              Bạn có {saveTours.length} tour đã lưu đang chờ được khám phá
            </Text>
          </View>
        </View>
      </View>


      {/* Tour List */}
      <FlatList
        data={saveTours}
        renderItem={renderTourItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.tourList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

