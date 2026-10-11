export interface User {
  id: string;
  name: string;
  email?: string;
  role?: 'admin' | 'user';
  avatar: string;
  isOnline: boolean;
  statusText?: string;
  mutualFriends?: number;
}

export interface Story {
  id: string;
  user: User;
  mediaUrl: string;
  timestamp: string;
  caption?: string;
  isViewed?: boolean;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
  hasLiked?: boolean;
}

export type ReactionType = 'like' | 'love' | 'care' | 'haha' | 'wow' | 'sad' | 'angry';

export interface Post {
  id: string;
  author: User;
  timestamp: string;
  privacy: 'public' | 'friends' | 'only_me';
  text: string;
  mediaUrl?: string;
  aspectRatio?: string;
  feeling?: {
    emoji: string;
    text: string;
  };
  likesCount: number;
  userReaction?: ReactionType | null;
  reactionCounts: {
    like: number;
    love: number;
    care: number;
    haha: number;
    wow: number;
    sad: number;
    angry: number;
  };
  comments: Comment[];
  sharesCount: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isThumb?: boolean;
}

export interface ActiveChat {
  contact: User;
  messages: ChatMessage[];
  isMinimized: boolean;
}

export interface NotificationItem {
  id: string;
  user: User;
  action: string;
  target?: string;
  time: string;
  read: boolean;
  type: 'like' | 'comment' | 'tag' | 'group' | 'birthday' | 'friend_request';
}

export interface MarketplaceItem {
  id: string;
  title: string;
  price: string;
  location: string;
  imageUrl: string;
  seller: string;
  timeAgo: string;
}

export interface VideoPost {
  id: string;
  creator: User;
  title: string;
  views: string;
  timestamp: string;
  thumbnailUrl: string;
  videoDuration: string;
  likesCount: number;
  commentsCount: number;
}
