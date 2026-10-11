import { User, Story, Post, NotificationItem, MarketplaceItem, VideoPost, ChatMessage } from '../types';

// Empty state: No demo users, no demo posts, no demo stories
export const DEFAULT_USER: User | null = null;

export const CONTACTS_DATA: User[] = [];

export const STORIES_DATA: Story[] = [];

export const INITIAL_POSTS: Post[] = [];

export const SPONSORED_ADS: {
  id: string;
  title: string;
  domain: string;
  imageUrl: string;
  tagline: string;
}[] = [];

export const NOTIFICATIONS_DATA: NotificationItem[] = [];

export const MARKETPLACE_ITEMS: MarketplaceItem[] = [];

export const VIDEO_POSTS: VideoPost[] = [];

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {};
