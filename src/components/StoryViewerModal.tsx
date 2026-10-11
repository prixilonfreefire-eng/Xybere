import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Send,
  Heart,
  Volume2,
} from 'lucide-react';
import { Story, User } from '../types';

interface StoryViewerModalProps {
  stories: Story[];
  currentStoryId: string | null;
  onClose: () => void;
  currentUser: User | null;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  currentStoryId,
  onClose,
  currentUser,
}) => {
  if (!currentStoryId) return null;

  const initialIndex = stories.findIndex((s) => s.id === currentStoryId);
  const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [sentToast, setSentToast] = useState(false);

  const currentStory = stories[currentIndex] || stories[0];

  // Story progress timer (5 seconds per story)
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Go to next story or close
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((idx) => idx + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2; // ~5 seconds total
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, stories.length, onClose]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((idx) => idx - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((idx) => idx + 1);
    } else {
      onClose();
    }
  };

  const handleSendReply = (emoji?: string) => {
    const textToSend = emoji || replyText;
    if (!textToSend.trim()) return;

    setSentToast(true);
    setReplyText('');
    setTimeout(() => setSentToast(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-4 select-none backdrop-blur-md">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Close stories"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Arrow Left */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white hidden sm:flex items-center justify-center transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Center Story Display Card */}
      <div className="relative w-full max-w-[420px] h-[85vh] max-h-[750px] bg-[#18191A] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-white/10">
        {/* TOP PROGRESS BARS */}
        <div className="absolute top-3 left-3 right-3 z-30 flex gap-1.5">
          {stories.map((story, idx) => (
            <div
              key={story.id}
              className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* TOP STORY HEADER */}
        <div className="absolute top-6 left-3 right-3 z-30 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <img
              src={currentStory.user.avatar}
              alt={currentStory.user.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#0866FF]"
            />
            <div>
              <p className="text-sm font-bold text-white drop-shadow-md">
                {currentStory.user.name}
              </p>
              <p className="text-[11px] text-white/80 drop-shadow-md">
                {currentStory.timestamp}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
            <button className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer">
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STORY PHOTO BACKGROUND */}
        <div className="relative flex-1 w-full bg-black flex items-center justify-center overflow-hidden">
          <img
            src={currentStory.mediaUrl}
            alt="Story media"
            className="w-full h-full object-cover"
          />

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />

          {/* Story Caption */}
          {currentStory.caption && (
            <div className="absolute bottom-20 left-4 right-4 z-20">
              <p className="text-sm sm:text-base font-medium text-white drop-shadow-lg text-center bg-black/40 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                {currentStory.caption}
              </p>
            </div>
          )}
        </div>

        {/* BOTTOM STORY REPLY & QUICK REACTIONS */}
        <div className="p-3 bg-black/70 backdrop-blur-md z-30 space-y-2 border-t border-white/10">
          {sentToast && (
            <div className="text-xs text-center text-[#31A24C] font-semibold py-0.5">
              Reply sent to {currentStory.user.name}!
            </div>
          )}

          {/* Quick Reaction Emojis */}
          <div className="flex items-center justify-around py-1">
            {['❤️', '😂', '😮', '😢', '👏', '🔥'].map((em, i) => (
              <button
                key={i}
                onClick={() => handleSendReply(em)}
                className="text-2xl hover:scale-130 transition-transform cursor-pointer"
              >
                {em}
              </button>
            ))}
          </div>

          {/* Message input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
              placeholder={`Reply to ${currentStory.user.name}...`}
              className="flex-1 bg-white/15 text-white placeholder-white/60 text-xs sm:text-sm px-4 py-2.5 rounded-full focus:outline-none border border-white/20"
            />
            {replyText.trim() && (
              <button
                onClick={() => handleSendReply()}
                className="w-9 h-9 rounded-full bg-[#0866FF] hover:bg-[#1877F2] text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrow Right */}
      {currentIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white hidden sm:flex items-center justify-center transition-colors cursor-pointer"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}
    </div>
  );
};
