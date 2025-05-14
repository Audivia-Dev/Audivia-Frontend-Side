import { View, Text, Image } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { styles } from "@/styles/tour_detail.styles"
import { COLORS } from "@/constants/theme"
import type { Tour } from "@/models"

interface ReviewsTabProps {
  tour: Tour | undefined
}

// Dữ liệu mẫu cho đánh giá
const SAMPLE_REVIEWS = [
  {
    id: "2",
    user: {
      name: "Trần Thị B",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    rating: 4,
    comment:
      "Tuyệt vời! Tour được thiết kế rất tốt và tôi đã tận hưởng từng phút. Một số phần của thông tin lịch sử có thể chi tiết hơn.",
    timeAgo: "1 tuần trước",
    likes: 18,
    replies: 3,
  },
  {
    id: "3",
    user: {
      name: "Lê Văn C",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    },
    rating: 5,
    comment:
      "Hoàn toàn yêu thích tour này! Người hướng dẫn thực sự rất thân thiện và am hiểu. Các điểm dừng chân được chọn lựa rất tốt. Chắc chắn sẽ giới thiệu cho bạn bè!",
    timeAgo: "2 tuần trước",
    likes: 31,
    replies: 4,
  },
]

const renderReviewItem = (review: any) => (
  <View style={styles.reviewItem}>
    <View style={styles.reviewHeader}>
      <Image source={{ uri: review.user.avatar }} style={styles.reviewerAvatar} />
      <View style={styles.reviewerInfo}>
        <Text style={styles.reviewerName}>{review.user.name}</Text>
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
      <Text style={styles.reviewTime}>{review.timeAgo}</Text>
    </View>

    <Text style={styles.reviewComment}>{review.comment}</Text>
  </View>
)

export const ReviewsTab = ({ tour }: ReviewsTabProps) => {
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

      {SAMPLE_REVIEWS.map((review) => renderReviewItem(review))}
    </View>
  )
} 