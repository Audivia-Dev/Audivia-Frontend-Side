import { useEffect, useState } from "react"
import { FlatList, SafeAreaView } from "react-native"
import styles from "@/styles/save_tour.styles"
import { useUser } from "@/hooks/useUser"
import { getAllSaveTourByUserId } from "@/services/save_tour"
import { SaveTour } from "@/models"
import { SaveTourHeader } from "@/components/save_tour/SaveTourHeader"
import { SaveTourNotification } from "@/components/save_tour/SaveTourNotification"
import { SaveTourCard } from "@/components/save_tour/SaveTourCard"

export default function SavedToursScreen() {
  const { user } = useUser()
  const [saveTours, setSaveTour] = useState<SaveTour[]>([])
  
  useEffect(() => {
    if (user?.id) {
      getAllSaveTourByUserId(user.id).then((res) => {
        setSaveTour(res);
      });
    }
  }, [user?.id]);

  const handleDeleteTour = (tourId: string) => {
    setSaveTour(saveTours.filter((tour) => tour.id !== tourId))
  }

  return (
    <SafeAreaView style={styles.container}>
      <SaveTourHeader />
      <SaveTourNotification savedToursCount={saveTours.length} />
      <FlatList
        data={saveTours}
        renderItem={({ item }) => (
          <SaveTourCard item={item} onDelete={handleDeleteTour} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.tourList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

