import { FlatList } from "react-native";
import { ForumPost } from "./ForumPost";

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

interface PostsListProps {
  posts: Post[];
}

export const PostsList = ({ posts }: PostsListProps) => {
  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <ForumPost item={item} />}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
    />
  );
}; 