import React, { useState } from 'react';
import {
  X,
  Image,
  Smile,
  UserCheck,
  MapPin,
  Sparkles,
  Globe,
  Users,
  Lock,
  ChevronDown,
  Camera,
} from 'lucide-react';
import { User, Post, ReactionType } from '../types';

interface CreatePostModalProps {
  currentUser: User | null;
  isOpen: boolean;
  onClose: () => void;
  onAddPost: (post: Post) => void;
  defaultFeeling?: { emoji: string; text: string };
  defaultPhotoPrompt?: boolean;
}

const FEELINGS_LIST = [
  { emoji: '😊', text: 'happy' },
  { emoji: '✨', text: 'blessed' },
  { emoji: '🚀', text: 'excited' },
  { emoji: '☕', text: 'relaxed' },
  { emoji: '🎉', text: 'celebrating' },
  { emoji: '🍕', text: 'eating' },
  { emoji: '✈️', text: 'traveling' },
  { emoji: '💪', text: 'productive' },
  { emoji: '🎧', text: 'listening to music' },
];

const PRESET_PHOTOS = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80',
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onAddPost,
  defaultFeeling,
  defaultPhotoPrompt,
}) => {
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'only_me'>('public');
  const [feeling, setFeeling] = useState<{ emoji: string; text: string } | null>(
    defaultFeeling || null
  );
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [showPhotoPicker, setShowPhotoPicker] = useState(defaultPhotoPrompt || false);
  const [showFeelingPicker, setShowFeelingPicker] = useState(false);
  const [showPrivacyMenu, setShowPrivacyMenu] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaUrl) return;

    const newPost: Post = {
      id: `post_${Date.now()}`,
      author: currentUser,
      timestamp: 'Just now',
      privacy,
      text: content.trim(),
      mediaUrl: mediaUrl || undefined,
      feeling: feeling || undefined,
      likesCount: 0,
      userReaction: null,
      reactionCounts: {
        like: 0,
        love: 0,
        care: 0,
        haha: 0,
        wow: 0,
        sad: 0,
        angry: 0,
      },
      comments: [],
      sharesCount: 0,
    };

    onAddPost(newPost);
    setContent('');
    setMediaUrl(null);
    setFeeling(null);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setMediaUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="bg-white dark:bg-[#242526] w-full max-w-[500px] rounded-xl shadow-2xl border border-[#E4E6EB] dark:border-[#393A3B] overflow-hidden flex flex-col max-h-[90vh]">
        {/* MODAL HEADER */}
        <div className="relative px-4 py-3.5 border-b border-[#E4E6EB] dark:border-[#393A3B] text-center">
          <h2 className="text-xl font-bold text-[#050505] dark:text-[#E4E6EB]">
            Create post
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-3 w-9 h-9 rounded-full bg-[#E4E6EB] dark:bg-[#3A3B3C] hover:bg-[#D8DADF] dark:hover:bg-[#4E4F50] flex items-center justify-center text-[#65676B] dark:text-[#B0B3B8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-4 overflow-y-auto fb-scrollbar flex-1 space-y-4">
          {/* User Profile + Audience Selector */}
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-11 h-11 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-sm text-[#050505] dark:text-[#E4E6EB]">
                  {currentUser.name}
                </span>
                {feeling && (
                  <span className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
                    is {feeling.emoji} feeling <strong className="text-[#050505] dark:text-[#E4E6EB]">{feeling.text}</strong>
                  </span>
                )}
              </div>

              {/* Audience button */}
              <div className="relative inline-block mt-0.5">
                <button
                  type="button"
                  onClick={() => setShowPrivacyMenu(!showPrivacyMenu)}
                  className="flex items-center gap-1.5 px-2 py-0.5 bg-[#E4E6EB] dark:bg-[#3A3B3C] hover:bg-[#D8DADF] dark:hover:bg-[#4E4F50] rounded-md text-xs font-semibold text-[#050505] dark:text-[#E4E6EB] transition-colors cursor-pointer"
                >
                  {privacy === 'public' && <Globe className="w-3.5 h-3.5" />}
                  {privacy === 'friends' && <Users className="w-3.5 h-3.5" />}
                  {privacy === 'only_me' && <Lock className="w-3.5 h-3.5" />}
                  <span className="capitalize">{privacy === 'only_me' ? 'Only me' : privacy}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showPrivacyMenu && (
                  <div className="absolute left-0 top-7 w-40 bg-white dark:bg-[#242526] shadow-xl rounded-lg border border-[#E4E6EB] dark:border-[#393A3B] p-1 z-30">
                    {[
                      { id: 'public', label: 'Public', icon: Globe },
                      { id: 'friends', label: 'Friends', icon: Users },
                      { id: 'only_me', label: 'Only me', icon: Lock },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setPrivacy(item.id as any);
                          setShowPrivacyMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] text-xs font-semibold text-[#050505] dark:text-[#E4E6EB] text-left cursor-pointer"
                      >
                        <item.icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Text input area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
            className="w-full text-base sm:text-lg bg-transparent text-[#050505] dark:text-[#E4E6EB] placeholder-[#65676B] dark:placeholder-[#B0B3B8] resize-none focus:outline-none min-h-[110px]"
            autoFocus
          />

          {/* Photo attachment preview */}
          {mediaUrl && (
            <div className="relative rounded-xl overflow-hidden border border-[#E4E6EB] dark:border-[#393A3B] group">
              <img
                src={mediaUrl}
                alt="Upload preview"
                className="w-full max-h-72 object-cover"
              />
              <button
                type="button"
                onClick={() => setMediaUrl(null)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 dark:bg-black/80 hover:bg-white text-black dark:text-white flex items-center justify-center shadow-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Photo picker gallery options */}
          {showPhotoPicker && !mediaUrl && (
            <div className="p-3 border border-dashed border-[#CED0D4] dark:border-[#393A3B] rounded-xl bg-[#F0F2F5]/50 dark:bg-[#3A3B3C]/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#050505] dark:text-[#E4E6EB]">
                  Choose photo or pick high-res sample:
                </span>
                <label className="cursor-pointer text-xs font-semibold text-[#0866FF] hover:underline flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_PHOTOS.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Preset"
                    onClick={() => {
                      setMediaUrl(src);
                      setShowPhotoPicker(false);
                    }}
                    className="h-20 w-full object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-transparent hover:border-[#0866FF]"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Feeling / Activity picker */}
          {showFeelingPicker && (
            <div className="p-3 border border-[#CED0D4] dark:border-[#393A3B] rounded-xl bg-[#F0F2F5]/50 dark:bg-[#3A3B3C]/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#050505] dark:text-[#E4E6EB]">
                  How are you feeling?
                </span>
                {feeling && (
                  <button
                    onClick={() => setFeeling(null)}
                    className="text-xs text-[#E41E3F] hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto fb-scrollbar">
                {FEELINGS_LIST.map((f, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setFeeling(f);
                      setShowFeelingPicker(false);
                    }}
                    className={`flex items-center gap-1.5 p-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                      feeling?.text === f.text
                        ? 'bg-[#0866FF] text-white'
                        : 'bg-white dark:bg-[#242526] hover:bg-[#E4E6EB] text-[#050505] dark:text-[#E4E6EB]'
                    }`}
                  >
                    <span>{f.emoji}</span>
                    <span className="truncate">{f.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* "Add to your post" toolbar */}
          <div className="flex items-center justify-between p-3 border border-[#CED0D4] dark:border-[#393A3B] rounded-xl shadow-xs">
            <span className="text-sm font-semibold text-[#050505] dark:text-[#E4E6EB]">
              Add to your post
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowPhotoPicker(!showPhotoPicker)}
                className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] flex items-center justify-center text-[#45BD62] transition-colors cursor-pointer"
                title="Photo/video"
              >
                <Image className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={() => setShowFeelingPicker(!showFeelingPicker)}
                className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] flex items-center justify-center text-[#F7B125] transition-colors cursor-pointer"
                title="Feeling/activity"
              >
                <Smile className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={() => {}}
                className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] flex items-center justify-center text-[#1877F2] transition-colors cursor-pointer"
                title="Tag people"
              >
                <UserCheck className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={() => {}}
                className="w-9 h-9 rounded-full hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] flex items-center justify-center text-[#FA383E] transition-colors cursor-pointer"
                title="Check in"
              >
                <MapPin className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER - POST BUTTON */}
        <div className="p-4 border-t border-[#E4E6EB] dark:border-[#393A3B]">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!content.trim() && !mediaUrl}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center ${
              content.trim() || mediaUrl
                ? 'bg-[#0866FF] hover:bg-[#1877F2] text-white shadow-sm'
                : 'bg-[#E4E6EB] dark:bg-[#3A3B3C] text-[#BCC0C4] dark:text-[#65676B] cursor-not-allowed'
            }`}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export const CreatePostCard: React.FC<{
  currentUser: User | null;
  onOpenModal: (feeling?: { emoji: string; text: string }, photoPrompt?: boolean) => void;
  onOpenAuth?: () => void;
}> = ({ currentUser, onOpenModal, onOpenAuth }) => {
  const handleClick = (action?: () => void) => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (action) action();
    else onOpenModal();
  };

  return (
    <div className="bg-white dark:bg-[#242526] rounded-xl shadow-xs border border-[#E4E6EB] dark:border-[#393A3B] p-3.5 mb-4 select-none">
      {/* Top row: Avatar + Search-like button */}
      <div className="flex items-center gap-2.5">
        {currentUser ? (
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#E4E6EB] dark:bg-[#3A3B3C] flex items-center justify-center text-[#65676B] dark:text-[#B0B3B8] flex-shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
        )}
        <button
          onClick={() => handleClick()}
          className="flex-1 bg-[#F0F2F5] dark:bg-[#3A3B3C] hover:bg-[#E4E6EB] dark:hover:bg-[#4E4F50] text-[#65676B] dark:text-[#B0B3B8] rounded-full px-4 py-2.5 text-left text-sm font-normal cursor-pointer transition-colors"
        >
          {currentUser
            ? `What's on your mind, ${currentUser.name.split(' ')[0]}?`
            : "What's on your mind? (Sign in to publish)"}
        </button>
      </div>

      <div className="border-t border-[#CED0D4] dark:border-[#393A3B] my-3" />

      {/* Bottom row: 3 iconic action buttons */}
      <div className="flex items-center justify-between">
        {/* Live video */}
        <button
          onClick={() => handleClick()}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] transition-colors cursor-pointer text-[#65676B] dark:text-[#B0B3B8] font-semibold text-sm"
        >
          <Camera className="w-6 h-6 text-[#FA383E]" />
          <span className="hidden sm:inline">Live video</span>
        </button>

        {/* Photo/video */}
        <button
          onClick={() => handleClick(() => onOpenModal(undefined, true))}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] transition-colors cursor-pointer text-[#65676B] dark:text-[#B0B3B8] font-semibold text-sm"
        >
          <Image className="w-6 h-6 text-[#45BD62]" />
          <span className="hidden sm:inline">Photo/video</span>
        </button>

        {/* Feeling/activity */}
        <button
          onClick={() =>
            handleClick(() => onOpenModal({ emoji: '😊', text: 'happy' }, false))
          }
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] transition-colors cursor-pointer text-[#65676B] dark:text-[#B0B3B8] font-semibold text-sm"
        >
          <Smile className="w-6 h-6 text-[#F7B125]" />
          <span className="hidden sm:inline">Feeling/activity</span>
        </button>
      </div>
    </div>
  );
};
