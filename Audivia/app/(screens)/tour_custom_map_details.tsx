import { View, TouchableOpacity, Text, SafeAreaView, StyleSheet, ActivityIndicator, Image, useWindowDimensions } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState, useRef } from "react"
import { Tour, CustomMapImage } from "@/models"
import { getTourById } from "@/services/tour"
import { COLORS } from "@/constants/theme"
import { FlatList, Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

const AnimatedImage = Animated.createAnimatedComponent(Image);

const ZoomableImage = ({ item }: { item: CustomMapImage }) => {
    const { width, height } = useWindowDimensions();
    const scale = useSharedValue(1);
    const focalX = useSharedValue(0);
    const focalY = useSharedValue(0);

    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            scale.value = e.scale;
        })
        .onEnd(() => {
            scale.value = withTiming(1);
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: focalX.value },
                { translateY: focalY.value },
                { scale: scale.value },
            ],
        };
    });

    return (
        <GestureDetector gesture={pinchGesture}>
            <AnimatedImage
                source={{ uri: item.imageUrl }}
                style={[{ width, height }, animatedStyle]}
                resizeMode="contain"
            />
        </GestureDetector>
    )
}

export default function TourCustomMapDetailsScreen() {
    const router = useRouter()
    const { tourId } = useLocalSearchParams()
    const [tour, setTour] = useState<Tour>()
    const [loading, setLoading] = useState<boolean>(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const flatListRef = useRef<FlatList<any>>(null)
    const { width } = useWindowDimensions();

    useEffect(() => {
        const fetchTourById = async () => {
            try {
                setLoading(true)
                const response = await getTourById(tourId as string)
                setTour(response.response)
            } catch (error) {
                console.error("Error fetching tour:", error)
            } finally {
                setLoading(false)
            }
        }

        if (tourId) {
            fetchTourById()
        }
    }, [tourId])

    const goBack = () => {
        router.back()
    }

    const handleScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x
        const index = Math.round(contentOffsetX / width)
        setCurrentIndex(index)
    }

    const renderItem = ({ item }: { item: CustomMapImage }) => (
        <View style={[styles.carouselItem, { width }]}>
            <ZoomableImage item={item} />
        </View>
    );

    const renderDots = () => {
        if (!tour?.customMapImages) return null;
        
        return (
            <View style={styles.dotsContainer}>
                {tour.customMapImages.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentIndex === index && styles.activeDot
                        ]}
                    />
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">Sơ đồ - {tour?.title ?? ''}</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Custom Map Images Slider */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Đang tải sơ đồ...</Text>
                </View>
            ) : tour?.customMapImages && tour.customMapImages.length > 0 ? (
                <View style={styles.sliderContainer}>
                    <FlatList
                        ref={flatListRef}
                        data={tour.customMapImages.sort((a, b) => a.order - b.order)}
                        renderItem={renderItem}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        keyExtractor={(item) => item.id.toString()}
                    />
                    <View style={styles.counterContainer}>
                        <Text style={styles.counterText}>{currentIndex + 1}/{tour.customMapImages.length}</Text>
                    </View>
                    {renderDots()}
                </View>
            ) : (
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={60} color={COLORS.grey} />
                    <Text style={styles.errorText}>Không có sơ đồ tham quan</Text>
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
        backgroundColor: 'rgba(0,0,0,0.7)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: '#fff',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.grey,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.grey,
        textAlign: 'center',
    },
    sliderContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    carouselItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    counterContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    counterText: {
        color: '#fff',
        fontSize: 14,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: COLORS.primary,
        width: 12,
        height: 12,
        borderRadius: 6,
    },
}); 