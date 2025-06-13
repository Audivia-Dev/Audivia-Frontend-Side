import { View, TouchableOpacity, Text, SafeAreaView, StyleSheet, ActivityIndicator, Image, Dimensions, FlatList } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState, useRef } from "react"
import { Tour, CustomMapImage } from "@/models"
import { getTourById } from "@/services/tour"
import { COLORS } from "@/constants/theme"

export default function TourCustomMapDetailsScreen() {
    const router = useRouter()
    const { tourId } = useLocalSearchParams()
    const [tour, setTour] = useState<Tour>()
    const [loading, setLoading] = useState<boolean>(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const flatListRef = useRef<FlatList>(null)
    const width = Dimensions.get('window').width;

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

    const renderItem = ({ item, index }: { item: CustomMapImage; index: number }) => (
        <View style={[styles.carouselItem, { width }]}>
            <Image
                source={{ uri: item.imageUrl }}
                style={styles.mapImage}
                resizeMode="contain"
            />
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
                <Text style={styles.headerTitle}>Sơ đồ tham quan {tour?.title ? `- ${tour.title.substring(0, 15)}${tour.title.length > 15 ? '...' : ''}` : ''}</Text>
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
                        keyExtractor={(item, index) => index.toString()}
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
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
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
        backgroundColor: '#f5f5f5',
    },
    carouselItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
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