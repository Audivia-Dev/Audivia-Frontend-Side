import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  ImageSourcePropType
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '@/constants/theme';
import { router } from 'expo-router';

interface MucMuaProps {
  image: ImageSourcePropType;
  title: string;
  date: string;
  price: string;
  isActive: boolean;
  onStartTour: () => void;
}

const MucMua: React.FC<MucMuaProps> = ({ image, title, date, price, onStartTour }) => {
  return (
    <View style={styles.purchaseItem}>
      <Image source={image} style={styles.purchaseImage} />
      <View style={styles.purchaseDetails}>
        <Text style={styles.purchaseTitle}>{title}</Text>
        <Text style={styles.purchaseDate}>Đã mua vào ngày {date}</Text>
        <View style={styles.purchaseRow}>
          <Text style={styles.purchasePrice}>{price} đ</Text>
          <View style={styles.activeContainer}>
            <View style={styles.activeDot} />
            <Text style={styles.activeText}>Đang hoạt động</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.startTourButton} onPress={onStartTour}>
          <Ionicons name="play" size={14} color="#0066CC" />
          <Text style={styles.startTourText}>Bắt đầu tour</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface ManHinhLichSuMuaProps {
  navigation: NativeStackNavigationProp<any>;
}

const PurchaseTour: React.FC<ManHinhLichSuMuaProps> = ({ navigation }) => {
  const handleStartTour = (tourId: string) => {
    console.log(`Bắt đầu tour: ${tourId}`);
    // Navigate to tour screen
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử mua</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Purchases List */}
        <View style={styles.purchasesList}>
          <MucMua
            image={require('@/assets/images/avatar.jpg')}
            title="Chợ Bến Thành"
            date="05/03/2025"
            price="35.000"
            isActive={true}
            onStartTour={() => handleStartTour('ben-thanh')}
          />
          
          <MucMua
            image={require('@/assets/images/avatar.jpg')}
            title="Dinh Độc Lập"
            date="05/03/2025"
            price="45.000"
            isActive={true}
            onStartTour={() => handleStartTour('independence-palace')}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBar: {
    height: 24,
    backgroundColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    height: 56,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  purchasesList: {
    paddingHorizontal: 16,
    marginTop: 40
  },
  purchaseItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 16,
  },
  purchaseImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  purchaseDetails: {
    flex: 1,
  },
  purchaseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  purchaseDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  purchaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  purchasePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 12,
  },
  activeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  activeText: {
    fontSize: 14,
    color: '#4CAF50',
  },
  startTourButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startTourText: {
    fontSize: 14,
    color: '#0066CC',
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default PurchaseTour;