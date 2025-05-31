import { COLORS } from "@/constants/theme"
import { useUser } from "@/hooks/useUser"
import { Tour } from "@/models"
import { createSaveTour } from "@/services/save_tour"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface TourItemProps {
  tours: Tour[];
  isSavedTour?: boolean;
  onDelete?: (tourId: string) => void;
  onSave?: (tourId: string) => void;
}

export const TourItem = ({ tours, isSavedTour = false, onDelete, onSave }: TourItemProps) => {
  const { user } = useUser()

  const navigateToTourDetail = (tourId: string) => {
    router.push(`/detail_tour?tourId=${tourId}`)
  }

  const handleSaveTour = async (tourId: string) => {
    try {
      await createSaveTour(user?.id as string, tourId)
      Alert.alert("Đã lưu tour", "Tour đã được thêm vào danh sách yêu thích.")
      if (onSave) {
        onSave(tourId)
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu tour.")
    }
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
            if (onDelete) {
              onDelete(tourId);
            }
          }
        }
      ]
    )
  }

  const navigateToPlanDate = (tourId: string) => {
    router.push(`/plan_tour?id=${tourId}`)
  }

  const renderTourItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.tourCard} onPress={() => navigateToTourDetail(item.id)}>
      <View>
        {/* Image */}
        <Image source={{ uri: item.thumbnailUrl || "https://maps.googleapis.com/maps/api/staticmap?center=10.8700,106.8030&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C10.8700,106.8030&key=YOUR_API_KEY" }} style={styles.tourImage} />
      </View>

      {/* Tour Info */}
      <View style={styles.tourInfo}>
        {isSavedTour ? (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleDeleteSaveTour(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.red} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.favoriteButton} onPress={() => handleSaveTour(item.id)}>
            <FontAwesome name="heart" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}

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
        <View style={styles.priceAndBookContainer}>
          {/* Price */}
          <View style={styles.priceTag}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.primary }}>
              {item.price === 0 ? "Miễn phí" : ` ${item.price} Đ`}
            </Text>
          </View>

          {/* Book Button */}
          <TouchableOpacity
            onPress={() => isSavedTour ? navigateToPlanDate(item.id) : navigateToTourDetail(item.id)}
          >
            <View style={styles.bookButton}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.purpleGradient]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.bookButton}
              >
                {isSavedTour ? (
                  <Ionicons name="calendar-outline" size={24} color={COLORS.light} />
                ) : (
                  <Text style={styles.bookButtonText}>Đặt Ngay</Text>
                )}
              </LinearGradient>
            </View>
          </TouchableOpacity>
        </View>
      </View >
    </TouchableOpacity >
  )

  return (
    <SafeAreaView>
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

export const styles = StyleSheet.create({
  tourList: {
    padding: 16,
    paddingTop: 8,
  },
  tourCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    paddingTop: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  tourImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 10,
    resizeMode: 'cover'
  },
  favoriteButton: {
    position: "absolute",
    top: 0,
    left: 190,
    backgroundColor: "rgba(131, 81, 138, 0.2)",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  priceTag: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  priceText: {
    fontWeight: "bold",
    color: COLORS.dark,
    fontSize: 18
  },
  tourInfo: {
    flex: 1,
    padding: 5,
  },
  tourName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  tourMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  priceAndBookContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  bookButton: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
    width: 100,
    marginLeft: 10,
  },
  bookButtonText: {
    color: COLORS.light,
    fontWeight: "bold",
    fontSize: 14,
  },
})
