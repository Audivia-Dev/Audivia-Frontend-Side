import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import styles from '@/styles/home.styles';

export const SuggestedTours = () => {
  return (
    <View style={styles.toursSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Các địa điểm được đề xuất</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.tourSubtitle}>Dựa trên sở thích và vị trí của bạn</Text>

      <View style={styles.tourCard}>
        <Image
          source={require('@/assets/images/nvh1.jpg')}
          style={styles.tourImage}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={20} color={COLORS.light} />
        </TouchableOpacity>

        <View style={styles.tourDetails}>
          <Text style={styles.tourName}>NHÀ VĂN HÓA SINH VIÊN</Text>
          <Text style={styles.tourLocation}>HCM, Vietnam</Text>

          <View style={styles.tourRating}>
            <FontAwesome name="star" size={14} color={COLORS.orange} />
            <Text style={styles.ratingText}>4.6 • 2 giờ</Text>
          </View>

          <View style={styles.tourFooter}>
            <Text style={styles.freeTag}>Miễn phí</Text>
            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.bookButtonText}>Đặt ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}; 