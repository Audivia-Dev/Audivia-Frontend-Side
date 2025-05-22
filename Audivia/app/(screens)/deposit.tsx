import React, { useRef, useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  Linking,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { COLORS } from "@/constants/theme"
import styles from "@/styles/deposit.styles"
import { createPaymentIntent, checkPaymentStatus } from "@/services/payment"
import QRCode from "react-native-qrcode-svg"
import ViewShot from "react-native-view-shot"
import * as MediaLibrary from "expo-media-library"
import { useUser } from "@/hooks/useUser"

export default function DepositScreen() {
  const params = useLocalSearchParams()
  const [amount, setAmount] = useState(params.amount ? String(params.amount) : "")
  const [isProcessing, setIsProcessing] = useState(false)
  const [qrInfo, setQrInfo] = useState<any>(null)
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'PAID' | 'failed'>('PENDING')
  const qrRef = useRef(null)
  const router = useRouter()
  const {user} = useUser()


  const goBack = () => router.back()

  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "")
    setAmount(numericValue)
  }

  const generateQRCode = async () => {
    if (!amount || Number.parseInt(amount) <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ")
      return
    }

    try {
      setIsProcessing(true)
      const userId = user?.id as string
      const returnUrl = "audivia://payment_success" 
      const cancelUrl = "audivia://payment_cancel" 
      const response = await createPaymentIntent(
        userId,
        returnUrl,
        cancelUrl,
        Number(amount),
        "Nạp tiền vào ví" 
      )
      setQrInfo(response.qrCode)
      setPaymentStatus('PENDING')
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tạo mã QR. Vui lòng thử lại.")
    } finally {
      setIsProcessing(false)
    }
  }
 
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkStatus = async () => {
      if (!qrInfo?.paymentLinkId) return;

      try {    
        //b7e91ef899c5495ba6c4dc4b1701e761
       // const response = await checkPaymentStatus("b7e91ef899c5495ba6c4dc4b1701e761")    
        const response = await checkPaymentStatus(qrInfo?.paymentLinkId)       

        const status = response.status

        if (status === 'PAID') {
          setPaymentStatus('PAID')
          router.push(`/(screens)/payment_success?tourId=${params.tourId}&redirect=${params.redirect}`)
          clearInterval(intervalId)
        } else if (status === 'CANCELLED' || status === 'EXPIRED') {
          setPaymentStatus('failed')
          Alert.alert("Thất bại", "Thanh toán không thành công")
          clearInterval(intervalId)
        }
      } catch (error) {
        console.error('lỗi rồi:', error)
      }
    }

    if (qrInfo?.paymentLinkId && paymentStatus === 'PENDING') {
      // Kiểm tra trạng thái mỗi 5 giây
      intervalId = setInterval(checkStatus, 5000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [qrInfo?.paymentLinkId, paymentStatus])



  const formatCurrency = (value: string) => {
    if (!value) return ""
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(value))
  }

  const saveQrToGallery = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Lỗi", "Không có quyền truy cập thư viện ảnh")
        return
      }

      const uri = await qrRef.current.capture()
      const asset = await MediaLibrary.createAssetAsync(uri)
      await MediaLibrary.createAlbumAsync("QR Codes", asset, false)

      Alert.alert("Thành công", "Đã lưu mã QR vào thư viện ảnh")
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu ảnh")
      console.error(error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.light} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nạp tiền vào ví</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.amountInputContainer}>
          <Text style={styles.inputLabel}>Nhập số tiền muốn nạp</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor={COLORS.grey}
            />
            <Text style={styles.currencyLabel}>VND</Text>
          </View>
          {amount ? (
            <Text style={styles.amountInWords}>
              {formatCurrency(amount)}
            </Text>
          ) : null}

          <TouchableOpacity
            style={[
              styles.generateButton,
              !amount ? styles.generateButtonDisabled : null,
            ]}
            onPress={generateQRCode}
            disabled={!amount || isProcessing}
          >
            <Text style={styles.generateButtonText}>
              {isProcessing ? "Đang xử lý..." : "Nạp tiền"}
            </Text>
          </TouchableOpacity>
        </View>

        {qrInfo && (
          <View style={styles.qrInfoContainer}>
            <Text style={{color: 'red'}}>Lưu ý: Chỉ chuyển khoản qua app ngân hàng (không chuyển qua ví điện tử)</Text>
            <Text style={styles.infoText}>Ngân hàng (BIN): {qrInfo.bin}</Text>
            <Text style={styles.infoText}>Số tài khoản: {qrInfo.accountNumber}</Text>
            <Text style={styles.infoText}>Chủ tài khoản: {qrInfo.accountName}</Text>
            <Text style={styles.infoText}>Số tiền: {formatCurrency(String(qrInfo.amount))}</Text>
            <Text style={styles.infoText}>Nội dung: {qrInfo.description}</Text>

            {/* <TouchableOpacity onPress={() => Linking.openURL(qrInfo.checkoutUrl)}>
              <Text style={styles.linkText}>Mở trang thanh toán</Text>
            </TouchableOpacity> */}

            <View style={{ alignItems: "center", marginTop: 12 }}>
              <ViewShot ref={qrRef} options={{ format: "png", quality: 1.0 }}>
                <QRCode value={qrInfo.qrCode} size={200} />
              </ViewShot>

              <TouchableOpacity onPress={saveQrToGallery} style={{ marginTop: 10 }}>
                <Text style={{ color: COLORS.primary }}>Lưu mã QR</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}
