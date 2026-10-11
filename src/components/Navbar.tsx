import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Home,
  Tv,
  Store,
  Users,
  Gamepad2,
  Menu as MenuIcon,
  MessageCircle,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
  MoonStar,
  Check,
  X,
  ArrowLeft,
  ExternalLink,
  Link2,
  Mail,
} from 'lucide-react';
import { Logo } from './Logo';
import { User, NotificationItem } from '../types';
import { NOTIFICATIONS_DATA } from '../data/mockData';
import { UserCircle, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeTab: 'home' | 'watch' | 'marketplace' | 'groups' | 'gaming';
  setActiveTab: (tab: 'home' | 'watch' | 'marketplace' | 'groups' | 'gaming') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenChat: (user: User) => void;
  contacts: User[];
  allUsers?: User[];
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAdmin?: () => void;
  onCopyLink?: () => void;
  onFilterPostsByAuthor?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  onOpenChat,
  contacts,
  allUsers,
  onOpenAuth,
  onLogout,
  onOpenAdmin,
  onCopyLink,
  onFilterPostsByAuthor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessenger, setShowMessenger] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS_DATA);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const messengerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (messengerRef.current && !messengerRef.current.contains(e.target as Node)) {
        setShowMessenger(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const markAllNotifsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Search people pool: prefer all registered members, fallback to contacts
  const searchPool = (allUsers && allUsers.length > 0 ? allUsers : contacts);
  const filteredContacts = searchPool.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    const nameMatch = c.name?.toLowerCase().includes(q);
    const emailMatch = c.email ? c.email.toLowerCase().includes(q) : false;
    return nameMatch || emailMatch;
  });

  // Handle Search Key (Enter) or Search Button Execution
  const handleExecuteSearch = (targetUser?: User) => {
    const userToOpen = targetUser || (filteredContacts.length > 0 ? filteredContacts[0] : null);
    if (userToOpen) {
      onOpenChat(userToOpen);
      if (onFilterPostsByAuthor && searchQuery.trim()) {
        onFilterPostsByAuthor(userToOpen.name);
      }
      setIsSearchFocused(false);
      setSearchQuery('');
    } else if (onFilterPostsByAuthor && searchQuery.trim()) {
      onFilterPostsByAuthor(searchQuery.trim());
      setIsSearchFocused(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 h-14 bg-white dark:bg-[#242526] border-b border-[#E4E6EB] dark:border-[#393A3B] px-3 sm:px-4 flex items-center justify-between shadow-xs select-none transition-colors duration-150">
      {/* LEFT: SCIENCE MSSN 2K27 Logo + Search Bar */}
      <div className="flex items-center gap-2 sm:gap-3 relative" ref={searchRef}>
        {/* SCIENCE MSSN 2K27 Logo */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex-shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0866FF] rounded-full p-0.5"
          title="SCIENCE MSSN 2K27 Home"
        >
          <Logo size="md" showText={true} />
        </button>

        {/* Search Wrapper */}
        <div className="relative">
          <div
            className={`flex items-center bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-full px-3 py-2 transition-all duration-200 ${
              isSearchFocused ? 'w-64 md:w-80 shadow-md ring-2 ring-[#0866FF]/30' : 'w-9 md:w-60'
            }`}
          >
            <button
              type="button"
              onClick={() => handleExecuteSearch()}
              className="text-[#65676B] dark:text-[#B0B3B8] hover:text-[#0866FF] transition-colors flex-shrink-0 cursor-pointer p-0.5 rounded-full"
              title="Search member by name or email (Press Enter)"
            >
              <Search className="w-4 h-4" />
            </button>
            <input
              type="text"
              placeholder="Search member name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleExecuteSearch();
                } else if (e.key === 'Escape') {
                  setIsSearchFocused(false);
                }
              }}
              className={`bg-transparent text-sm text-[#050505] dark:text-[#E4E6EB] placeholder-[#65676B] dark:placeholder-[#B0B3B8] focus:outline-none ml-2 w-full ${
                isSearchFocused ? 'block' : 'hidden md:block'
              }`}
            />
            {searchQuery && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleExecuteSearch()}
                  className="bg-[#0866FF] hover:bg-[#1877F2] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 cursor-pointer transition-colors shadow-xs"
                  title="Press Search / Enter key"
                >
                  Go ↵
                </button>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[#65676B] dark:text-[#B0B3B8] hover:text-[#050505] p-0.5 rounded-full cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Search Dropdown / Results */}
          {isSearchFocused && (
            <div className="absolute left-0 top-12 w-84 md:w-96 bg-white dark:bg-[#242526] rounded-xl shadow-xl border border-[#E4E6EB] dark:border-[#393A3B] p-2 z-50">
              <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-[#65676B] dark:text-[#B0B3B8]">
                <span>
                  {searchQuery
                    ? `PEOPLE & EMAILS (${filteredContacts.length} found)`
                    : 'QUICK MEMBER SEARCH'}
                </span>
                {searchQuery && filteredContacts.length > 0 && (
                  <span className="text-[10px] text-[#0866FF] dark:text-[#4599FF]">
                    Press Enter ↵ to open
                  </span>
                )}
              </div>

              {searchQuery ? (
                <div className="mt-1 space-y-1 max-h-72 overflow-y-auto fb-scrollbar">
                  {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => handleExecuteSearch(contact)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] cursor-pointer group transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative flex-shrink-0">
                            <img
                              src={contact.avatar}
                              alt={contact.name}
                              className="w-10 h-10 rounded-full object-cover border border-[#CED0D4] dark:border-[#393A3B]"
                            />
                            {contact.isOnline ? (
                              <span
                                className="absolute bottom-0 right-0 w-3 h-3 bg-[#31A24C] border-2 border-white dark:border-[#242526] rounded-full"
                                title="Active online now"
                              />
                            ) : (
                              <span
                                className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#8A8D91] border-2 border-white dark:border-[#242526] rounded-full"
                                title="Offline"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-sm font-semibold text-[#050505] dark:text-[#E4E6EB] truncate">
                                {contact.name}
                              </p>
                              {contact.role === 'admin' && (
                                <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-[#0866FF] dark:text-[#4599FF] font-bold px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                                  <ShieldCheck className="w-2.5 h-2.5" />
                                  Admin
                                </span>
                              )}
                            </div>
                            {contact.email && (
                              <p className="text-xs text-[#0866FF] dark:text-[#4599FF] font-mono flex items-center gap-1 truncate">
                                <Mail className="w-3 h-3 flex-shrink-0" />
                                {contact.email}
                              </p>
                            )}
                            <p className="text-[11px] text-[#65676B] dark:text-[#B0B3B8]">
                              {contact.isOnline ? 'Active online' : 'Member'} · {contact.mutualFriends || 12} mutual peers
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0 opacity-80 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExecuteSearch(contact);
                            }}
                            className="text-xs bg-[#0866FF] hover:bg-[#1877F2] text-white font-semibold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Chat
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-sm font-semibold text-[#050505] dark:text-[#E4E6EB]">
                        No members found
                      </p>
                      <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-1">
                        No user account matching name or email "{searchQuery}"
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-1 space-y-1">
                  {searchPool.slice(0, 4).map((member) => (
                    <div
                      key={member.id}
                      onClick={() => handleExecuteSearch(member)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#050505] dark:text-[#E4E6EB] truncate">
                            {member.name}
                          </p>
                          {member.email && (
                            <p className="text-[10px] text-[#65676B] dark:text-[#B0B3B8] font-mono truncate">
                              {member.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-[#0866FF] font-medium">Chat</span>
                    </div>
                  ))}
                  {searchPool.length === 0 && (
                    <div className="p-3 text-center text-xs text-[#65676B] dark:text-[#B0B3B8]">
                      Type any member name or email to search
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CENTER: Navigation Tabs */}
      <nav className="hidden sm:flex items-center h-full gap-1 md:gap-2 max-w-2xl flex-1 justify-center px-4">
        {[
          { id: 'home', label: 'Home', icon: Home, badge: null },
          { id: 'watch', label: 'Video', icon: Tv, badge: '9+' },
          { id: 'marketplace', label: 'Marketplace', icon: Store, badge: null },
          { id: 'groups', label: 'Groups', icon: Users, badge: null },
          { id: 'gaming', label: 'Gaming', icon: Gamepad2, badge: null },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative flex items-center justify-center h-full px-4 md:px-8 cursor-pointer group transition-colors ${
                isActive
                  ? 'border-b-[3px] border-[#0866FF]'
                  : 'hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] rounded-lg my-1'
              }`}
              title={tab.label}
            >
              <div className="relative">
                <Icon
                  className={`w-7 h-7 transition-colors ${
                    isActive
                      ? 'text-[#0866FF]'
                      : 'text-[#65676B] dark:text-[#B0B3B8] group-hover:text-[#050505] dark:group-hover:text-[#E4E6EB]'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {tab.badge && !isActive && (
                  <span className="absolute -top-1 -right-2 bg-[#E41E3F] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                    {tab.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* RIGHT: Actions, Dark Mode Toggle, Profile Menu */}
      <div className="flex items-center gap-2">
        {/* Admin Console shortcut button for admin@social.com */}
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => onOpenAdmin && onOpenAdmin()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-500/30 transition-colors cursor-pointer"
            title="Open Forum Admin Console"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Console</span>
          </button>
        )}

        {/* Quick Dark Mode Direct Toggle Button */}
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="w-10 h-10 rounded-full bg-[#E4E6EB] dark:bg-[#3A3B3C] hover:bg-[#D8DADF] dark:hover:bg-[#4E4F50] flex items-center justify-center text-[#050505] dark:text-[#E4E6EB] transition-colors cursor-pointer"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-[#050505]" />
          )}
        </button>

        {/* Messenger Button with Popover */}
        <div className="relative" ref={messengerRef}>
          <button
            onClick={() => {
              setShowMessenger(!showMessenger);
              setShowNotifications(false);
              setShowProfileMenu(false);
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer relative ${
              showMessenger
                ? 'bg-[#E7F3FF] dark:bg-[#263951] text-[#0866FF]'
                : 'bg-[#E4E6EB] dark:bg-[#3A3B3C] hover:bg-[#D8DADF] dark:hover:bg-[#4E4F50] text-[#050505] dark:text-[#E4E6EB]'
            }`}
            title="Messenger"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-[#E41E3F] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </button>

          {/* Messenger Dropdown */}
          {showMessenger && (
            <div className="absolute right-0 top-12 w-88 bg-white dark:bg-[#242526] rounded-xl shadow-2xl border border-[#E4E6EB] dark:border-[#393A3B] p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#E4E6EB] dark:border-[#393A3B]">
                <h3 className="text-xl font-bold text-[#050505] dark:text-[#E4E6EB]">Chats</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenChat(contacts[0])}
                    className="text-xs text-[#0866FF] font-semibold hover:underline"
                  >
                    New Message
                  </button>
                </div>
              </div>

              <div className="mt-2 space-y-1 max-h-80 overflow-y-auto fb-scrollbar">
                {contacts.slice(0, 5).map((contact, index) => (
                  <div
                    key={contact.id}
                    onClick={() => {
                      onOpenChat(contact);
                      setShowMessenger(false);
                    }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {contact.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#31A24C] border-2 border-white dark:border-[#242526] rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#050505] dark:text-[#E4E6EB] truncate">
                        {contact.name}
                      </p>
                      <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] truncate">
                        {index === 0
                          ? 'Some of your famous sourdough bread would be amazing!'
                          : index === 1
                          ? 'Did you check the new design system?'
                          : 'Hey, are you free this afternoon?'}
                      </p>
                    </div>
                    {index < 2 && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0866FF]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Button with Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowMessenger(false);
              setShowProfileMenu(false);
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer relative ${
              showNotifications
                ? 'bg-[#E7F3FF] dark:bg-[#263951] text-[#0866FF]'
                : 'bg-[#E4E6EB] dark:bg-[#3A3B3C] hover:bg-[#D8DADF] dark:hover:bg-[#4E4F50] text-[#050505] dark:text-[#E4E6EB]'
            }`}
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E41E3F] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-92 bg-white dark:bg-[#242526] rounded-xl shadow-2xl border border-[#E4E6EB] dark:border-[#393A3B] p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#E4E6EB] dark:border-[#393A3B]">
                <h3 className="text-xl font-bold text-[#050505] dark:text-[#E4E6EB]">
                  Notifications
                </h3>
                {unreadNotifsCount > 0 && (
                  <button
                    onClick={markAllNotifsRead}
                    className="text-xs text-[#0866FF] font-semibold hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="mt-2 space-y-1 max-h-96 overflow-y-auto fb-scrollbar">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                      notif.read
                        ? 'hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C]'
                        : 'bg-[#E7F3FF]/40 dark:bg-[#263951]/40 hover:bg-[#E7F3FF]/60'
                    }`}
                  >
                    <img
                      src={notif.user.avatar}
                      alt={notif.user.name}
                      className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 text-xs text-[#050505] dark:text-[#E4E6EB] leading-tight">
                      <span className="font-semibold">{notif.user.name}</span>{' '}
                      <span>{notif.action}</span>
                      <p className="text-[11px] text-[#0866FF] font-medium mt-1">
                        {notif.time}
                      </p>
                    </div>
                    {!notif.read && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0866FF] mt-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Copy / Share Forum Link Button */}
        <button
          onClick={onCopyLink}
          className="w-10 h-10 rounded-full bg-[#E4E6EB] dark:bg-[#3A3B3C] hover:bg-[#D8DADF] dark:hover:bg-[#4E4F50] text-[#050505] dark:text-[#E4E6EB] flex items-center justify-center transition-colors cursor-pointer"
          title="Copy shareable forum link"
        >
          <Link2 className="w-5 h-5 text-[#0866FF]" />
        </button>

        {/* Admin Console Quick Button for Root Admin */}
        {currentUser?.role === 'admin' && (
          <button
            onClick={onOpenAdmin}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-bold transition-colors cursor-pointer"
            title="Open Forum Admin Console"
          >
            <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Admin Console</span>
          </button>
        )}

        {/* Login Button when no user */}
        {!currentUser && (
          <button
            onClick={onOpenAuth}
            className="bg-[#0866FF] hover:bg-[#1877F2] text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            Log In / Join
          </button>
        )}

        {/* Profile Avatar & Account Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              if (!currentUser) {
                onOpenAuth();
                return;
              }
              setShowProfileMenu(!showProfileMenu);
              setShowMessenger(false);
              setShowNotifications(false);
            }}
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0866FF] rounded-full cursor-pointer"
            title={currentUser ? currentUser.name : 'Sign in / Profile'}
          >
            {currentUser ? (
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-[#0866FF] transition-all"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#E4E6EB] dark:bg-[#3A3B3C] border border-white dark:border-[#242526] rounded-full flex items-center justify-center">
                  <ChevronDown className="w-2.5 h-2.5 text-[#050505] dark:text-[#E4E6EB]" />
                </span>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#E4E6EB] dark:bg-[#3A3B3C] flex items-center justify-center text-[#65676B] dark:text-[#B0B3B8] hover:text-[#0866FF]">
                <UserCircle className="w-6 h-6" />
              </div>
            )}
          </button>

          {/* Account Menu Dropdown */}
          {showProfileMenu && currentUser && (
            <div className="absolute right-0 top-12 w-84 bg-white dark:bg-[#242526] rounded-xl shadow-2xl border border-[#E4E6EB] dark:border-[#393A3B] p-2 z-50">
              {/* Profile Card Header */}
              <div className="p-3 bg-white dark:bg-[#242526] rounded-lg shadow-xs hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] cursor-pointer flex items-center gap-3 border border-[#E4E6EB] dark:border-[#393A3B]">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-[#050505] dark:text-[#E4E6EB] truncate">
                    {currentUser.name}
                  </h4>
                  <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
                    Active Mission Member
                  </p>
                </div>
              </div>

              <div className="border-t border-[#E4E6EB] dark:border-[#393A3B] my-2" />

              {/* Dark Mode Switch Row */}
              <div
                onClick={() => setDarkMode((prev) => !prev)}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#E4E6EB] dark:bg-[#3A3B3C] flex items-center justify-center">
                    <MoonStar className="w-5 h-5 text-[#050505] dark:text-[#E4E6EB]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#050505] dark:text-[#E4E6EB]">
                      Dark mode
                    </p>
                    <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
                      {darkMode ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
                {/* Switch indicator */}
                <div
                  className={`w-11 h-6 flex items-center rounded-full p-1 duration-200 cursor-pointer ${
                    darkMode ? 'bg-[#0866FF]' : 'bg-[#CED0D4] dark:bg-[#4E4F50]'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${
                      darkMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Settings & Privacy */}
              <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-[#E4E6EB] dark:bg-[#3A3B3C] flex items-center justify-center">
                  <Settings className="w-5 h-5 text-[#050505] dark:text-[#E4E6EB]" />
                </div>
                <p className="text-sm font-semibold text-[#050505] dark:text-[#E4E6EB]">
                  Settings & privacy
                </p>
              </div>

              {/* Admin Console row if admin */}
              {currentUser.role === 'admin' && (
                <div
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenAdmin && onOpenAdmin();
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-amber-500/10 text-amber-700 dark:text-amber-400 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Admin Forum Console</p>
                    <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">Manage accounts & posts</p>
                  </div>
                </div>
              )}

              {/* Log Out Button */}
              <div
                onClick={() => {
                  setShowProfileMenu(false);
                  onLogout();
                }}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] cursor-pointer text-[#E41E3F]"
              >
                <div className="w-9 h-9 rounded-full bg-[#E4E6EB] dark:bg-[#3A3B3C] flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-[#E41E3F]" />
                </div>
                <p className="text-sm font-semibold">
                  Log out
                </p>
              </div>

              <div className="border-t border-[#E4E6EB] dark:border-[#393A3B] my-2" />

              {/* Mission Notice */}
              <p className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] px-3 py-1">
                SCIENCE MSSN 2K27 · Orbit Network © 2027
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
