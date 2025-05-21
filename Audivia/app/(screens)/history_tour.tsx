import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { router } from 'expo-router';

const TourHistoryItem = ({ image, title, date, rating, reviewText, duration, distance }) => {
  return (
    <View style={styles.historyItem}>
      <Image source={image} style={styles.tourImage} />
      <View style={styles.tourOverlay}>
        <Text style={styles.tourTitle}>{title}</Text>
        <Text style={styles.tourDate}>Completed on {date}</Text>
      </View>
      
      <View style={styles.reviewContainer}>
        <Text style={styles.reviewLabel}>My review:</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons 
              key={star} 
              name={star <= rating ? "star" : "star-outline"} 
              size={16} 
              color="#FFD700" 
              style={styles.starIcon}
            />
          ))}
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
        <Text style={styles.reviewText}>"{reviewText}"</Text>
        
        <View style={styles.tourMetaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.metaText}>{duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.metaText}>{distance} km</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const TourHistoryScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Lịch sử tour</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Tours taken</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>7h</Text>
            <Text style={styles.statLabel}>Total Time</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>

        {/* Tour History List */}
        <View style={styles.historyList}>
          <TourHistoryItem
            image={require('@/assets/images/avatar.jpg')}
            title="VNUHCM Cultural House"
            date="Mar 10, 2025"
            rating={5}
            reviewText="Great tour! The audio quality was excellent."
            duration="2h"
            distance="1"
          />
          
          <TourHistoryItem
            image={require('@/assets/images/avatar.jpg')}
            title="Independent Palace"
            date="Mar 5, 2025"
            rating={5}
            reviewText="Love Saigon. Learned a lot about Independent Palace. AudioMe impressed me so much!"
            duration="5h"
            distance="2.5"
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00A9CE',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  historyList: {
    padding: 16,
  },
  historyItem: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  tourImage: {
    width: '100%',
    height: 150,
  },
  tourOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
  },
  tourTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tourDate: {
    color: '#fff',
    fontSize: 14,
  },
  reviewContainer: {
    padding: 12,
  },
  reviewLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starIcon: {
    marginRight: 2,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  tourMetaContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  mascotContainer: {
    position: 'absolute',
    right: 16,
    top: 180,
  },
  mascotImage: {
    width: 60,
    height: 60,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  activeNavItem: {
    borderTopWidth: 2,
    borderTopColor: '#00A9CE',
    paddingTop: 6,
  },
  navText: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  activeNavText: {
    color: '#00A9CE',
    fontWeight: '500',
  },
});

export default TourHistoryScreen;