/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { StoriesRail } from './components/StoriesRail';
import { CreatePostCard, CreatePostModal } from './components/CreatePostModal';
import { PostCard } from './components/PostCard';
import { StoryViewerModal } from './components/StoryViewerModal';
import { MessengerDock } from './components/MessengerDock';
import { WatchTab, MarketplaceTab } from './components/TabsViews';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';
import { Logo } from './components/Logo';
import {
  DEFAULT_USER,
  CONTACTS_DATA,
  STORIES_DATA,
  INITIAL_POSTS,
  INITIAL_CHAT_MESSAGES,
} from './data/mockData';
import { Post, Story, User, ActiveChat, ChatMessage } from './types';
import { realtime, FullChatMessage } from './services/realtime';
import { generateInitialsAvatar } from './utils/avatar';
import { X, Sparkles, Send, Plus, Users2, ShieldCheck, Link2, Check, Search } from 'lucide-react';

export default function App() {
  // Dark mode state with localStorage persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('socialbook_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark class to root HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('socialbook_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('socialbook_theme', 'light');
    }
  }, [darkMode]);

  // User state: starts completely empty (no demo user), checks localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('science_mssn_user');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch {
          return null;
        }
      }
    }
    return DEFAULT_USER; // null
  });

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Admin panel modal state
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Copy link feedback toast
  const [copyToast, setCopyToast] = useState(false);

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-kphjjsm24m4cqiystipjr3-575054989452.us-east1.run.app';
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 3000);
    }
  };

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    'home' | 'watch' | 'marketplace' | 'groups' | 'gaming'
  >('home');

  // Real-time synced posts, stories, and online contacts
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<Story[]>(STORIES_DATA);
  const [contacts, setContacts] = useState<User[]>(CONTACTS_DATA);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [feedSearchQuery, setFeedSearchQuery] = useState('');
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  // Sync user state with localStorage in case of tab-to-tab changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'science_mssn_user') {
        if (e.newValue) {
          try {
            setCurrentUser(JSON.parse(e.newValue));
          } catch {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Load all registered users from server
  useEffect(() => {
    const fetchData = () => {
      fetch('/api/users')
        .then((res) => res.json())
        .then((data) => {
          if (data.users && Array.isArray(data.users)) {
            setAllUsers(data.users);
            const others = data.users.filter((u: User) => u.id !== currentUser?.id);
            setContacts(others);
          }
        })
        .catch((err) => console.error('Error fetching registered users:', err));
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); // Poll every 2 seconds silently
    return () => clearInterval(interval);
  }, [currentUser]);

  // Create post modal state
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [createPostFeeling, setCreatePostFeeling] = useState<
    { emoji: string; text: string } | undefined
  >(undefined);
  const [createPostPhotoPrompt, setCreatePostPhotoPrompt] = useState(false);

  // Image Lightbox state
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);

  // Active docked chats: starts completely empty
  const [activeChats, setActiveChats] = useState<ActiveChat[]>([]);

  // Update realtime client when user changes
  useEffect(() => {
    realtime.setCurrentUser(currentUser);
  }, [currentUser]);

  // Subscribe to real-time events from server & peers
  useEffect(() => {
    const unsubState = realtime.on('sync:state', (payload) => {
      if (payload.data) {
        if (Array.isArray(payload.data.posts)) {
          setPosts((prev) => {
            const map = new Map(prev.map((p) => [p.id, p]));
            payload.data.posts.forEach((p: Post) => {
              if (!map.has(p.id)) map.set(p.id, p);
            });
            return Array.from(map.values());
          });
        }
        if (Array.isArray(payload.data.stories) && payload.data.stories.length > 0) {
          setStories(payload.data.stories);
        }
        if (Array.isArray(payload.data.allUsers)) {
          setAllUsers(payload.data.allUsers);
          const others = payload.data.allUsers.filter(
            (u: User) => u.id !== currentUser?.id
          );
          setContacts(others);
        } else if (Array.isArray(payload.data.onlineUsers)) {
          const others = payload.data.onlineUsers.filter(
            (u: User) => u.id !== currentUser?.id
          );
          setContacts(others);
        }
      }
    });

    const unsubUsers = realtime.on('users:update', (payload) => {
      if (Array.isArray(payload.users)) {
        setAllUsers(payload.users);
        const others = payload.users.filter((u: User) => u.id !== currentUser?.id);
        setContacts(others);
      }
    });

    const unsubPostCreated = realtime.on('post:created', (payload) => {
      if (payload.post) {
        setPosts((prev) => {
          if (prev.some((p) => p.id === payload.post.id)) return prev;
          return [payload.post, ...prev];
        });
      }
    });

    const unsubPostUpdated = realtime.on('post:updated', (payload) => {
      if (payload.post) {
        setPosts((prev) =>
          prev.map((p) => (p.id === payload.post.id ? payload.post : p))
        );
      }
    });

    const unsubStoryCreated = realtime.on('story:created', (payload) => {
      if (payload.story) {
        setStories((prev) => {
          if (prev.some((s) => s.id === payload.story.id)) return prev;
          return [payload.story, ...prev];
        });
      }
    });

    const unsubChatMessage = realtime.on('chat:message', (payload) => {
      const msg: FullChatMessage = payload.message;
      if (!msg) return;

      // Handle message if current user is recipient or sender
      if (msg.recipientId === currentUser?.id || msg.senderId === currentUser?.id) {
        const partnerId = msg.senderId === currentUser?.id ? msg.recipientId : msg.senderId;

        setActiveChats((prev) => {
          const existing = prev.find((c) => c.contact.id === partnerId);
          if (existing) {
            if (existing.messages.some((m) => m.id === msg.id)) return prev;
            return prev.map((c) =>
              c.contact.id === partnerId
                ? {
                    ...c,
                    messages: [...c.messages, msg],
                    isMinimized: false, // Auto-expand when receiving incoming message!
                  }
                : c
            );
          } else {
            // Find partner info from contacts
            const partnerUser: User = contacts.find((u) => u.id === partnerId) || {
              id: partnerId,
              name: `Crew Member`,
              avatar: generateInitialsAvatar('Crew Member'),
              isOnline: true,
              statusText: 'Active now',
            };
            const newChat: ActiveChat = {
              contact: partnerUser,
              messages: [msg],
              isMinimized: false,
            };
            return [...prev, newChat];
          }
        });
      }
    });

    return () => {
      unsubState();
      unsubUsers();
      unsubPostCreated();
      unsubPostUpdated();
      unsubStoryCreated();
      unsubChatMessage();
    };
  }, [currentUser, contacts]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    realtime.announceOnline(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('science_mssn_user', JSON.stringify(user));
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      realtime.announceOffline(currentUser.id);
    }
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('science_mssn_user');
    }
  };

  // Open / bring forward a contact in messenger dock
  const handleOpenChat = (contact: User) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    setActiveChats((prev) => {
      const existing = prev.find((c) => c.contact.id === contact.id);
      if (existing) {
        return prev.map((c) =>
          c.contact.id === contact.id ? { ...c, isMinimized: false } : c
        );
      }
      const initialMsgs: ChatMessage[] = INITIAL_CHAT_MESSAGES[contact.id] || [];
      const newChat: ActiveChat = {
        contact,
        messages: initialMsgs,
        isMinimized: false,
      };
      if (prev.length >= 2) {
        return [prev[1], newChat];
      }
      return [...prev, newChat];
    });
  };

  const handleCloseChat = (userId: string) => {
    setActiveChats((prev) => prev.filter((c) => c.contact.id !== userId));
  };

  const handleToggleMinimize = (userId: string) => {
    setActiveChats((prev) =>
      prev.map((c) =>
        c.contact.id === userId ? { ...c, isMinimized: !c.isMinimized } : c
      )
    );
  };

  // Real-time message dispatch to recipient
  const handleSendMessage = (userId: string, text: string, isThumb?: boolean) => {
    if (!currentUser) return;

    const newMsg: FullChatMessage = {
      id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId: currentUser.id,
      recipientId: userId,
      text,
      timestamp: 'Just now',
      isThumb,
    };

    // Optimistically update local active chat
    setActiveChats((prev) =>
      prev.map((c) =>
        c.contact.id === userId
          ? { ...c, messages: [...c.messages, newMsg] }
          : c
      )
    );

    // Broadcast live over WebSocket & channel to the user at the other end
    realtime.sendChatMessage(newMsg);
  };

  const handleAddPost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
    realtime.createPost(newPost);
  };

  const handleUpdatePost = (updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
    realtime.updatePost(updatedPost);
  };

  const handleDeletePost = async (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    realtime.deletePost(postId);
    try {
      await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete post on server:', err);
    }
  };

  const handleBroadcastAnnouncement = (text: string) => {
    if (!currentUser) return;
    const adminPost: Post = {
      id: `post_announcement_${Date.now()}`,
      author: currentUser,
      timestamp: 'Just now',
      privacy: 'public',
      text: `📢 [OFFICIAL FORUM ANNOUNCEMENT]\n\n${text}`,
      likesCount: 1,
      userReaction: 'love',
      reactionCounts: { like: 0, love: 1, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
      comments: [],
      sharesCount: 0,
    };
    handleAddPost(adminPost);
  };

  const handleOpenCreatePost = (
    feeling?: { emoji: string; text: string },
    photoPrompt?: boolean
  ) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setCreatePostFeeling(feeling);
    setCreatePostPhotoPrompt(Boolean(photoPrompt));
    setIsCreatePostOpen(true);
  };

  const handleCreateUserStory = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const userStory: Story = {
      id: `story_user_${Date.now()}`,
      user: currentUser,
      mediaUrl: currentUser.avatar,
      timestamp: 'Just now',
      caption: 'Mission telemetry check online. 🚀✨',
      isViewed: false,
    };
    setStories((prev) => [userStory, ...prev]);
    realtime.createStory(userStory);
    setSelectedStoryId(userStory.id);
  };

  // Filter feed posts if a search query is active
  const displayedPosts = posts.filter((post) => {
    if (!feedSearchQuery.trim()) return true;
    const q = feedSearchQuery.trim().toLowerCase();
    const authorNameMatch = post.author?.name?.toLowerCase().includes(q);
    const authorEmailMatch = post.author?.email ? post.author.email.toLowerCase().includes(q) : false;
    const textMatch = post.text ? post.text.toLowerCase().includes(q) : false;
    return authorNameMatch || authorEmailMatch || textMatch;
  });

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#18191A] text-[#050505] dark:text-[#E4E6EB] transition-colors duration-200">
      {/* TOP NAVIGATION BAR */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenChat={handleOpenChat}
        contacts={contacts}
        allUsers={allUsers}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenAdmin={() => setIsAdminPanelOpen(true)}
        onCopyLink={handleCopyLink}
        onFilterPostsByAuthor={(query) => setFeedSearchQuery(query)}
      />

      {/* MAIN 3-COLUMN DESKTOP LAYOUT */}
      <div className="flex justify-between w-full max-w-[1920px] mx-auto">
        {/* LEFT SIDEBAR */}
        <LeftSidebar
          currentUser={currentUser}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenAdmin={() => setIsAdminPanelOpen(true)}
          onCopyLink={handleCopyLink}
        />

        {/* CENTER CONTENT FEED */}
        <main className="flex-1 max-w-[700px] w-full mx-auto px-2 sm:px-4 py-4 min-h-[calc(100vh-56px)]">
          {activeTab === 'home' && (
            <>
              {/* Horizontal Stories Rail */}
              <StoriesRail
                stories={stories}
                currentUser={currentUser}
                onOpenStory={(story) => setSelectedStoryId(story.id)}
                onCreateStory={handleCreateUserStory}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />

              {/* Status Composer Card */}
              <CreatePostCard
                currentUser={currentUser}
                onOpenModal={handleOpenCreatePost}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />

              {/* Active Search Filter Banner */}
              {feedSearchQuery && (
                <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2 text-xs text-[#0866FF] dark:text-[#4599FF] font-medium">
                    <Search className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Showing posts matching <strong>"{feedSearchQuery}"</strong> ({displayedPosts.length} post{displayedPosts.length === 1 ? '' : 's'})
                    </span>
                  </div>
                  <button
                    onClick={() => setFeedSearchQuery('')}
                    className="text-xs text-[#65676B] dark:text-[#B0B3B8] hover:text-[#050505] dark:hover:text-[#E4E6EB] font-bold underline cursor-pointer"
                  >
                    Clear filter
                  </button>
                </div>
              )}

              {/* News Feed Posts or Clean Empty Feed State */}
              {displayedPosts.length > 0 ? (
                <div className="space-y-4">
                  {displayedPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUser={currentUser}
                      onUpdatePost={handleUpdatePost}
                      onOpenImage={(url) => setLightboxImageUrl(url)}
                      onOpenAuth={() => setIsAuthModalOpen(true)}
                      onDeletePost={handleDeletePost}
                    />
                  ))}
                </div>
              ) : (
                /* EMPTY FEED STATE */
                <div className="bg-white dark:bg-[#242526] rounded-xl shadow-xs border border-[#E4E6EB] dark:border-[#393A3B] p-8 text-center select-none">
                  <div className="flex justify-center mb-4">
                    <Logo size="lg" showText={false} />
                  </div>
                  <h3 className="text-xl font-bold text-[#050505] dark:text-[#E4E6EB]">
                    {feedSearchQuery
                      ? `No Posts Matching "${feedSearchQuery}"`
                      : 'Welcome to SCIENCE MSSN 2K27'}
                  </h3>
                  <p className="text-sm text-[#65676B] dark:text-[#B0B3B8] mt-2 max-w-md mx-auto leading-relaxed">
                    {feedSearchQuery
                      ? 'No dispatches or mission posts by this member or topic were found. You can clear the search filter or publish a new post.'
                      : 'No posts or dispatches have been published yet. Share a research update, mission telemetry, or photo to start the feed.'}
                  </p>
                  <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
                    {feedSearchQuery ? (
                      <button
                        onClick={() => setFeedSearchQuery('')}
                        className="bg-[#0866FF] hover:bg-[#1877F2] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer shadow-xs"
                      >
                        Clear Search Filter
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenCreatePost()}
                        className="bg-[#0866FF] hover:bg-[#1877F2] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{currentUser ? 'Create First Post' : 'Log In & Post'}</span>
                      </button>
                    )}
                    <button
                      onClick={handleCopyLink}
                      className="bg-[#E4E6EB] dark:bg-[#3A3B3C] hover:bg-[#D8DADF] dark:hover:bg-[#4E4F50] text-[#050505] dark:text-[#E4E6EB] text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <Link2 className="w-4 h-4 text-[#0866FF]" />
                      <span>Copy Shareable Link</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'watch' && <WatchTab currentUser={currentUser} />}

          {activeTab === 'marketplace' && <MarketplaceTab />}

          {activeTab === 'groups' && (
            <div className="space-y-4 select-none">
              <div className="bg-white dark:bg-[#242526] p-4 rounded-xl shadow-xs border border-[#E4E6EB] dark:border-[#393A3B]">
                <h2 className="text-xl font-bold text-[#050505] dark:text-[#E4E6EB]">
                  Mission Groups
                </h2>
                <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
                  Collaborative research channels and mission squads
                </p>
              </div>
              <div className="p-8 bg-white dark:bg-[#242526] rounded-xl shadow-xs border border-[#E4E6EB] dark:border-[#393A3B] text-center">
                <Users2 className="w-10 h-10 text-[#0866FF] mx-auto mb-2 opacity-80" />
                <h4 className="text-base font-bold text-[#050505] dark:text-[#E4E6EB]">
                  No group dispatches yet
                </h4>
                <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-1 max-w-sm mx-auto">
                  Join mission squads or start a research circle to view group activity.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'gaming' && (
            <div className="bg-white dark:bg-[#242526] p-8 rounded-xl shadow-xs border border-[#E4E6EB] dark:border-[#393A3B] text-center select-none">
              <h2 className="text-2xl font-bold text-[#050505] dark:text-[#E4E6EB] mb-2">
                Mission Flight Simulator
              </h2>
              <p className="text-sm text-[#65676B] dark:text-[#B0B3B8] max-w-md mx-auto">
                Orbital trajectory simulation and telemetry analysis challenges.
              </p>
            </div>
          )}
        </main>

        {/* RIGHT SIDEBAR */}
        <RightSidebar
          contacts={contacts}
          onOpenChat={handleOpenChat}
          onCopyLink={handleCopyLink}
        />
      </div>

      {/* CREATE POST MODAL */}
      <CreatePostModal
        currentUser={currentUser}
        isOpen={isCreatePostOpen}
        onClose={() => {
          setIsCreatePostOpen(false);
          setCreatePostFeeling(undefined);
          setCreatePostPhotoPrompt(false);
        }}
        onAddPost={handleAddPost}
        defaultFeeling={createPostFeeling}
        defaultPhotoPrompt={createPostPhotoPrompt}
      />

      {/* STORY VIEWER MODAL */}
      <StoryViewerModal
        stories={stories}
        currentStoryId={selectedStoryId}
        onClose={() => setSelectedStoryId(null)}
        currentUser={currentUser}
      />

      {/* MESSENGER MINI WINDOWS DOCK */}
      <MessengerDock
        activeChats={activeChats}
        onCloseChat={handleCloseChat}
        onToggleMinimize={handleToggleMinimize}
        onSendMessage={handleSendMessage}
        currentUser={currentUser}
      />

      {/* AUTHENTICATION / JOIN PROFILE MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* FORUM ROOT ADMIN PANEL MODAL */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        posts={posts}
        onDeletePost={handleDeletePost}
        onBroadcastAnnouncement={handleBroadcastAnnouncement}
        currentUser={currentUser}
      />

      {/* FLOATING COPY LINK TOAST */}
      {copyToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#18191A] dark:bg-white text-white dark:text-[#18191A] px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-pulse border border-white/10 dark:border-black/10 select-none">
          <Check className="w-4 h-4 text-[#31A24C]" />
          <span>SCIENCE MSSN 2K27 Link copied to clipboard! Share with other users.</span>
        </div>
      )}

      {/* IMAGE LIGHTBOX MODAL */}
      {lightboxImageUrl && (
        <div
          onClick={() => setLightboxImageUrl(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out select-none"
        >
          <button
            onClick={() => setLightboxImageUrl(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImageUrl}
            alt="Full view"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
