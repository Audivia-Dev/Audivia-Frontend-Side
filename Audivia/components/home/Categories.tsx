import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { TourType } from '@/models';
import { router } from 'expo-router';
import styles from '@/styles/home.styles';

interface CategoriesProps {
  tourTypes: TourType[];
}

export const Categories = ({ tourTypes }: CategoriesProps) => {
  const handleCategoryPress = (typeId: string) => {
    router.push(`/filter_tour?typeId=${typeId}&tourTypeName=${tourTypes.find(type => type.id === typeId)?.name}`);
  };

  return (
    <View style={styles.categoriesSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Danh mục</Text>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {tourTypes.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryItem}
              onPress={() => handleCategoryPress(category.id)}
            >
              <View style={styles.categoryIconContainer}>
                <Ionicons name="location-outline" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.categoryName} numberOfLines={2}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}; 