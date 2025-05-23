import { View, ScrollView, Dimensions } from "react-native"
import { useEffect, useState } from "react"
import { Tour, TourType } from "@/models"
import { getSuggestedTours, getTop3Tours } from "@/services/tour"
import { getTourTypes } from "@/services/tour_type"
import UserLocationMap from "@/components/UserLocationMap"
import { Header } from "@/components/home/Header"
import { ImageCarousel } from "@/components/home/ImageCarousel"
import { Categories } from "@/components/home/Categories"
import { SuggestedTours } from "@/components/home/SuggestedTours"
import { TopPlaces } from "@/components/home/TopPlaces"
import styles from "@/styles/home.styles"

export default function Index() {
  const [top3Tours, setTop3Tours] = useState<Tour[]>([])
  const [tourTypes, setTourTypes] = useState<TourType[]>([])
  const [currentLocationAddress, setCurrentLocationAddress] = useState<string | null>(null);
  const [suggestedTours, setSuggestedTours] = useState<Tour[]>([])
  const [userCoordinates, setUserCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    getTop3Tours().then((res) => {
      setTop3Tours(res.response.data)
    })
  }, [])

  useEffect(() => {
    if (userCoordinates) {
      getSuggestedTours(
        userCoordinates.longitude,
        userCoordinates.latitude,
        3 // 3km radius
      ).then((res) => {
        setSuggestedTours(res.response.data)
      }).catch((error) => {
        console.error('Error fetching suggested tours:', error);
      });
    }
  }, [userCoordinates]);

  useEffect(() => {
    getTourTypes().then((res) => {
      setTourTypes(res.response)
    })
  }, [])

  const handleLocationChange = (address: string | null, coordinates?: { latitude: number; longitude: number } | null) => {
    setCurrentLocationAddress(address);
    setUserCoordinates(coordinates || null);
  };

  return (
    <View style={styles.container}>
      <Header locationAddress={currentLocationAddress} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageCarousel />
        <Categories tourTypes={tourTypes} />

        {/* Google Map View */}
        <View style={{ alignItems: 'center', width: '100%' }}>
          <UserLocationMap
            width={Dimensions.get('window').width - 40}
            onLocationChange={handleLocationChange}
          />
        </View>

        <SuggestedTours suggestedTours={suggestedTours} />
        <TopPlaces top3Tours={top3Tours} />
      </ScrollView>
    </View>
  )
}

