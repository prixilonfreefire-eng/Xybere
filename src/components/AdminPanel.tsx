import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Users,
  Trash2,
  Megaphone,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Mail,
  Link2,
  Copy,
  Check,
} from 'lucide-react';
import { Post, User } from '../types';

interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: number;
  avatar: string;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  onDeletePost: (postId: string) => void;
  onBroadcastAnnouncement: (text: string) => void;
  currentUser: User | null;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  posts,
  onDeletePost,
  onBroadcastAnnouncement,
  currentUser,
}) => {
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [announcementText, setAnnouncementText] = useState('');
  const [broadcasted, setBroadcasted] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'broadcast' | 'link'>('users');
  const [copiedLink, setCopiedLink] = useState(false);

  const appLink = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-kphjjsm24m4cqiystipjr3-575054989452.us-east1.run.app';

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(appLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const fetchAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const res = await fetch('/api/admin/accounts');
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts || []);
      }
    } catch (err) {
      console.error('Failed to load accounts:', err);
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAccounts();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    onBroadcastAnnouncement(announcementText.trim());
    setAnnouncementText('');
    setBroadcasted(true);
    setTimeout(() => setBroadcasted(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none">
      <div className="bg-white dark:bg-[#242526] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E4E6EB] dark:border-[#393A3B] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#0866FF]/15 via-transparent to-amber-500/10 border-b border-[#E4E6EB] dark:border-[#393A3B] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#0866FF] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-[#050505] dark:text-[#E4E6EB]">
                  Forum Admin Console
                </h3>
                <span className="bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-500/30">
                  ROOT ADMIN
                </span>
              </div>
              <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
                Logged in as {currentUser?.email || 'admin@social.com'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#E4E6EB] dark:bg-[#3A3B3C] hover:bg-[#D8DADF] dark:hover:bg-[#4E4F50] flex items-center justify-center text-[#65676B] dark:text-[#B0B3B8] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#E4E6EB] dark:border-[#393A3B] px-3 gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'border-[#0866FF] text-[#0866FF]'
                : 'border-transparent text-[#65676B] dark:text-[#B0B3B8]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Registered Accounts ({accounts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'posts'
                ? 'border-[#0866FF] text-[#0866FF]'
                : 'border-transparent text-[#65676B] dark:text-[#B0B3B8]'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Moderate Posts ({posts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'broadcast'
                ? 'border-[#0866FF] text-[#0866FF]'
                : 'border-transparent text-[#65676B] dark:text-[#B0B3B8]'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Broadcast</span>
          </button>
          <button
            onClick={() => setActiveTab('link')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'link'
                ? 'border-[#0866FF] text-[#0866FF]'
                : 'border-transparent text-[#65676B] dark:text-[#B0B3B8]'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Forum Link & Access</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-4 overflow-y-auto fb-scrollbar flex-1">
          {/* TAB 1: ACCOUNTS DIRECTORY */}
          {activeTab === 'users' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#65676B] dark:text-[#B0B3B8]">
                <span>Enforcing 1 email per account</span>
                <button
                  onClick={fetchAccounts}
                  className="flex items-center gap-1 text-[#0866FF] hover:underline font-semibold"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingAccounts ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="space-y-2">
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="p-3 bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-[#050505] dark:text-[#E4E6EB]">
                            {acc.name}
                          </p>
                          {acc.role === 'admin' && (
                            <span className="bg-[#0866FF] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{acc.email}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#65676B] dark:text-[#B0B3B8]">
                      Registered
                    </span>
                  </div>
                ))}

                {accounts.length === 0 && (
                  <p className="text-center py-8 text-xs text-[#65676B] dark:text-[#B0B3B8]">
                    No external accounts registered yet.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: POSTS MODERATION */}
          {activeTab === 'posts' && (
            <div className="space-y-3">
              <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
                Admins have root access to delete spam, inappropriate content, or test dispatches.
              </p>
              <div className="space-y-2">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="p-3 bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-xl flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
                          {post.author.name}
                        </span>
                        <span className="text-[10px] text-[#65676B] dark:text-[#B0B3B8]">
                          {post.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-[#050505] dark:text-[#E4E6EB] mt-1 line-clamp-2">
                        {post.text || '[Photo attachment only]'}
                      </p>
                    </div>

                    <button
                      onClick={() => onDeletePost(post.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Delete post from network"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                ))}

                {posts.length === 0 && (
                  <p className="text-center py-8 text-xs text-[#65676B] dark:text-[#B0B3B8]">
                    No posts currently published on the network.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: BROADCAST ANNOUNCEMENT */}
          {activeTab === 'broadcast' && (
            <form onSubmit={handleSendAnnouncement} className="space-y-3">
              {broadcasted && (
                <div className="p-2.5 bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-xs rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Announcement published and broadcast to all connected crew members!</span>
                </div>
              )}
              <label className="block text-xs font-bold text-[#65676B] dark:text-[#B0B3B8] uppercase">
                Official Admin Mission Directive
              </label>
              <textarea
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Broadcast an official forum announcement, mission priority bulletin, or schedule update..."
                className="w-full h-28 bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] resize-none"
              />
              <button
                type="submit"
                disabled={!announcementText.trim()}
                className="px-4 py-2 bg-[#0866FF] hover:bg-[#1877F2] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                <Megaphone className="w-4 h-4" />
                <span>Broadcast to All Users</span>
              </button>
            </form>
          )}

          {/* TAB 4: FORUM LINK & ACCESS DETAILS */}
          {activeTab === 'link' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#050505] dark:text-[#E4E6EB]">
                      Shareable Forum & Network Link
                    </h4>
                    <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
                      Invite crew members to register and collaborate in real-time
                    </p>
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-lg bg-[#0866FF] hover:bg-[#1877F2] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>

                <div className="p-2.5 bg-white dark:bg-[#242526] rounded-lg border border-[#CED0D4] dark:border-[#4E4F50] text-xs font-mono text-[#0866FF] break-all select-all">
                  {appLink}
                </div>
              </div>

              {/* Forum Admin Access Details Card */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <h4 className="text-sm font-bold text-[#050505] dark:text-[#E4E6EB]">
                    Forum Admin Credentials
                  </h4>
                </div>
                <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
                  Root admin forum access details configured:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 bg-white dark:bg-[#242526] rounded-lg border border-[#CED0D4] dark:border-[#4E4F50]">
                    <span className="text-[#65676B] dark:text-[#B0B3B8] block text-[10px] uppercase">Admin Email</span>
                    <strong className="text-[#050505] dark:text-[#E4E6EB]">admin@social.com</strong>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-[#242526] rounded-lg border border-[#CED0D4] dark:border-[#4E4F50]">
                    <span className="text-[#65676B] dark:text-[#B0B3B8] block text-[10px] uppercase">Password</span>
                    <strong className="text-[#050505] dark:text-[#E4E6EB]">Adminsocial</strong>
                  </div>
                </div>

                <p className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] mt-1">
                  • Accounts are strictly limited to one per unique email address.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
