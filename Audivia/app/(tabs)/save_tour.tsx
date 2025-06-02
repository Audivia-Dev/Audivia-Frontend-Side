import { useEffect, useState } from "react"
import { FlatList, SafeAreaView, Alert, View } from "react-native"
import styles from "@/styles/save_tour.styles"
import { useUser } from "@/hooks/useUser"
import { getAllSaveTourByUserId, deleteSaveTour } from "@/services/save_tour"
import { SaveTour } from "@/models"
import { TourItem } from "@/components/common/TourItem"
import { SaveTourNotification } from "@/components/save_tour/SaveTourNotification"
import { Header } from "@/components/common/Header"

export default function SavedToursScreen() {
  const { user } = useUser()
  const [saveTours, setSaveTour] = useState<SaveTour[]>([])

  const refreshSavedTours = async () => {
    if (user?.id) {
      try {
        const res = await getAllSaveTourByUserId(user.id)
        setSaveTour(res)
      } catch (error) {
        console.error('Error refreshing saved tours:', error)
      }
    }
  }

  useEffect(() => {
    refreshSavedTours()
  }, [user?.id])

  const handleDeleteTour = async (tourId: string) => {
    try {
      const saveTourToDelete = saveTours.find(st => st.tour.id === tourId)
      if (!saveTourToDelete) {
        throw new Error('Không tìm thấy tour yêu thích')
      }
      
      await deleteSaveTour(saveTourToDelete.id)
      await refreshSavedTours() 
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xóa tour yêu thích. Vui lòng thử lại.')
    }
  }

  const tours = saveTours.map(saveTour => saveTour.tour)

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.saveWrapper, {flex: 1}]}>
      <Header title="Lưu yêu thích"/>
      <SaveTourNotification savedToursCount={saveTours.length} />
      <TourItem tours={tours} isSavedTour={true} onDelete={handleDeleteTour} onSave={refreshSavedTours} />
      </View>
    </SafeAreaView>
  )
}

