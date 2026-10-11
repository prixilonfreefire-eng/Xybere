import React, { useState } from 'react';
import {
  Users,
  Store,
  Tv,
  Clock,
  Bookmark,
  Flag,
  Calendar,
  BarChart2,
  ChevronDown,
  ChevronUp,
  HeartHandshake,
  Layers,
  Sparkles,
  Droplet,
  Compass,
  ShieldCheck,
  Link2,
} from 'lucide-react';
import { User } from '../types';
import { UserCircle } from 'lucide-react';

interface LeftSidebarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onOpenAuth?: () => void;
  onOpenAdmin?: () => void;
  onCopyLink?: () => void;
}

interface SidebarItem {
  id: string;
  label: string;
  avatar?: string | null;
  icon?: any;
  badge?: string | null;
  color?: string;
  isProfile?: boolean;
  onClick?: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenAdmin,
  onCopyLink,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const primaryItems: SidebarItem[] = [
    {
      id: 'profile',
      label: currentUser ? currentUser.name : 'Sign In / Join Mission',
      avatar: currentUser ? currentUser.avatar : null,
      icon: currentUser ? null : UserCircle,
      isProfile: Boolean(currentUser),
      onClick: () => {
        if (!currentUser && onOpenAuth) {
          onOpenAuth();
        } else {
          setActiveTab('home');
        }
      },
    },
    {
      id: 'admin_forum',
      label: 'Forum Admin Console',
      icon: ShieldCheck,
      badge: currentUser?.role === 'admin' ? 'ROOT' : 'ADMIN',
      color: 'text-amber-500',
      onClick: () => {
        if (currentUser?.role === 'admin') {
          onOpenAdmin && onOpenAdmin();
        } else if (onOpenAuth) {
          onOpenAuth();
        }
      },
    },
    {
      id: 'copy_link',
      label: 'Copy Mission Link / Share',
      icon: Link2,
      badge: 'SHARE',
      color: 'text-[#0866FF]',
      onClick: () => {
        onCopyLink && onCopyLink();
      },
    },
    {
      id: 'friends',
      label: 'Mission Crew & Peers',
      icon: Users,
      badge: null,
      color: 'text-[#1877F2]',
      onClick: () => {},
    },
    {
      id: 'feeds',
      label: 'Feeds (Most Recent)',
      icon: Layers,
      color: 'text-[#1877F2]',
      onClick: () => setActiveTab('home'),
    },
    {
      id: 'groups',
      label: 'Groups',
      icon: Users,
      color: 'text-[#2ABBA7]',
      onClick: () => setActiveTab('groups'),
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: Store,
      color: 'text-[#1877F2]',
      onClick: () => setActiveTab('marketplace'),
    },
    {
      id: 'watch',
      label: 'Video',
      icon: Tv,
      color: 'text-[#2ABBA7]',
      onClick: () => setActiveTab('watch'),
    },
    {
      id: 'memories',
      label: 'Memories',
      icon: Clock,
      color: 'text-[#1877F2]',
      onClick: () => {},
    },
    {
      id: 'saved',
      label: 'Saved',
      icon: Bookmark,
      color: 'text-[#A033FF]',
      onClick: () => {},
    },
  ];

  const secondaryItems = [
    {
      id: 'pages',
      label: 'Pages',
      icon: Flag,
      color: 'text-[#F35369]',
    },
    {
      id: 'events',
      label: 'Events',
      icon: Calendar,
      color: 'text-[#F35369]',
    },
    {
      id: 'ads_manager',
      label: 'Ads Manager',
      icon: BarChart2,
      color: 'text-[#1877F2]',
    },
    {
      id: 'fundraisers',
      label: 'Fundraisers',
      icon: HeartHandshake,
      color: 'text-[#FA383E]',
    },
    {
      id: 'climate',
      label: 'Climate Science Center',
      icon: Sparkles,
      color: 'text-[#2ABBA7]',
    },
    {
      id: 'blood',
      label: 'Blood Donations',
      icon: Droplet,
      color: 'text-[#FA383E]',
    },
  ];

