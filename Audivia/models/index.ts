export interface Tour {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  avgRating: number;
  duration: string;
  price: string;
  typeId: string;
}
export interface TourType {
  id: string;
  name: string;
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
  audioCharacterId: string;
  audioCharacterName: string;
  travelDistance: string;
}

