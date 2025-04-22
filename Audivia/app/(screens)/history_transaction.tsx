import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, FlatList } from "react-native"
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons"
import { COLORS } from "@/constants/theme"
import { useRouter } from "expo-router"
import styles from "@/styles/history_transaction.styles"
import { useUser } from "@/hooks/useUser"
// Dữ liệu mẫu cho lịch sử giao dịch
const TRANSACTIONS = [
  {
    id: "1",
    type: "deposit",
    amount: 500000,
    date: "15/04/2025",
    time: "10:30",
    description: "Nạp tiền vào ví",
    status: "completed",
  },
  {
    id: "2",
    type: "payment",
    amount: -350000,
    date: "10/04/2025",
    time: "14:15",
    description: "Thanh toán Tour Vịnh Hạ Long",
    status: "completed",
  },
  {
    id: "3",
    type: "refund",
    amount: 150000,
    date: "05/04/2025",
    time: "09:45",
    description: "Hoàn tiền từ hủy tour",
    status: "completed",
  },
  {
    id: "4",
    type: "payment",
    amount: -200000,
    date: "01/04/2025",
    time: "16:20",
    description: "Thanh toán Tour Hội An",
    status: "completed",
  },
  {
    id: "5",
    type: "refund",
    amount: 150000,
    date: "05/04/2025",
    time: "09:45",
    description: "Hoàn tiền từ hủy tour",
    status: "completed",
  },
]

export default function WalletScreen() {
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()
  const { user } = useUser()

  const goBack = () => {
    router.back()
  }

  const navigateToDeposit = () => {
    router.push("/deposit")
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <Ionicons name="arrow-down-circle" size={24} color={COLORS.green} />
      case "payment":
        return <Ionicons name="cart" size={24} color={COLORS.red} />
      case "refund":
        return <Ionicons name="return-down-back" size={24} color={COLORS.blue} />
      default:
        return <Ionicons name="swap-horizontal" size={24} color={COLORS.orange} />
    }
  }

    const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const renderTransaction = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={styles.transactionIconContainer}>{getTransactionIcon(item.type)}</View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionDateTime}>
          {item.date} • {item.time}
        </Text>
      </View>
      <Text style={[styles.transactionAmount, { color: item.amount >= 0 ? COLORS.green : COLORS.red }]}>
        {formatCurrency(item.amount)}
      </Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.light} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ví của tôi</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Wallet Balance */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Số dư ví</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(user?.balanceWallet || 0)}</Text>
          <View style={styles.walletActions}>
            <TouchableOpacity style={styles.walletActionButton} onPress={navigateToDeposit}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="add-circle-outline" size={24} color={COLORS.light} />
              </View>
              <Text style={styles.actionButtonText}>Nạp tiền</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.walletActionButton}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="arrow-down-circle-outline" size={24} color={COLORS.light} />
              </View>
              <Text style={styles.actionButtonText}>Rút tiền</Text>
            </TouchableOpacity>
          </View>
        </View>


        {/* Transactions */}
        <View style={styles.transactionsCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Lịch sử giao dịch</Text>
            <TouchableOpacity>
              <Text style={styles.cardAction}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionTabs}>
            <TouchableOpacity
              style={[styles.transactionTab, activeTab === "all" && styles.activeTransactionTab]}
              onPress={() => setActiveTab("all")}
            >
              <Text style={[styles.transactionTabText, activeTab === "all" && styles.activeTransactionTabText]}>
                Tất cả
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.transactionTab, activeTab === "in" && styles.activeTransactionTab]}
              onPress={() => setActiveTab("in")}
            >
              <Text style={[styles.transactionTabText, activeTab === "in" && styles.activeTransactionTabText]}>
                Tiền vào
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.transactionTab, activeTab === "out" && styles.activeTransactionTab]}
              onPress={() => setActiveTab("out")}
            >
              <Text style={[styles.transactionTabText, activeTab === "out" && styles.activeTransactionTabText]}>
                Tiền ra
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={TRANSACTIONS}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>

    </SafeAreaView>
  )
}

