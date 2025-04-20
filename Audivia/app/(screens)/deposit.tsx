import { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import QRCode from "react-native-qrcode-svg"
import { COLORS } from "@/constants/theme"
import styles from "@/styles/deposit.styles"

export default function DepositScreen() {
  const [amount, setAmount] = useState("")
  const [showQR, setShowQR] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const router = useRouter()

  const goBack = () => {
    router.back()
  }

  const handleAmountChange = (text: string) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, "")
    setAmount(numericValue)
  }

  const generateQRCode = () => {
    if (!amount || Number.parseInt(amount) <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ")
      return
    }
    setShowQR(true)
  }

  const formatCurrency = (value: string) => {
    if (!value) return ""
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number.parseInt(value))
  }

  // Simulate payment verification
  useEffect(() => {
    if (showQR && !isComplete) {
      const timer = setTimeout(() => {
        setIsProcessing(true)

        // Simulate payment confirmation after 5 seconds
        const confirmTimer = setTimeout(() => {
          setIsProcessing(false)
          setIsComplete(true)
        }, 5000)

        return () => clearTimeout(confirmTimer)
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [showQR, isComplete])

  const resetForm = () => {
    setAmount("")
    setShowQR(false)
    setIsProcessing(false)
    setIsComplete(false)
  }

  const handleComplete = () => {
    resetForm()
    router.back()
  }

  const qrData = {
    amount: amount,
    timestamp: new Date().toISOString(),
    reference: `PAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.light} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nạp tiền vào ví</Text>
      </View>

      <View style={styles.content}>
        {!showQR ? (
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
            {amount ? <Text style={styles.amountInWords}>{formatCurrency(amount)}</Text> : null}

            <TouchableOpacity
              style={[styles.generateButton, !amount ? styles.generateButtonDisabled : null]}
              onPress={generateQRCode}
              disabled={!amount}
            >
              <Text style={styles.generateButtonText}>Tạo mã QR</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.qrContainer}>
            {isComplete ? (
              <View style={styles.successContainer}>
                <View style={styles.successIconContainer}>
                  <Ionicons name="checkmark-circle" size={80} color={COLORS.green} />
                </View>
                <Text style={styles.successTitle}>Thanh toán thành công!</Text>
                <Text style={styles.successAmount}>{formatCurrency(amount)}</Text>
                <Text style={styles.successMessage}>Số tiền đã được nạp vào ví của bạn</Text>
                <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                  <Text style={styles.completeButtonText}>Hoàn tất</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={styles.qrTitle}>Quét mã QR để thanh toán</Text>
                <Text style={styles.qrAmount}>{formatCurrency(amount)}</Text>

                <View style={styles.qrCodeContainer}>
                  {isProcessing ? (
                    <View style={styles.processingContainer}>
                      <ActivityIndicator size="large" color={COLORS.primary} />
                      <Text style={styles.processingText}>Đang xác nhận thanh toán...</Text>
                    </View>
                  ) : (
                    <QRCode value={JSON.stringify(qrData)} size={200} color="#000" backgroundColor="#fff" />
                  )}
                </View>

                <Text style={styles.qrInstructions}>
                  Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã QR và hoàn tất thanh toán
                </Text>

                <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

