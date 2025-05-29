import { useEffect, useState } from "react"
import { View, SafeAreaView, FlatList, Alert } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { useUser } from "@/hooks/useUser"
import * as ImagePicker from 'expo-image-picker'
import { updateUserInfo, getUserInfo } from "@/services/user"
import { createPost, getPostByUserId, updatePost, deletePost } from "@/services/post"
import { Post, User } from "@/models"
import { PostModal } from "@/components/PostModal"
import { createUserFollow, deleteUserFollow, getUserFollows, getUserFriends } from "@/services/user_follow"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { ProfileCover } from "@/components/profile/ProfileCover"
import { ProfileInfo } from "@/components/profile/ProfileInfo"
import { ProfileTabs } from "@/components/profile/ProfileTabs"
import { ProfileAbout } from "@/components/profile/ProfileAbout"
import { ProfileFriends } from "@/components/profile/ProfileFriends"
import { ProfilePosts } from "@/components/profile/ProfilePosts"
import { createChatRoom, createChatRoomMember, getPrivateRoom } from "@/services/chat"
import { createNotification } from "@/services/notification"

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState("posts")
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [showPostModal, setShowPostModal] = useState(false)
  const [postContent, setPostContent] = useState("")
  const [postLocation, setPostLocation] = useState("")
  const [postImages, setPostImages] = useState<string[]>([])
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const DEFAULT_AVATAR = "https://res.cloudinary.com/dgzn2ix8w/image/upload/v1745396073/Audivia/ddizjlgkux0eoifrsoco.avif"
  const { user } = useUser()
  const router = useRouter()
  const params = useLocalSearchParams()
  const [profileUser, setProfileUser] = useState<User | undefined>(user)
  const [posts, setPosts] = useState<Post[]>([])
  const isOwnProfile = !params.userId || params.userId === user?.id
  const [status, setStatus] = useState("")
  const [friends, setFriend] = useState<User[]>([])

  const fetchUserData = async () => {
    try {
      if (params.userId && user?.id) {
        const userFollowStatus = await getUserFollows(user.id, params.userId as string);
        setStatus(userFollowStatus.followStatusString);

        const response = await getUserInfo(params.userId as string);
        setProfileUser(response.response);
      } else if (user) {
        setProfileUser(user);
        const friendList = await getUserFriends(user?.id)
        setFriend(friendList.response)
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin người dùng. Vui lòng thử lại.');
    }
  };

  useEffect(() => {
    if (user && (isOwnProfile || params.userId)) {
      fetchUserData();
    }
  }, [params.userId, user]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (profileUser?.id) {
        try {
          const response = await getPostByUserId(profileUser.id)
          setPosts(response.response)
        } catch (error) {
          console.error('Error fetching posts:', error)
          Alert.alert('Lỗi', 'Không thể tải bài viết')
        }
      }
    }

    fetchPosts()
  }, [profileUser?.id])

  const handleCreateUserFollow = async () => {
    try {
      await createUserFollow(user?.id as string, params.userId as string);
      setStatus((prevStatus) => {
        if (prevStatus === "NotFollowing") {
          return "Following";
        }else if (prevStatus === "NotFollowedBack") {
          return "Friends"; 
        }else if (prevStatus === "Following") {
          return "Friends";
        } else {
          return prevStatus;
        }
      })
    } catch (error) {
      console.error("Error creating follow:", error);
      Alert.alert("Lỗi", "Không thể theo dõi người dùng. Vui lòng thử lại.");
    }
  };

  const handleDeleteUserFollow = async () => {
    try {
      await deleteUserFollow(user?.id as string, params.userId as string);
      if(status === "Friends") {
        setStatus("NotFollowedBack")
      }else if(status === "Following") {
        setStatus("NotFollowing")
      }
    } catch (error) {
      console.error("Error deleting follow:", error);
      Alert.alert("Lỗi", "Không thể hủy theo dõi người dùng. Vui lòng thử lại.");
    }
  };

  const handleCreatePost = () => {
    setEditingPost(null)
    setPostContent("")
    setPostLocation("")
    setPostImages([])
    setShowPostModal(true)
  }

  const handleEditPost = (post: Post) => {
    setEditingPost(post)
    setPostContent(post.content)
    setPostLocation(post.location)
    setPostImages(post.images || [])
    setShowPostModal(true)
  }

  const handleDeletePost = async (postId: string) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa bài viết này?',
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePost(postId)
              setPosts(posts.filter((post: Post) => post.id !== postId))
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa bài viết. Vui lòng thử lại.')
            }
          }
        }
      ]
    )
  }

  const handleSavePost = async (postData: { content: string; location: string; images: string[] }) => {
    if (!profileUser?.id) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
      return;
    }

    try {
      if (editingPost) {
        await updatePost(editingPost.id, postData);
        setPosts(posts.map((post) => 
          post.id === editingPost.id 
            ? { ...post, ...postData }
            : post
        ));
        setShowPostModal(false);
      } else {
        const response = await createPost(
          postData.images,
          postData.location,
          postData.content,
          profileUser.id
        );
        if (response.success) {
          setPosts([response.response, ...posts]);
          setShowPostModal(false);


          try {
            const notificationParams = {
              userId: user?.id as string,
              content: `${user?.fullName} đã đăng một bài viết mới`,
              type: "Bài viết",
              isRead: false,
            }
            await createNotification(notificationParams)

          } catch (error) {
            console.error('Lỗi khi tạo thông báo:', error)
          }



        } else {
          throw new Error(response.message || 'Không thể tạo bài viết');
        }
      }
    } catch (error: any) {
      Alert.alert(
        'Lỗi', 
        error.response?.data?.message || error.message || 'Không thể lưu bài viết. Vui lòng thử lại.'
      );
    }
  };

  const handleAvatarPress = () => {
    if (isOwnProfile) {
      setShowAvatarModal(true)
    }
  }

  const handleCameraAvatar = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
      if (!permissionResult.granted) {
        Alert.alert('Cần quyền truy cập', 'Vui lòng cho phép ứng dụng truy cập camera')
        return
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })
      if (!result.canceled) {
        await updateUserInfo(profileUser?.id as string, {avatarUrl: result.assets[0].uri})
        setShowAvatarModal(false)
      }
    } catch (error) {
      console.error('Error picking image:', error)
      Alert.alert('Lỗi', 'Không thể chụp ảnh. Vui lòng thử lại.')
    }
  }

  const handleChangeAvatar = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
      
      if (!permissionResult.granted) {
        Alert.alert('Cần quyền truy cập', 'Vui lòng cho phép ứng dụng truy cập thư viện ảnh')
        return
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })

      if (!result.canceled) {
        await updateUserInfo(profileUser?.id as string, {avatarUrl: result.assets[0].uri})
      }
    } catch (error) {
      console.error('Error picking image:', error)
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.')
    }
  }

  const handleDeleteAvatar = async () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa ảnh đại diện?',
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            await updateUserInfo(profileUser?.id as string, {avatarUrl: DEFAULT_AVATAR})
            setShowAvatarModal(false)
          }
        }
      ]
    )
  }

  const goBack = () => {
    router.back()
  }

  const handleMessage = async () => {
    if (!user?.id || !profileUser?.id) return;

    try {
      // Kiểm tra xem đã có chat room giữa 2 người chưa
      const existingRoom = await getPrivateRoom(user.id, profileUser.id);
      if (existingRoom) {
        // Nếu đã có chat room thì chuyển đến message detail
        router.push(`/message_detail?id=${existingRoom.id}`);
      } else {
        // Nếu chưa có thì tạo mới chat room
        const newChatRoom = await createChatRoom({
          name: "Chat riêng tư",
          createdBy: user.id,
          type: "private",
        });
        
        // Thêm người dùng hiện tại vào là member
        await createChatRoomMember({
          chatRoomId: newChatRoom.id,
          isHost: true,
          nickname: "",
          userId: user.id
        });
        
        // Thêm người dùng được chọn vào là member
        await createChatRoomMember({
          chatRoomId: newChatRoom.id,
          isHost: false,
          nickname: "",
          userId: profileUser.id
        });

        // Chuyển đến phòng chat mới
        router.push(`/message_detail?id=${newChatRoom.id}`);
      }
    } catch (error) {
      console.error("Create chat room error:", error);
      Alert.alert("Lỗi", "Không thể tạo phòng chat. Vui lòng thử lại.");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <ProfilePosts
            posts={posts}
            user={profileUser as User}
            defaultAvatar={DEFAULT_AVATAR}
            isOwnProfile={isOwnProfile}
            onEditPost={handleEditPost}
            onDeletePost={handleDeletePost}
            onCreatePost={handleCreatePost}
          />
        )
      case "about":
        return (
          <ProfileAbout
            user={profileUser as User}
            isOwnProfile={isOwnProfile}
          />
        )
      case "friends":
        return (
          <ProfileFriends
            friends={friends}
          />
        )
      default:
        return null
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ProfileHeader onBack={goBack} />
      
      <FlatList
        data={[1]}
        renderItem={() => (
          <View style={{ flex: 1 }}>
            <ProfileCover
              coverPhoto={profileUser?.coverPhoto}
              avatarUrl={profileUser?.avatarUrl}
              defaultAvatar={DEFAULT_AVATAR}
              onAvatarPress={handleAvatarPress}
              isOwnProfile={isOwnProfile}
            />

            <ProfileInfo
              user={profileUser as User}
              isOwnProfile={isOwnProfile}
              status={status}
              onFollow={handleCreateUserFollow}
              onUnfollow={handleDeleteUserFollow}
              onMessage={handleMessage}
            />

            <ProfileTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {renderContent()}
          </View>
        )}
        keyExtractor={() => "profile"}
        showsVerticalScrollIndicator={false}
      />

      <PostModal
        visible={showPostModal}
        onClose={() => setShowPostModal(false)}
        onSave={handleSavePost}
        editingPost={editingPost}
      />
    </SafeAreaView>
  )
}

