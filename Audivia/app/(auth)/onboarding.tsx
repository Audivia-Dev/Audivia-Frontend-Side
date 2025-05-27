import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const slides = [
  {
    title: 'Explore the Joy of Traveling',
    description: 'Everything you can imagine, is here.',
    image: 'https://res.cloudinary.com/dgzn2ix8w/image/upload/v1748363861/Audivia/luro9pjc61fbnuots5kn.png',
  },
  {
    title: 'Emotional Voice Tours',
    description: 'Enjoy real human voices full of emotion and context.',
    image: 'https://res.cloudinary.com/dgzn2ix8w/image/upload/v1748363950/Audivia/emotion_voice.png',
  },
  {
    title: 'Personalized Experience',
    description: 'Tailor your journey to match your own interests and pace.',
    image: 'https://res.cloudinary.com/dgzn2ix8w/image/upload/v1748364020/Audivia/personalized_tour.png',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleNext = async () => {
    if (currentSlide < slides.length - 1) {
      Animated.timing(slideAnim, {
        toValue: -(currentSlide + 1) * width,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setCurrentSlide(prev => prev + 1);
    } else {
      try {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        router.push('/(auth)/login');
      } catch (error) {
        console.error('Error saving onboarding flag:', error);
      }
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.light, COLORS.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      style={[StyleSheet.absoluteFillObject, styles.container]}
    >
      <Animated.View
        style={[
          styles.slider,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <MaskedView
              maskElement={
                <Text style={[styles.title, { backgroundColor: 'transparent' }]}>
                  {slide.title}
                </Text>
              }
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.purpleGradient]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={[styles.title, { opacity: 0 }]}>{slide.title}</Text>
              </LinearGradient>
            </MaskedView>

            <Text style={styles.description}>{slide.description}</Text>
            <Image
              source={{ uri: slide.image }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        ))}
      </Animated.View>

      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentSlide === index && styles.activeDot,
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.purpleGradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <TouchableOpacity onPress={handleNext}>
            <Text style={styles.buttonText}>
              {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
  },
  slider: {
    flexDirection: 'row',
    width: width * slides.length,
  },
  slide: {
    width: width,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'left',
    marginBottom: 12,
  },
  description: {
    fontSize: 18,
    color: COLORS.grey,
    textAlign: 'left',
    marginBottom: 36,
  },
  image: {
    width: 400,
    height: 450,
    marginBottom: 24,
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 20,
  },
  gradientButton: {
    borderRadius: 50,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.light,
    fontWeight: '600',
    fontSize: 16,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.grey,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 20,
  },
});
