import React, { useState, useRef } from 'react';
import {
  MoreHorizontal,
  Globe,
  Users,
  Lock,
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  Link2,
  EyeOff,
  Smile,
  Send,
  Check,
  Heart,
  Trash2,
} from 'lucide-react';
import { Post, User, ReactionType, Comment } from '../types';

interface PostCardProps {
  post: Post;
  currentUser: User | null;
  onUpdatePost: (updatedPost: Post) => void;
  onOpenImage?: (url: string) => void;
  onOpenAuth?: () => void;
  onDeletePost?: (postId: string) => void;
}

const REACTIONS_CONFIG: Record<
  ReactionType,
  { label: string; emoji: string; color: string; bg: string }
> = {
  like: { label: 'Like', emoji: '👍', color: 'text-[#0866FF]', bg: 'bg-[#0866FF]' },
  love: { label: 'Love', emoji: '❤️', color: 'text-[#FA383E]', bg: 'bg-[#FA383E]' },
  care: { label: 'Care', emoji: '🥰', color: 'text-[#F7B125]', bg: 'bg-[#F7B125]' },
  haha: { label: 'Haha', emoji: '😆', color: 'text-[#F7B125]', bg: 'bg-[#F7B125]' },
  wow: { label: 'Wow', emoji: '😮', color: 'text-[#F7B125]', bg: 'bg-[#F7B125]' },
  sad: { label: 'Sad', emoji: '😢', color: 'text-[#F7B125]', bg: 'bg-[#F7B125]' },
  angry: { label: 'Angry', emoji: '😡', color: 'text-[#E41E3F]', bg: 'bg-[#E41E3F]' },
};

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onUpdatePost,
  onOpenImage,
  onOpenAuth,
  onDeletePost,
}) => {
  const [showReactionsBar, setShowReactionsBar] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [commentInput, setCommentInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [shareNotice, setShareNotice] = useState(false);

  const commentInputRef = useRef<HTMLInputElement>(null);
  const reactionsTimerRef = useRef<any>(null);

  const handleMouseEnterLike = () => {
    reactionsTimerRef.current = setTimeout(() => {
      setShowReactionsBar(true);
    }, 250);
  };

  const handleMouseLeaveLike = () => {
    if (reactionsTimerRef.current) clearTimeout(reactionsTimerRef.current);
    setShowReactionsBar(false);
  };

  const handleSelectReaction = (reaction: ReactionType) => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    const prevReaction = post.userReaction;
    const newCounts = { ...post.reactionCounts };

    if (prevReaction === reaction) {
      // Toggle off
      newCounts[reaction] = Math.max(0, newCounts[reaction] - 1);
      onUpdatePost({
        ...post,
        userReaction: null,
        likesCount: Math.max(0, post.likesCount - 1),
        reactionCounts: newCounts,
      });
    } else {
      // If switching from another reaction
      if (prevReaction) {
        newCounts[prevReaction] = Math.max(0, newCounts[prevReaction] - 1);
      }
      newCounts[reaction] = (newCounts[reaction] || 0) + 1;

      onUpdatePost({
        ...post,
        userReaction: reaction,
        likesCount: prevReaction ? post.likesCount : post.likesCount + 1,
        reactionCounts: newCounts,
      });
    }
    setShowReactionsBar(false);
  };

  const handleDirectLikeClick = () => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (post.userReaction) {
      // Remove reaction
      const currentReaction = post.userReaction;
      const newCounts = { ...post.reactionCounts };
      newCounts[currentReaction] = Math.max(0, newCounts[currentReaction] - 1);
      onUpdatePost({
        ...post,
        userReaction: null,
        likesCount: Math.max(0, post.likesCount - 1),
        reactionCounts: newCounts,
      });
    } else {
      // Add default like
      handleSelectReaction('like');
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (!commentInput.trim()) return;

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      author: currentUser.name,
      avatar: currentUser.avatar,
      text: commentInput.trim(),
      timestamp: 'Just now',
      likes: 0,
      hasLiked: false,
    };

    onUpdatePost({
      ...post,
      comments: [...post.comments, newComment],
    });
    setCommentInput('');
  };

  const handleLikeComment = (commentId: string) => {
    const updated = post.comments.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          hasLiked: !c.hasLiked,
          likes: c.hasLiked ? c.likes - 1 : c.likes + 1,
        };
      }
      return c;
    });
    onUpdatePost({ ...post, comments: updated });
  };

  const handleShareClick = () => {
    onUpdatePost({ ...post, sharesCount: post.sharesCount + 1 });
    setShareNotice(true);
    setTimeout(() => setShareNotice(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
      setShowMenu(false);
    }, 1500);
  };

  return (
    <article className="bg-white dark:bg-[#242526] rounded-xl shadow-xs border border-[#E4E6EB] dark:border-[#393A3B] mb-4 overflow-hidden select-none transition-colors">
      {/* POST HEADER */}
      <div className="p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-95"
          />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-sm text-[#050505] dark:text-[#E4E6EB] hover:underline cursor-pointer">
                {post.author.name}
              </span>
              {post.feeling && (
                <span className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
                  is {post.feeling.emoji} feeling{' '}
                  <strong className="text-[#050505] dark:text-[#E4E6EB] font-semibold">
                    {post.feeling.text}
                  </strong>
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#65676B] dark:text-[#B0B3B8]">
              <span>{post.timestamp}</span>
              <span>·</span>
              {post.privacy === 'public' && <Globe className="w-3 h-3" />}
              {post.privacy === 'friends' && <Users className="w-3 h-3" />}
              {post.privacy === 'only_me' && <Lock className="w-3 h-3" />}
            </div>
          </div>
        </div>

        {/* Post Options Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-full hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] text-[#65676B] dark:text-[#B0B3B8] flex items-center justify-center transition-colors cursor-pointer"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-9 w-52 bg-white dark:bg-[#242526] rounded-xl shadow-xl border border-[#E4E6EB] dark:border-[#393A3B] p-1.5 z-30">
              <button
                onClick={() => {
                  setIsSaved(!isSaved);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] text-xs font-semibold text-[#050505] dark:text-[#E4E6EB] cursor-pointer"
              >
                <Bookmark className="w-4 h-4 text-[#0866FF]" />
                <span>{isSaved ? 'Unsave post' : 'Save post'}</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] text-xs font-semibold text-[#050505] dark:text-[#E4E6EB] cursor-pointer"
              >
                {isCopied ? (
                  <Check className="w-4 h-4 text-[#31A24C]" />
                ) : (
                  <Link2 className="w-4 h-4" />
                )}
                <span>{isCopied ? 'Link copied!' : 'Copy link'}</span>
              </button>
              <button
                onClick={() => setShowMenu(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] text-xs font-semibold text-[#050505] dark:text-[#E4E6EB] cursor-pointer"
              >
                <EyeOff className="w-4 h-4" />
                <span>Hide post</span>
              </button>

              {(currentUser?.role === 'admin' || currentUser?.id === post.author.id) && onDeletePost && (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDeletePost(post.id);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-500/10 text-xs font-semibold text-red-600 dark:text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{currentUser?.role === 'admin' ? 'Delete post (Admin)' : 'Delete post'}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* POST TEXT CONTENT */}
      {post.text && (
        <div className="px-3.5 pb-3">
          <p className="text-sm sm:text-base text-[#050505] dark:text-[#E4E6EB] leading-relaxed whitespace-pre-line">
            {post.text}
          </p>
        </div>
      )}

      {/* POST MEDIA ATTACHMENT */}
      {post.mediaUrl && (
        <div
          onClick={() => onOpenImage && onOpenImage(post.mediaUrl!)}
          className="relative bg-black/5 dark:bg-black/20 cursor-pointer overflow-hidden max-h-[560px] flex items-center justify-center group"
        >
          <img
            src={post.mediaUrl}
            alt="Post content"
            className="w-full h-auto object-cover max-h-[560px] transition-transform duration-300 group-hover:scale-[1.01]"
          />
        </div>
      )}

      {/* POST METRICS (REACTIONS & COUNTS) */}
      <div className="px-3.5 py-2.5 flex items-center justify-between text-xs text-[#65676B] dark:text-[#B0B3B8] border-b border-[#CED0D4] dark:border-[#393A3B]">
        {/* Left: Reaction Icons Stack & Count */}
        <div className="flex items-center gap-1.5 cursor-pointer hover:underline">
          <div className="flex -space-x-1 items-center">
            <span className="w-4.5 h-4.5 rounded-full bg-[#0866FF] text-white text-[11px] flex items-center justify-center ring-2 ring-white dark:ring-[#242526]">
              👍
            </span>
            <span className="w-4.5 h-4.5 rounded-full bg-[#FA383E] text-white text-[11px] flex items-center justify-center ring-2 ring-white dark:ring-[#242526]">
              ❤️
            </span>
            <span className="w-4.5 h-4.5 rounded-full bg-[#F7B125] text-white text-[11px] flex items-center justify-center ring-2 ring-white dark:ring-[#242526]">
              🥰
            </span>
          </div>
          <span className="font-medium">{post.likesCount}</span>
        </div>

        {/* Right: Comments & Shares count */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:underline cursor-pointer"
          >
            {post.comments.length} comments
          </button>
          <span>·</span>
          <span className="hover:underline cursor-pointer">{post.sharesCount} shares</span>
        </div>
      </div>

      {/* SHARE NOTIFICATION TOAST */}
      {shareNotice && (
        <div className="bg-[#E7F3FF] dark:bg-[#263951] text-[#0866FF] px-3 py-1.5 text-xs font-semibold text-center animate-fade-in">
          Shared successfully to your feed!
        </div>
      )}

      {/* ACTION BUTTONS ROW (LIKE, COMMENT, SHARE) */}
      <div className="px-2 py-1 flex items-center justify-between relative border-b border-[#CED0D4] dark:border-[#393A3B]">
        {/* FLOATING ANIMATED REACTIONS PICKER */}
        {showReactionsBar && (
          <div
            onMouseEnter={() => setShowReactionsBar(true)}
            onMouseLeave={handleMouseLeaveLike}
            className="absolute bottom-11 left-2 bg-white dark:bg-[#242526] rounded-full shadow-2xl border border-[#E4E6EB] dark:border-[#393A3B] px-3 py-2 flex items-center gap-2 z-40 animate-in fade-in zoom-in-95 duration-150"
          >
            {(
              [
                'like',
                'love',
                'care',
                'haha',
                'wow',
                'sad',
                'angry',
              ] as ReactionType[]
            ).map((rx) => {
              const cfg = REACTIONS_CONFIG[rx];
              return (
                <button
                  key={rx}
                  onClick={() => handleSelectReaction(rx)}
                  className="w-10 h-10 flex items-center justify-center text-2xl hover:scale-135 transition-transform duration-150 cursor-pointer group"
                  title={cfg.label}
                >
                  <span className="group-hover:-translate-y-1 transition-transform">
                    {cfg.emoji}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* LIKE BUTTON */}
        <div
          className="flex-1"
          onMouseEnter={handleMouseEnterLike}
          onMouseLeave={handleMouseLeaveLike}
        >
          <button
            onClick={handleDirectLikeClick}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] font-semibold text-sm transition-colors cursor-pointer ${
              post.userReaction
                ? REACTIONS_CONFIG[post.userReaction].color
                : 'text-[#65676B] dark:text-[#B0B3B8]'
            }`}
          >
            {post.userReaction ? (
              <span className="text-lg">
                {REACTIONS_CONFIG[post.userReaction].emoji}
              </span>
            ) : (
              <ThumbsUp className="w-5 h-5" />
            )}
            <span>
              {post.userReaction
                ? REACTIONS_CONFIG[post.userReaction].label
                : 'Like'}
            </span>
          </button>
        </div>

        {/* COMMENT BUTTON */}
        <button
          onClick={() => {
            setShowComments(true);
            setTimeout(() => commentInputRef.current?.focus(), 50);
          }}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] text-[#65676B] dark:text-[#B0B3B8] font-semibold text-sm transition-colors cursor-pointer"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Comment</span>
        </button>

        {/* SHARE BUTTON */}
        <button
          onClick={handleShareClick}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] text-[#65676B] dark:text-[#B0B3B8] font-semibold text-sm transition-colors cursor-pointer"
        >
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>

      {/* COMMENTS SECTION */}
      {showComments && (
        <div className="p-3.5 space-y-3 bg-white dark:bg-[#242526]">
          {/* List of comments */}
          {post.comments.length > 0 && (
            <div className="space-y-2.5">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2.5 group">
                  <img
                    src={comment.avatar}
                    alt={comment.author}
                    className="w-8 h-8 rounded-full object-cover mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-2xl px-3 py-2 inline-block max-w-[95%]">
                      <p className="text-xs font-semibold text-[#050505] dark:text-[#E4E6EB] hover:underline cursor-pointer">
                        {comment.author}
                      </p>
                      <p className="text-xs sm:text-sm text-[#050505] dark:text-[#E4E6EB] whitespace-pre-wrap mt-0.5">
                        {comment.text}
                      </p>
                    </div>

                    {/* Comment sub-actions */}
                    <div className="flex items-center gap-3 text-[11px] text-[#65676B] dark:text-[#B0B3B8] mt-1 ml-2 font-medium">
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className={`hover:underline cursor-pointer ${
                          comment.hasLiked ? 'text-[#0866FF] font-bold' : ''
                        }`}
                      >
                        Like
                      </button>
                      <button className="hover:underline cursor-pointer">
                        Reply
                      </button>
                      <span>{comment.timestamp}</span>
                      {comment.likes > 0 && (
                        <span className="flex items-center gap-0.5 text-[#65676B] dark:text-[#B0B3B8]">
                          <span className="w-3.5 h-3.5 rounded-full bg-[#0866FF] text-white text-[9px] flex items-center justify-center">
                            👍
                          </span>
                          {comment.likes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment composer */}
          <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-1">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div
                onClick={() => onOpenAuth && onOpenAuth()}
                className="w-8 h-8 rounded-full bg-[#E4E6EB] dark:bg-[#3A3B3C] flex items-center justify-center text-[#65676B] dark:text-[#B0B3B8] flex-shrink-0 cursor-pointer"
              >
                <Users className="w-4 h-4" />
              </div>
            )}
            <div className="flex-1 flex items-center bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-full px-3 py-1.5 border border-transparent focus-within:border-[#CED0D4] dark:focus-within:border-[#4E4F50]">
              <input
                ref={commentInputRef}
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder={currentUser ? "Write a comment..." : "Write a comment (Log in to reply)..."}
                className="w-full text-xs sm:text-sm bg-transparent text-[#050505] dark:text-[#E4E6EB] placeholder-[#65676B] dark:placeholder-[#B0B3B8] focus:outline-none"
              />
              <div className="flex items-center gap-1.5 ml-2 text-[#65676B] dark:text-[#B0B3B8]">
                <button
                  type="button"
                  onClick={() => setCommentInput((prev) => prev + ' 😊')}
                  className="hover:text-[#050505] dark:hover:text-[#E4E6EB] cursor-pointer"
                  title="Insert emoji"
                >
                  <Smile className="w-4 h-4" />
                </button>
                {commentInput.trim() && (
                  <button
                    type="submit"
                    className="text-[#0866FF] hover:scale-110 transition-transform cursor-pointer"
                    title="Send comment"
                  >
                    <Send className="w-4 h-4 fill-[#0866FF]" />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      )}
    </article>
  );
};