  const shortcuts = [
    {
      id: 'sc1',
      name: 'Mission Control & Telemetry',
      img: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=100&q=80',
    },
    {
      id: 'sc2',
      name: 'Mars Base Alpha Research Hub',
      img: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=100&q=80',
    },
    {
      id: 'sc3',
      name: 'Quantum Propulsion & Fusion Lab',
      img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=100&q=80',
    },
    {
      id: 'sc4',
      name: 'James Webb Data Analysis Group',
      img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=100&q=80',
    },
    {
      id: 'sc5',
      name: 'Astrobiology & Synthetic Genomics',
      img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=100&q=80',
    },
  ];

  return (
    <aside className="w-[280px] xl:w-[340px] h-[calc(100vh-56px)] sticky top-14 overflow-y-auto fb-scrollbar px-2 py-3 hidden lg:flex flex-col justify-between select-none">
      <div>
        {/* Primary shortcuts */}
        <div className="space-y-0.5">
          {primaryItems.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#E4E6EB] dark:hover:bg-[#3A3B3C] transition-colors cursor-pointer text-left group"
            >
              {item.isProfile && item.avatar ? (
                <img
                  src={item.avatar}
                  alt={item.label}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 flex items-center justify-center">
                  {item.icon && <item.icon className={`w-7 h-7 ${item.color || 'text-[#0866FF]'}`} />}
                </div>
              )}
              <span className="flex-1 text-sm font-semibold text-[#050505] dark:text-[#E4E6EB] truncate">
                {item.label}
              </span>
              {item.badge && (
                <span className="bg-[#0866FF] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          {/* Secondary collapsible shortcuts */}
          {isExpanded &&
            secondaryItems.map((item) => (
              <button
                key={item.id}
                className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#E4E6EB] dark:hover:bg-[#3A3B3C] transition-colors cursor-pointer text-left"
              >
                <div className="w-9 h-9 flex items-center justify-center">
                  <item.icon className={`w-7 h-7 ${item.color}`} />
                </div>
                <span className="flex-1 text-sm font-semibold text-[#050505] dark:text-[#E4E6EB] truncate">
                  {item.label}
                </span>
              </button>
            ))}

          {/* See More / See Less Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#E4E6EB] dark:hover:bg-[#3A3B3C] transition-colors cursor-pointer text-left"
          >
            <div className="w-9 h-9 rounded-full bg-[#E4E6EB] dark:bg-[#3A3B3C] flex items-center justify-center">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-[#050505] dark:text-[#E4E6EB]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#050505] dark:text-[#E4E6EB]" />
              )}
            </div>
            <span className="text-sm font-semibold text-[#050505] dark:text-[#E4E6EB]">
              {isExpanded ? 'See less' : 'See more'}
            </span>
          </button>
        </div>

        <div className="my-2 border-t border-[#CED0D4] dark:border-[#393A3B]" />

        {/* Your Shortcuts Section */}
        <div>
          <div className="flex items-center justify-between px-2 py-1">
            <h3 className="text-base font-bold text-[#65676B] dark:text-[#B0B3B8]">
              Your shortcuts
            </h3>
            <button className="text-xs text-[#0866FF] hover:underline font-semibold">
              Edit
            </button>
          </div>

          <div className="space-y-0.5 mt-1">
            {shortcuts.map((sc) => (
              <div
                key={sc.id}
                className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#E4E6EB] dark:hover:bg-[#3A3B3C] transition-colors cursor-pointer group"
              >
                <img
                  src={sc.img}
                  alt={sc.name}
                  className="w-9 h-9 rounded-lg object-cover"
                />
                <span className="text-sm font-medium text-[#050505] dark:text-[#E4E6EB] truncate">
                  {sc.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meta Footer */}
      <footer className="px-2 pt-4 pb-2 text-[12px] text-[#65676B] dark:text-[#B0B3B8] leading-tight">
        <p className="space-x-1">
          <a href="#" className="hover:underline">Mission Brief</a>
          <span>·</span>
          <a href="#" className="hover:underline">Protocols</a>
          <span>·</span>
          <a href="#" className="hover:underline">Research Papers</a>
          <span>·</span>
          <a href="#" className="hover:underline">Telemetry</a>
          <span>·</span>
          <a href="#" className="hover:underline">More</a>
        </p>
        <p className="mt-1 font-semibold text-[#0866FF]">SCIENCE MSSN 2K27 · Orbit Network © 2027</p>
      </footer>
    </aside>
  );
};
