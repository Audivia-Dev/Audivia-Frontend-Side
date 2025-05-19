import { View, Text, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import styles from '@/styles/home.styles';
import { Tour } from '@/models';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { createSaveTour } from '@/services/save_tour';
import { useUser } from '@/hooks/useUser';

interface SuggestedToursProps {
  suggestedTours: Tour[];
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.75;
const CARD_MARGIN = 12;

export const SuggestedTours = ({ suggestedTours }: SuggestedToursProps) => {
  const { user } = useUser();

  if (!suggestedTours || suggestedTours.length === 0) {
    return null;
  }

  const navigateToTourDetail = (tourId: string) => {
    router.push(`/(screens)/detail_tour?tourId=${tourId}`);
  };

  const handleSaveTour = async (tourId: string) => {
    try {
      if (user?.id) {
        await createSaveTour(user.id, tourId);
        Alert.alert("Đã lưu tour", "Tour đã được thêm vào danh sách yêu thích.");
      } else {
        Alert.alert("Thông báo", "Vui lòng đăng nhập để lưu tour.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu tour.");
    }
  };

  const renderTourItem = ({ item, index }: { item: Tour, index: number }) => (
    <TouchableOpacity
      style={[styles.tourCard, {
        width: CARD_WIDTH,
        marginLeft: index === 0 ? CARD_MARGIN : 0,
        marginRight: CARD_MARGIN,
        overflow: 'hidden'
      }]}
      onPress={() => navigateToTourDetail(item.id)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.thumbnailUrl }}
        style={[styles.tourImage, { height: CARD_WIDTH * 0.5 }]}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => handleSaveTour(item.id)}
      >
        <Ionicons name="heart-outline" size={20} color={COLORS.light} />
      </TouchableOpacity>

      {/* Price Tag */}
      <View style={{
        position: 'absolute',
        left: 0,
        top: 15,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
      }}>
        <Text style={{
          color: 'white',
          fontSize: 12,
          fontWeight: '600',
        }}>{item.price === 0 ? "Miễn phí" : `${item.price.toLocaleString('vi-VN')}đ`}</Text>
      </View>

      <View style={{ padding: 12 }}>
        <Text style={styles.tourName} numberOfLines={1}>{item.title}</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={{ fontSize: 13, color: '#666', marginLeft: 4 }} numberOfLines={1}>{item.location}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={{ fontSize: 13, color: '#666', marginLeft: 4 }}>{item.duration} phút</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome name="star" size={14} color={COLORS.orange} />
            <Text style={{ fontSize: 13, marginLeft: 4, fontWeight: '500' }}>
              {item.avgRating.toFixed(1)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => navigateToTourDetail(item.id)}
          >
            <Text style={styles.bookButtonText}>Đặt Ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.toursSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Các địa điểm được đề xuất</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.tourSubtitle}>Dựa trên sở thích và vị trí của bạn</Text>

      <FlatList
        data={suggestedTours}
        renderItem={renderTourItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
        snapToInterval={CARD_WIDTH + CARD_MARGIN}
        decelerationRate="fast"
      />
    </View>
  );
}; 