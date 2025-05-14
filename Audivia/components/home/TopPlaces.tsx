import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Tour } from '@/models';
import { router } from 'expo-router';
import styles from '@/styles/home.styles';

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
        <Text style={styles.sectionTitle}>3 địa điểm nổi bật</Text>
      </View>

      {Array.isArray(top3Tours) && top3Tours.map((tour, index) => (
        <TouchableOpacity key={index} style={styles.placeItem} onPress={() => handleTourPress(tour.id)}>
          {tour.thumbnailUrl ? (
            <Image
              source={{ uri: tour.thumbnailUrl }}
              style={styles.placeImage}
              resizeMode="cover"
            />
          ) : <Text>No image</Text>}
          <View style={styles.placeDetails}>
            <Text style={styles.placeName}>{tour.title}</Text>
            <Text style={styles.placeRating}>★★★★☆ {tour.avgRating} • {tour.duration} giờ</Text>
            <Text style={styles.placePrice}>{tour.price} VND</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}; 