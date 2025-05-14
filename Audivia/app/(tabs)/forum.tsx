import { useEffect, useState } from "react";
import { View } from "react-native";
import { styles } from "@/styles/forum.styles";
import { getAllPosts } from "@/services/post";
import { ForumHeader } from "@/components/forum/ForumHeader";
import { ForumTabs } from "@/components/forum/ForumTabs";
import { PostsList } from "@/components/forum/PostsList";

interface Post {
  id: string;
  user: {
    id: string;
    userName: string;
    avatarUrl?: string;
  };
  location: string;
  images: string[];
  likes: number;
  content: string;
  comments: number;
  time: string;
}

export default function ForumScreen() {
  const [activeTab, setActiveTab] = useState("Popular");
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getAllPosts().then((res: any) => {
      setPosts(res.response);
    });
  }, []);

  return (
    <View style={styles.container}>
      <ForumHeader />
      <ForumTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <PostsList posts={posts} />
    </View>
  );
}
