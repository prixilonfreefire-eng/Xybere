import React, { useRef } from 'react';
import { Plus, ChevronLeft, ChevronRight, Sparkles, UserCircle } from 'lucide-react';
import { Story, User } from '../types';

interface StoriesRailProps {
  stories: Story[];
  currentUser: User | null;
  onOpenStory: (story: Story) => void;
  onCreateStory: () => void;
  onOpenAuth?: () => void;
}

export const StoriesRail: React.FC<StoriesRailProps> = ({
  stories,
  currentUser,
  onOpenStory,
  onCreateStory,
  onOpenAuth,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCreate = () => {
    if (!currentUser && onOpenAuth) {
      onOpenAuth();
      return;
    }
    onCreateStory();
  };

  return (
    <div className="relative mb-4 group select-none">
      {/* Scroll left button */}
      {stories.length > 2 && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] shadow-md border border-[#E4E6EB] dark:border-[#4E4F50] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Stories horizontal track */}
      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1"
      >
        {/* CREATE STORY CARD */}
        <div
          onClick={handleCreate}
          className="w-28 sm:w-36 h-48 sm:h-52 flex-shrink-0 rounded-xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 transform hover:scale-[1.02] bg-white dark:bg-[#242526] flex flex-col relative border border-[#E4E6EB] dark:border-[#393A3B]"
        >
          {/* Top image half */}
          <div className="h-[70%] w-full overflow-hidden relative bg-[#E4E6EB] dark:bg-[#3A3B3C] flex items-center justify-center">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="Your Story"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            ) : (
              <UserCircle className="w-16 h-16 text-[#65676B] dark:text-[#B0B3B8]" />
            )}
          </div>

          {/* Bottom create action half */}
          <div className="h-[30%] w-full bg-white dark:bg-[#242526] flex flex-col items-center justify-end pb-2 relative">
            {/* Round plus button overlapping the seam */}
            <div className="absolute -top-4 w-9 h-9 rounded-full bg-[#0866FF] border-4 border-white dark:border-[#242526] flex items-center justify-center text-white shadow-sm">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-xs font-semibold text-[#050505] dark:text-[#E4E6EB] text-center px-1">
              {currentUser ? 'Create story' : 'Add story'}
            </span>
          </div>
        </div>

        {/* EMPTY STORIES PLACEHOLDER WHEN NO STORIES */}
        {stories.length === 0 && (
          <div className="flex-1 min-w-[200px] sm:min-w-[280px] h-48 sm:h-52 rounded-xl border border-dashed border-[#CED0D4] dark:border-[#393A3B] bg-white/40 dark:bg-[#242526]/40 flex flex-col items-center justify-center p-4 text-center">
            <Sparkles className="w-6 h-6 text-[#0866FF] mb-2 opacity-80" />
            <p className="text-xs sm:text-sm font-semibold text-[#050505] dark:text-[#E4E6EB]">
              No stories shared yet
            </p>
            <p className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] mt-1 max-w-xs">
              Click "Create story" to share your first mission photo or update.
            </p>
          </div>
        )}

        {/* FRIEND STORIES */}
        {stories.map((story) => (
          <div
            key={story.id}
            onClick={() => onOpenStory(story)}
            className="w-28 sm:w-36 h-48 sm:h-52 flex-shrink-0 rounded-xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 transform hover:scale-[1.02] relative group/card border border-transparent dark:border-[#393A3B]"
          >
            {/* Story Background Image */}
            <img
              src={story.mediaUrl}
              alt={story.user.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
            />

            {/* Gradient Overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />

            {/* User Avatar with Blue Active Ring */}
            <div className="absolute top-3 left-3 z-10">
              <div
                className={`w-10 h-10 rounded-full p-0.5 ${
                  story.isViewed
                    ? 'ring-2 ring-gray-400'
                    : 'ring-3 ring-[#0866FF] bg-[#0866FF]'
                }`}
              >
                <img
                  src={story.user.avatar}
                  alt={story.user.name}
                  className="w-full h-full rounded-full object-cover border border-white dark:border-[#242526]"
                />
              </div>
            </div>

            {/* Friend Name */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10">
              <p className="text-xs font-semibold text-white drop-shadow-md truncate">
                {story.user.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll right button */}
      {stories.length > 2 && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] shadow-md border border-[#E4E6EB] dark:border-[#4E4F50] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

