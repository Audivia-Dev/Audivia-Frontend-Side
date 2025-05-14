import { View, Image, ScrollView, Dimensions } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import styles from '@/styles/home.styles';

const carouselImages = [
  require('@/assets/images/benthanh.png'),
  require('@/assets/images/cung-dinh-hue.jpg'),
  require('@/assets/images/ben-nha-rong.jpg'),
  require('@/assets/images/lang-khai-dinh.jpg'),
  require('@/assets/images/nvh1.jpg'),
];

export const ImageCarousel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % carouselImages.length;
        scrollViewRef.current?.scrollTo({
          x: newIndex * Dimensions.get('window').width,
          animated: true
        });
        return newIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.mainImageContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          const contentOffset = event.nativeEvent.contentOffset;
          const index = Math.round(contentOffset.x / Dimensions.get('window').width);
          setCurrentImageIndex(index);
        }}
        scrollEventThrottle={16}
        style={{ width: '100%', height: 200 }}
      >
        {carouselImages.map((image, index) => (
          <Image
            key={index}
            source={image}
            style={[styles.mainImage, { width: Dimensions.get('window').width, height: 200 }]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      <View style={styles.carouselIndicators}>
        {carouselImages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentImageIndex && styles.activeIndicator
            ]}
          />
        ))}
      </View>
    </View>
  );
}; 