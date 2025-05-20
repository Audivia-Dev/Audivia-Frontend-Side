import { View, Text, Image } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { styles } from "@/styles/tour_detail.styles"
import { COLORS } from "@/constants/theme"
import type { Review, Tour } from "@/models"
import { useEffect, useState } from "react"
import { getReviewTourById } from "@/services/review_tour"
import { useLocalSearchParams } from "expo-router"
import { getUserInfo } from "@/services/user"

interface ReviewsTabProps {
  tour: Tour | undefined
}

const renderReviewItem = (review: Review) => (
  <View style={styles.reviewItem}>
    <View style={styles.reviewHeader}>
      <Image 
        source={{ uri: review?.avatarUrl || "https://randomuser.me/api/portraits/lego/1.jpg" }} 
        style={styles.reviewerAvatar} 
      />
      <View style={styles.reviewerInfo}>
        <Text style={styles.reviewerName}>{review?.userName || "Anonymous"}</Text>
        <Text style={[styles.reviewerName, { fontSize: 14, color: COLORS.grey }]}>{review?.title}</Text>
        <View style={styles.reviewRating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <FontAwesome
              key={star}
              name={star <= review.rating ? "star" : "star-o"}
              size={14}
              color={COLORS.orange}
              style={styles.reviewStarIcon}
            />
          ))}
        </View>
      </View>
      <Text style={styles.reviewTime}>
        {new Date(review.createdAt).toLocaleDateString()}
      </Text>
    </View>

    <Text style={styles.reviewComment}>{review.content}</Text>
  </View>
)

export const ReviewsTab = ({ tour }: ReviewsTabProps) => {
  const { tourId } = useLocalSearchParams()
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getReviewTourById(tourId as string)
        if (!Array.isArray(response)) {
          console.error("Invalid response format:", response)
          setReviews([])
          return
        }
        setReviews(response)
      } catch (error) {
        console.error("Error fetching reviews:", error)
        setReviews([])
      }
    }

    fetchReviews()
  }, [tourId])
  
  return (
    <View style={styles.reviewsContainer}>
      <View style={styles.ratingOverview}>
        <Text style={styles.ratingBig}>{tour?.avgRating}</Text>
        <View style={styles.ratingStarsContainer}>
          {[1, 2, 3, 4, 5].map((star, index) => (
            <FontAwesome
              key={index}
              name={
                star <= Math.floor(tour?.avgRating || 4.8)
                  ? "star"
                  : star <= (tour?.avgRating || 4.8)
                    ? "star-half-o"
                    : "star-o"
              }
              size={16}
              color={COLORS.orange}
              style={styles.starIcon}
            />
          ))}
        </View>
        <Text style={styles.ratingCount}>Dựa trên {tour?.avgRating} đánh giá</Text>
      </View>

      <View style={styles.reviewsHeader}>
        <Text style={styles.sectionTitle}>Đánh giá Tour</Text>
      </View>

      {reviews.map((review) => renderReviewItem(review))}
    </View>
  )
} 