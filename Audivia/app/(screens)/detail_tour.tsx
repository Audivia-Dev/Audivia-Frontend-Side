import { useEffect, useState } from "react"
import { View, TouchableOpacity, Text, SafeAreaView, ScrollView, Modal } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { styles } from "@/styles/tour_detail.styles"
import type { Tour } from "@/models"
import { getTourById } from "@/services/tour"
import { checkUserPurchasedTour } from "@/services/historyTransaction"
import { TourHeader } from "@/components/detail_tour/TourHeader"
import { AboutTab } from "@/components/detail_tour/AboutTab"
import { BeforeTab } from "@/components/detail_tour/BeforeTab"
import { ReviewsTab } from "@/components/detail_tour/ReviewsTab"
import { TourTabs } from "@/components/detail_tour/TourTabs"
import { useUser } from "@/hooks/useUser"
import { COLORS } from "@/constants/theme"
import { createTransactionHistory } from "@/services/historyTransaction"
export default function TourDetailScreen() {
  const [activeTab, setActiveTab] = useState("about")
  const router = useRouter()
  const { tourId } = useLocalSearchParams()
  const [tour, setTour] = useState<Tour>()
  const { user } = useUser()
  const [transaction, setTransaction] = useState<any>()
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)

  useEffect(() => {
    const fetchTourById = async () => {
      const response = await getTourById(tourId as string)
      setTour(response.response)
    }
    fetchTourById()
    checkIfUserPurchasedTour()
  }, [tourId, user?.id])

  const checkIfUserPurchasedTour = async () => {
    if (!user?.id) return
    const response = await checkUserPurchasedTour(user?.id, tourId as string)
    console.log(response)
    setTransaction(response)
  }

  const goBack = () => {
    router.back()
  }

  const toggleFavorite = () => {
    // Xử lý thêm vào danh sách yêu thích
  }

  const startTour = () => {
    router.push(`/tour_audio?tourId=${tourId}`)
  }

  const handlePurchase = () => {
    
    if (transaction) {
      //set audio character ở đây

      startTour()
    } else {
      setShowPurchaseModal(true)

    }
  }

  const amountToDeposit = Math.max((tour?.price ?? 0) - (user?.balanceWallet ?? 0), 0)
  const handleConfirmPurchase = () => {
    if (user?.balanceWallet as number < (tour?.price as number) ){
      router.push(`/deposit?tourId=${tourId}&redirect=detail&amount=${amountToDeposit}`)
    } else {
      createNewTransactionHistory()
      router.push(`/detail_tour?tourId=${tourId}`)
     // startTour()
    }
  }

  const createNewTransactionHistory = async () => {
    const params = {
      userId: user?.id as string,
      tourId: tourId as string,
      amount: tour?.price as number,
      description: tour?.title as string,
      type: "purchase",
      status: "success"
    }
    const response = await createTransactionHistory(params)
    console.log(response)
  }

  return (
    <SafeAreaView style={styles.container}>
      <TourHeader onBack={goBack} onToggleFavorite={toggleFavorite} />
      
      <TourTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Tab Content */}
        {activeTab === "about" && <AboutTab tour={tour} />}
        {activeTab === "before" && <BeforeTab tour={tour} />}
        {activeTab === "reviews" && <ReviewsTab tour={tour} />}

        {/* Bottom spacing */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Start Button */}
      <View style={styles.startButtonContainer}>
        <TouchableOpacity style={styles.startButton} onPress={handlePurchase}>
          <Text style={styles.startButtonText}>{transaction ? "Bắt đầu" : "Mua tour"}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showPurchaseModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPurchaseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Purchase</Text>
              <TouchableOpacity onPress={() => setShowPurchaseModal(false)}>
                <Text style={styles.closeText}>X</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.tourInfoRow}>
              <View>
                <Text style={styles.tourName}>{tour?.title}</Text>
                {/* <Text style={styles.tourDesc}>45-mins guided experience</Text> */}
              </View>
              <Text style={styles.tourPrice}>{tour?.price} VNĐ</Text>
            </View>

            <View style={styles.paymentMethodHeader}>
              <Text style={styles.paymentMethodTitle}>Payment Method</Text>
              {/* <TouchableOpacity>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity> */}
            </View>
            <View style={styles.walletBox}>
              <View style={styles.walletLeft}>
                <Text style={styles.walletName}>Audivia Wallet</Text>
                <Text style={styles.walletBalance}>Balance: {user?.balanceWallet} VNĐ</Text>
              </View>
              {/* <TouchableOpacity>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity> */}
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>{tour?.price} VNĐ</Text>
            </View>

            <TouchableOpacity 
              style={styles.purchaseButton} 
              onPress={handleConfirmPurchase}
            >
              <Text style={styles.purchaseButtonText}>Confirm & Play Now</Text>
            </TouchableOpacity>

            <View style={styles.secureRow}>
              <Text style={styles.secureText}>Secure payment processed by Audivia</Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
