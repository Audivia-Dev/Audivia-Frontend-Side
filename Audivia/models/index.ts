export interface Tour {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  avgRating: number;
  duration: number;
  price: number;
  location: string;
  checkpoints: Checkpoint[];
  typeId: string;
}
export interface Checkpoint {
  id: string;
  tourId: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  order: number;
  imageUrl: string;
}
export interface TourType {
  id: string;
  name: string;
}
export interface SaveTour {
  id: string;
  userId: string;
  tourId: string;
  savedAt: string;
  plannedTime: string | null;
  tour: Tour;
  timeAgo: string;
}
export interface User {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  phone: string;
  balanceWallet: string;
  bio: string;
  coverPhoto: string;
  followers: string;
  following: string;
  friends: string;
  audioCharacterId: string;
  audioCharacterName: string;
  travelDistance: string;
}

export interface Post {
  id: string;
  content: string;
  location: string;
  images: string[];
  time: string;
  likes: number;
  comments: number;
}

export interface ChatRoom {
  id: string;
  name: string;
  createdBy: string;
  isActive: boolean;
  type: string;
  members: ChatRoomMember
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  type: string;
  status: string; 
  chatRoomId: string;
  sender?: User;
  createdAt: Date;
}

export interface ChatRoomMember {
  id: string;
  chatRoomId: string;
  userId: string;
  nickname: string;
  isHost: boolean;
  user: User
}

export interface Review {
  id: string
  title: string
  content: string
  rating: number
  createdAt: string
  tourId: string
  createdBy: string
  userName: string
  avatarUrl: string
}