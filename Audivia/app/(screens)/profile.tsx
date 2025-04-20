import { useState } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  FlatList,
  StatusBar,
} from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { COLORS } from "@/constants/theme"
import { useRouter } from "expo-router"
import styles from "@/styles/profile.styles"

// Dữ liệu mẫu cho bài đăng của người dùng
const USER_POSTS = [
  {
    id: "1",
    content:
      "Cảnh đẹp, đồ ăn ngon và dịch vụ tốt.😍🌊",
    images: ["https://images.unsplash.com/photo-1573270689103-d7a4e42b609a?q=80&w=1000&auto=format&fit=crop"],
    likes: 87,
    comments: 12,
    time: "3 ngày trước",
  },
]

// Dữ liệu người dùng
const USER_INFO = {
  name: "Tina Pham",
  avatar: "https://res.cloudinary.com/dgzn2ix8w/image/upload/v1745141656/Audivia/a1wqzwrxluklxcwubzrc.jpg",
  coverPhoto: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=1000&auto=format&fit=crop",
  bio: "Yêu du lịch, khám phá những địa điểm mới🌏✈️",
  friends: 285,
  followers: 420,
}

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState("posts")
  const router = useRouter()

  const goBack = () => {
    router.back()
  }

  const renderPost = ({ item }: { item: any }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postUser}>
          <Image source={{ uri: USER_INFO.avatar }} style={styles.postAvatar} />
          <View>
            <Text style={styles.postUserName}>{USER_INFO.name}</Text>
            <Text style={styles.postTime}>{item.time}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <Text style={styles.postContent}>{item.content}</Text>

      <Image source={{ uri: item.images[0] }} style={styles.postImage} />

      <View style={styles.postStats}>
        <View style={styles.postLikes}>
          <View style={styles.likeIconContainer}>
            <Ionicons name="heart" size={12} color="#fff" />
          </View>
          <Text style={styles.statsText}>{item.likes}</Text>
        </View>
        <Text style={styles.statsText}>{item.comments} bình luận</Text>
      </View>

      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={22} color="#666" />
          <Text style={styles.actionText}>Thích</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={22} color="#666" />
          <Text style={styles.actionText}>Bình luận</Text>
        </TouchableOpacity>
      
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trang cá nhân</Text>
       
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Photo */}
        <View style={styles.coverPhotoContainer}>
          <Image source={{ uri: USER_INFO.coverPhoto }} style={styles.coverPhoto} />
          <View style={styles.profileAvatarContainer}>
            <Image source={{ uri: USER_INFO.avatar }} style={styles.profileAvatar} />
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{USER_INFO.name}</Text>
          <Text style={styles.profileBio}>{USER_INFO.bio}</Text>

          <View style={styles.socialStats}>
            <View style={styles.socialStat}>
              <Text style={styles.socialStatNumber}>{USER_INFO.friends}</Text>
              <Text style={styles.socialStatLabel}>Bạn bè</Text>
            </View>
            <View style={styles.socialStatDivider} />
            <View style={styles.socialStat}>
              <Text style={styles.socialStatNumber}>{USER_INFO.followers}</Text>
              <Text style={styles.socialStatLabel}>Người theo dõi</Text>
            </View>
          </View>

          <View style={styles.profileActions}>
            <TouchableOpacity style={[styles.profileActionButton, styles.primaryActionButton]}>
              <Ionicons name="pencil" size={18} color={COLORS.light} />
              <Text style={styles.primaryActionText}>Chỉnh sửa trang cá nhân</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "posts" && styles.activeTab]}
            onPress={() => setActiveTab("posts")}
          >
            <Text style={[styles.tabText, activeTab === "posts" && styles.activeTabText]}>Bài viết</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "about" && styles.activeTab]}
            onPress={() => setActiveTab("about")}
          >
            <Text style={[styles.tabText, activeTab === "about" && styles.activeTabText]}>Giới thiệu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "friends" && styles.activeTab]}
            onPress={() => setActiveTab("friends")}
          >
            <Text style={[styles.tabText, activeTab === "friends" && styles.activeTabText]}>Bạn bè</Text>
          </TouchableOpacity>
        </View>

        {/* Content based on active tab */}
        {activeTab === "posts" && (
          <View style={styles.postsContainer}>
            {/* Create Post */}
            <View style={styles.createPostCard}>
              <View style={styles.createPostHeader}>
                <Image source={{ uri: USER_INFO.avatar }} style={styles.createPostAvatar} />
                <TouchableOpacity style={styles.createPostInput}>
                  <Text style={styles.createPostPlaceholder}>Bạn đang nghĩ gì?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.createPostActions}>
                <TouchableOpacity style={styles.createPostAction}>
                  <Ionicons name="image-outline" size={20} color={COLORS.green} />
                  <Text style={styles.createPostActionText}>Ảnh</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.createPostAction}>
                  <Ionicons name="location-outline" size={20} color={COLORS.blue} />
                  <Text style={styles.createPostActionText}>Check in</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Posts */}
            <FlatList
              data={USER_POSTS}
              renderItem={renderPost}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {activeTab === "about" && (
          <View style={styles.aboutContainer}>
            <View style={styles.aboutCard}>
              <Text style={styles.aboutTitle}>Thông tin cá nhân</Text>

              <View style={styles.aboutItem}>
                <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.aboutIcon} />
                <View>
                  <Text style={styles.aboutLabel}>Email</Text>
                  <Text style={styles.aboutText}>tinapham@gmail.com</Text>
                </View>
                <TouchableOpacity style={styles.aboutEditButton}>
                  <Ionicons name="pencil-outline" size={18} color={COLORS.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.aboutItem}>
                <Ionicons name="call-outline" size={20} color={COLORS.primary} style={styles.aboutIcon} />
                <View>
                  <Text style={styles.aboutLabel}>Số điện thoại</Text>
                  <Text style={styles.aboutText}>+84 812654342</Text>
                </View>
                <TouchableOpacity style={styles.aboutEditButton}>
                  <Ionicons name="pencil-outline" size={18} color={COLORS.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.aboutItem}>
                <Ionicons name="calendar-outline" size={20} color={COLORS.primary} style={styles.aboutIcon} />
                <View>
                  <Text style={styles.aboutLabel}>Ngày sinh</Text>
                  <Text style={styles.aboutText}>31 tháng 01, 2003</Text>
                </View>
                <TouchableOpacity style={styles.aboutEditButton}>
                  <Ionicons name="pencil-outline" size={18} color={COLORS.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.aboutItem}>
                <Ionicons name="home-outline" size={20} color={COLORS.primary} style={styles.aboutIcon} />
                <View>
                  <Text style={styles.aboutLabel}>Địa chỉ</Text>
                  <Text style={styles.aboutText}>Thủ Đức, TP. Hồ Chí Minh, Việt Nam</Text>
                </View>
                <TouchableOpacity style={styles.aboutEditButton}>
                  <Ionicons name="pencil-outline" size={18} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.aboutCard}>
              <Text style={styles.aboutTitle}>Sở thích</Text>
              <View style={styles.interestsContainer}>
                <View style={styles.interestTag}>
                  <Text style={styles.interestText}>Du lịch</Text>
                </View>
                <View style={styles.interestTag}>
                  <Text style={styles.interestText}>Ẩm thực</Text>
                </View>
                <View style={styles.interestTag}>
                  <Text style={styles.interestText}>Nhiếp ảnh</Text>
                </View>
                <View style={styles.interestTag}>
                  <Text style={styles.interestText}>Khám phá</Text>
                </View>
                <View style={styles.interestTag}>
                  <Text style={styles.interestText}>Văn hóa</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.addInterestButton}>
                <Ionicons name="add" size={18} color={COLORS.primary} />
                <Text style={styles.addInterestText}>Thêm sở thích</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Bottom spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>
      
    </SafeAreaView>
  )
}

