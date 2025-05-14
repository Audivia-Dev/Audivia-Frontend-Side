import { View, Image, TouchableOpacity, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { styles } from "@/styles/tour_detail.styles"

interface TourHeaderProps {
  onBack: () => void
  onToggleFavorite: () => void
}

export const TourHeader = ({ onBack, onToggleFavorite }: TourHeaderProps) => {
  return (
    <View style={styles.mapContainer}>
      <Image
        source={{
          uri: "https://maps.googleapis.com/maps/api/staticmap?center=10.8700,106.8030&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C10.8700,106.8030&key=YOUR_API_KEY",
        }}
        style={styles.mapImage}
      />

      <View style={styles.headerOverlay}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết Tour</Text>
        </View>
        <View>
          <TouchableOpacity style={styles.favoriteButton} onPress={onToggleFavorite}>
            <Ionicons name="heart-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
} 