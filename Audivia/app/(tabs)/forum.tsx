"use client"

import { useState } from "react"
import { Image, Text, TouchableOpacity, View, FlatList, TextInput } from "react-native"
import { Ionicons, AntDesign } from "@expo/vector-icons"
import { COLORS } from "@/constants/theme"
import { styles } from "@/styles/forum.styles"

// Sample data for posts
const POSTS = [
  {
    id: "1",
    user: {
      name: "Thien Thien",
      avatar: require("@/assets/images/avatar1.jpg"),
      location: "Vịnh Hạ Long, Việt Nam",
    },
    content:
    "Địa điểm tuyệt vời để đi du lịch",
    images: ["https://images.unsplash.com/photo-1573270689103-d7a4e42b609a?q=80&w=1000&auto=format&fit=crop"],
    likes: 243,
    comments: 42,
    time: "2 giờ trước",
  },
  {
    id: "2",
    user: {
      name: "Tien Pham",
      avatar: require("@/assets/images/avatar2.jpg"),
      location: "Hội An, Việt Nam",
    },
    content:
    "Trải nghiệm tuyệt vời luôn",
    images: ["https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=1000&auto=format&fit=crop"],
    likes: 512,
    comments: 78,
    time: "1 ngày trước",
  }
  
]

export default function ForumScreen() {
  const [activeTab, setActiveTab] = useState("Following")

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image source={item.user.avatar} style={styles.avatar} />
          <View>
            <Text style={styles.userName}>{item.user.name}</Text>
            <Text style={styles.location}>{item.user.location}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.dark} />
        </TouchableOpacity>
      </View>

      {/* Post Image */}
      <View style={styles.postImageContainer}>
        <Image source={{ uri: item.images[0] }} style={styles.postImage} resizeMode="cover" />
      </View>

      {/* Post Actions */}
      <View style={styles.postActions}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.actionButton}>
            <AntDesign name="heart" size={24} color={COLORS.red} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={22} color={COLORS.dark} />
          </TouchableOpacity>
        </View>
     
      </View>

      {/* Post Stats */}

      <View style={styles.postStats}>
        <Text style={styles.likes}>{item.likes} lượt thích</Text>
      </View>

      {/* Post Content */}
      <View style={styles.postContent}>
        <Text style={styles.postText}>
          <Text style={styles.userName}>{item.user.name}</Text> {item.content}
        </Text>
      </View>

      {/* Comments */}
      <TouchableOpacity style={styles.commentsLink}>
        <Text style={styles.commentsText}>Xem tất cả {item.comments} bình luận</Text>
      </TouchableOpacity>

      {/* Time */}
      <Text style={styles.timeText}>{item.time}</Text>

      {/* Comment Input */}
      <View style={styles.commentInputContainer}>
        <Image
          source={require("@/assets/images/avatar.jpg")}
          style={styles.commentAvatar}
        />
        <TextInput style={styles.commentInput} placeholder="Thêm bình luận..." placeholderTextColor={COLORS.grey} />
        <TouchableOpacity>
          <Text style={styles.postButton}>Đăng</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Diễn đàn</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="person-circle-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Following" && styles.activeTab]}
          onPress={() => setActiveTab("Following")}
        >
          <Text style={[styles.tabText, activeTab === "Following" && styles.activeTabText]}>Theo dõi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Popular" && styles.activeTab]}
          onPress={() => setActiveTab("Popular")}
        >
          <Text style={[styles.tabText, activeTab === "Popular" && styles.activeTabText]}>Đề xuất</Text>
        </TouchableOpacity>
      </View>

      {/* What's on your mind section */}
      <View style={styles.whatsOnYourMindContainer}>
        <View style={styles.whatsOnYourMindContent}>
          <Image
            source={require("@/assets/images/avatar.jpg")}
            style={styles.whatsOnYourMindAvatar}
          />
          <TouchableOpacity style={styles.whatsOnYourMindInput}>
            <Text style={styles.whatsOnYourMindText}>Bạn đang nghĩ gì?</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Posts */}
      <FlatList
        data={POSTS}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}
