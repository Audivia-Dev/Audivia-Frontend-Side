import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Tour } from '@/models';
import { router } from 'expo-router';
import styles from '@/styles/home.styles';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/theme';

interface TopPlacesProps {
  top3Tours: Tour[];
}

export const TopPlaces = ({ top3Tours }: TopPlacesProps) => {
  const handleTourPress = (tourId: string) => {
    router.push(`/detail_tour?tourId=${tourId}`);
  };

  return (
    <View style={styles.topPlacesSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Địa điểm nổi bật</Text>
      </View>

      {Array.isArray(top3Tours) && top3Tours.map((tour, index) => (
        <TouchableOpacity key={index} style={styles.placeItem} onPress={() => handleTourPress(tour.id)}>
          {tour.thumbnailUrl ? (
            <Image
              source={{ uri: tour.thumbnailUrl }}
              style={styles.placeImage}
              resizeMode="cover"
            />
          ) : <Text>Không ảnh</Text>}
          <View style={styles.placeDetails}>
            <Text style={styles.placeName}>{tour.title}</Text>
            <Text style={styles.placeRating}>{tour.avgRating}★ • {tour.duration} giờ</Text>
            <MaskedView maskElement={
              <Text style={[styles.placePrice, { backgroundColor: 'transparent' }]}>
                {tour.price} VND
              </Text>
            }>
              <LinearGradient
                colors={[COLORS.primary, COLORS.purpleGradient]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                <Text style={[styles.placePrice, { opacity: 0 }]}>
                {tour.price} VND
                </Text>
              </LinearGradient>
            </MaskedView>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}; 