import { View, ScrollView, Dimensions, Image, TextInput, TouchableOpacity, Text, FlatList } from "react-native"
import { useEffect, useState } from "react"
import { Tour, TourType } from "@/models"
import { getSuggestedTours, getTop3Tours, getAllTours } from "@/services/tour"
import { getTourTypes } from "@/services/tour_type"
import UserLocationMap from "@/components/common/UserLocationMap"
import { Header } from "@/components/home/Header"
import { Categories } from "@/components/home/Categories"
import { SuggestedTours } from "@/components/home/SuggestedTours"
import { TopPlaces } from "@/components/home/TopPlaces"
import styles from "@/styles/home.styles"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "@/constants/theme"
import { useDebounce } from "@/hooks/useDebounce"
import { useRouter } from "expo-router"

export default function Index() {
  const [top3Tours, setTop3Tours] = useState<Tour[]>([])
  const [tourTypes, setTourTypes] = useState<TourType[]>([])
  const [currentLocationAddress, setCurrentLocationAddress] = useState<string | null>(null);
  const [suggestedTours, setSuggestedTours] = useState<Tour[]>([])
  const [userCoordinates, setUserCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedTours, setSearchedTours] = useState<Tour[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const router = useRouter();

  const refreshTop3Tours = async () => {
    try {
      const res = await getTop3Tours()
      setTop3Tours(res.response.data)
    } catch (error) {
      console.error('Error refreshing top 3 tours:', error)
    }
  }

  const refreshSuggestedTours = async () => {
    if (userCoordinates) {
      try {
        const res = await getSuggestedTours(
          userCoordinates.longitude,
          userCoordinates.latitude,
          3 // 3km radius
        )
        setSuggestedTours(res.response.data)
      } catch (error) {
        console.error('Error refreshing suggested tours:', error)
      }
    }
  }

  useEffect(() => {
    refreshTop3Tours()
  }, [])

  useEffect(() => {
    refreshSuggestedTours()
  }, [userCoordinates]);

  useEffect(() => {
    getTourTypes().then((res: { response: TourType[] }) => {
      setTourTypes(res.response)
    })
  }, [])

  useEffect(() => {
    const fetchSearchedTours = async () => {
      if (debouncedSearchQuery.length > 0) {
        const result = await getAllTours({ Title: debouncedSearchQuery, PageSize: 5 });
        setSearchedTours(result.response.data);
      } else {
        setSearchedTours([]);
      }
    };
    fetchSearchedTours();
  }, [debouncedSearchQuery]);

  const handleLocationChange = (address: string | null, coordinates?: { latitude: number; longitude: number } | null) => {
    setCurrentLocationAddress(address);
    setUserCoordinates(coordinates || null);
  };

  const handleDetailedSearch = () => {
    router.push({
      pathname: "/(screens)/filter_tour",
      params: { searchQuery: debouncedSearchQuery }
    });
  }

  const handleSuggestionPress = (tourId: string) => {
    router.push({
      pathname: "/(screens)/detail_tour",
      params: { tourId: tourId }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.overlayHeader}>
          <Header locationAddress={currentLocationAddress} />
        </View>
        <View style={styles.mainImageContainer}>
          <Image
            source={{ uri: 'https://res.cloudinary.com/dgzn2ix8w/image/upload/v1748528092/Audivia/v44p6ismjiq7mfs2bwc1.png' }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.primary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search any places..."
            placeholderTextColor={COLORS.grey}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        {searchedTours.length > 0 && (
          <View style={styles.suggestionContainer}>
            <FlatList
              data={searchedTours}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSuggestionPress(item.id)}>
                  <Text style={styles.suggestionItem}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.detailedSearchButton} onPress={handleDetailedSearch}>
              <Text style={styles.detailedSearchText}>Search more detail</Text>
            </TouchableOpacity>
          </View>
        )}

        <Categories tourTypes={tourTypes} />

        {/* Google Map View */}
        <View style={{ alignItems: 'center', width: '100%' }}>
          <UserLocationMap
            width={Dimensions.get('window').width - 40}
            onLocationChange={handleLocationChange}
          />
        </View>

        <SuggestedTours suggestedTours={suggestedTours} onRefresh={refreshSuggestedTours} />
        <TopPlaces top3Tours={top3Tours} onRefresh={refreshTop3Tours} />
      </ScrollView>
    </View>
  )
}


