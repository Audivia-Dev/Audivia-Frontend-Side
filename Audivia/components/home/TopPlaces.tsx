import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Tour } from '@/models';
import styles from '@/styles/home.styles';
import { TourItem } from '../common/TourItem';

interface TopPlacesProps {
  top3Tours: Tour[];
}

export const TopPlaces = ({ top3Tours }: TopPlacesProps) => {
  

  return (
    <View style={styles.topPlacesSection}>
      <View style={styles.sectionTopPlaceHeader}>
        <Text style={styles.sectionTitle}>Địa điểm nổi bật</Text>
      </View>

      <TourItem tours={top3Tours}/>
    </View>
  );
}; 