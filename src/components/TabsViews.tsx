import React, { useState } from 'react';
import {
  Play,
  Volume2,
  ThumbsUp,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  MapPin,
  Tag,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { VideoPost, MarketplaceItem, User } from '../types';
import { VIDEO_POSTS, MARKETPLACE_ITEMS } from '../data/mockData';

export const WatchTab: React.FC<{ currentUser: User | null }> = ({ currentUser }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (VIDEO_POSTS.length === 0) {
    return (
      <div className="max-w-[680px] w-full mx-auto p-8 bg-white dark:bg-[#242526] rounded-xl shadow-xs border border-[#E4E6EB] dark:border-[#393A3B] text-center select-none">
        <div className="w-16 h-16 rounded-full bg-[#E7F3FF] dark:bg-[#263951] flex items-center justify-center mx-auto mb-3">
          <Play className="w-7 h-7 text-[#0866FF] ml-1" />
        </div>
        <h3 className="text-lg font-bold text-[#050505] dark:text-[#E4E6EB]">
          No video broadcasts yet
        </h3>
        <p className="text-xs sm:text-sm text-[#65676B] dark:text-[#B0B3B8] mt-1 max-w-sm mx-auto">
          When mission scientists and researchers publish flight recordings or lab telemetry videos, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[680px] w-full mx-auto space-y-4 pb-12 select-none">
      {VIDEO_POSTS.map((video) => (
        <div
          key={video.id}
          className="bg-white dark:bg-[#242526] rounded-xl shadow-xs border border-[#E4E6EB] dark:border-[#393A3B] overflow-hidden"
        >
          {/* Creator header */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={video.creator.avatar}
                alt={video.creator.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-bold text-[#050505] dark:text-[#E4E6EB]">
                  {video.creator.name}
                </p>
                <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
                  {video.timestamp} · {video.views}
                </p>
              </div>
            </div>
            <button className="text-[#65676B] dark:text-[#B0B3B8] p-1.5 rounded-full hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C]">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Video Title */}
          <p className="px-3.5 pb-2 text-sm sm:text-base font-medium text-[#050505] dark:text-[#E4E6EB]">
            {video.title}
          </p>

          {/* Video Player Mock */}
          <div
            onClick={() => setPlayingId(playingId === video.id ? null : video.id)}
            className="relative w-full aspect-video bg-black flex items-center justify-center cursor-pointer group"
          >
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
            />
            {/* Dark gradient */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white border-2 border-white/80 group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
            </div>

            {/* Duration pill */}
            <span className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-semibold px-2 py-0.5 rounded-md">
              {video.videoDuration}
            </span>
          </div>

          {/* Metrics & Actions */}
          <div className="px-3.5 py-2.5 flex items-center justify-between text-xs text-[#65676B] dark:text-[#B0B3B8] border-b border-[#CED0D4] dark:border-[#393A3B]">
            <span>👍 {video.likesCount.toLocaleString()} likes</span>
            <span>{video.commentsCount.toLocaleString()} comments</span>
          </div>

          <div className="px-2 py-1 flex items-center justify-between text-sm font-semibold text-[#65676B] dark:text-[#B0B3B8]">
            <button className="flex-1 py-2 flex items-center justify-center gap-2 hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] rounded-lg">
              <ThumbsUp className="w-5 h-5" />
              <span>Like</span>
            </button>
            <button className="flex-1 py-2 flex items-center justify-center gap-2 hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] rounded-lg">
              <MessageSquare className="w-5 h-5" />
              <span>Comment</span>
            </button>
            <button className="flex-1 py-2 flex items-center justify-center gap-2 hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] rounded-lg">
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export const MarketplaceTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<MarketplaceItem[]>(MARKETPLACE_ITEMS);

  const categories = ['All', 'Vehicles', 'Property Rentals', 'Electronics', 'Home Goods', 'Apparel'];

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 pb-12 select-none">
      {/* Top Header & Search */}
      <div className="bg-white dark:bg-[#242526] rounded-xl p-4 shadow-xs border border-[#E4E6EB] dark:border-[#393A3B] mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#050505] dark:text-[#E4E6EB]">
              Marketplace
            </h2>
            <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
              Today's picks in San Francisco Bay Area · Within 40 miles
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#65676B] dark:text-[#B0B3B8]" />
              <input
                type="text"
                placeholder="Search Marketplace"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] rounded-full text-xs sm:text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#0866FF] text-white'
                  : 'bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] hover:bg-[#E4E6EB]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Listings */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#242526] rounded-xl overflow-hidden shadow-xs border border-[#E4E6EB] dark:border-[#393A3B] hover:shadow-md transition-shadow cursor-pointer flex flex-col group"
            >
              <div className="relative aspect-square overflow-hidden bg-black/5 dark:bg-black/20">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-base font-bold text-[#050505] dark:text-[#E4E6EB]">
                    {item.price}
                  </p>
                  <h4 className="text-xs sm:text-sm font-medium text-[#050505] dark:text-[#E4E6EB] line-clamp-2 mt-0.5">
                    {item.title}
                  </h4>
                </div>
                <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{item.location}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 bg-white dark:bg-[#242526] rounded-xl shadow-xs border border-[#E4E6EB] dark:border-[#393A3B] text-center">
          <div className="w-16 h-16 rounded-full bg-[#E7F3FF] dark:bg-[#263951] flex items-center justify-center mx-auto mb-3">
            <Tag className="w-7 h-7 text-[#0866FF]" />
          </div>
          <h3 className="text-lg font-bold text-[#050505] dark:text-[#E4E6EB]">
            No marketplace listings yet
          </h3>
          <p className="text-xs sm:text-sm text-[#65676B] dark:text-[#B0B3B8] mt-1 max-w-sm mx-auto">
            Scientific equipment, field instruments, and laboratory materials will be posted here as members add them.
          </p>
        </div>
      )}
    </div>
  );
};
