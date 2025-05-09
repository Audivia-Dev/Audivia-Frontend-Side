import { Text, SafeAreaView, Touchable, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"

export default function PaymentSuccessScreen() {
    const route = useRouter()

    const handleNavigate = () => {
        route.push('/(screens)/history_transaction')
    }
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity onPress={handleNavigate}>

      </TouchableOpacity>
      <Text style={{ fontSize: 24, color: "green" }}>Thanh toán thành công 🎉</Text>
    </SafeAreaView>
  )
}
