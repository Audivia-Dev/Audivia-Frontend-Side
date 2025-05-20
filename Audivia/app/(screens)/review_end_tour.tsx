import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { writeReviewTour } from '@/services/review_tour';
import { useUser } from '@/hooks/useUser';

const WriteReviewScreen = () => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const {tourId} = useLocalSearchParams()
  const {user} = useUser()
  
  const handleSubmitReview = async () => {
    if (!tourId) {
      console.error('Tour ID is missing');
      return;
    }
    if (!user?.id) {
      console.error('User ID is missing');
      return;
    }
    try {
      const response = await writeReviewTour(
        title,
        rating,
        review,
        tourId as string,
        user.id
      );
      console.log('Review submitted successfully:', response);
      Alert.alert('Success', 'Your review has been submitted successfully!');
      router.back();
    } catch (error: any) {
      console.error('Error submitting review:', error.response?.data || error.message);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Write a Review</Text>
          
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.tourInfo}>
          <Image 
            source={require('@/assets/images/avatar.jpg')} 
            style={styles.tourImage}
          />
          <View style={styles.tourDetails}>
            <Text style={styles.tourName}>VNUHCM Cultural House</Text>
            <Text style={styles.tourDuration}>Duration: 2 hours</Text>
            <Text style={styles.tourCompletion}>Completed on Jan 16, 2025</Text>
          </View>
        </View>

        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>Rate your experience</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity 
                key={star} 
                onPress={() => setRating(star)}
              >
                <Ionicons 
                  name={star <= rating ? "star" : "star-outline"} 
                  size={32} 
                  color="#FFD700" 
                  style={styles.starIcon}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingText}>{rating} out of 5</Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Title your review</Text>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Great historical insights!"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Write your review</Text>
          <TextInput
            style={styles.reviewInput}
            value={review}
            onChangeText={setReview}
            placeholder="Share your experience with this audio tour..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmitReview}
        >
          <Text style={styles.submitButtonText}>Submit Review</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  tourInfo: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tourImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  tourDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  tourName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tourDuration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  tourCompletion: {
    fontSize: 14,
    color: '#666',
  },
  ratingSection: {
    padding: 16,
    alignItems: 'flex-start',
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  starIcon: {
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  inputSection: {
    padding: 16,
    paddingTop: 0,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 120,
  },
  photoSection: {
    margin: 16,
    marginTop: 0,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  photoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  photoText: {
    fontSize: 14,
    marginLeft: 8,
    color: '#666',
  },
  photoLimit: {
    fontSize: 12,
    color: '#999',
  },
  submitButton: {
    backgroundColor: '#00A9CE',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WriteReviewScreen;