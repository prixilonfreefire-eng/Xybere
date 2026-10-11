import React, { useState } from 'react';
import {
  Search,
  MoreHorizontal,
  Video,
  Gift,
  ExternalLink,
  Users2,
  X,
  Link2,
} from 'lucide-react';
import { User } from '../types';
import { SPONSORED_ADS } from '../data/mockData';

interface RightSidebarProps {
  contacts: User[];
  onOpenChat: (user: User) => void;
  onCopyLink?: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  contacts,
  onOpenChat,
  onCopyLink,
}) => {
  const [searchContact, setSearchContact] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  const filteredContacts = contacts.filter((c) => {
    if (!searchContact.trim()) return true;
    const q = searchContact.trim().toLowerCase();
    const matchesName = c.name?.toLowerCase().includes(q);
    const matchesEmail = c.email ? c.email.toLowerCase().includes(q) : false;
    return matchesName || matchesEmail;
  });

  return (
    <aside className="w-[280px] xl:w-[340px] h-[calc(100vh-56px)] sticky top-14 overflow-y-auto fb-scrollbar px-3 py-3 hidden xl:flex flex-col select-none">
      {/* SPONSORED ADS */}
      {SPONSORED_ADS.length > 0 ? (
        <section className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-[#65676B] dark:text-[#B0B3B8]">
              Sponsored
            </h3>
            <button className="text-[#65676B] dark:text-[#B0B3B8] hover:text-[#050505] p-1 rounded-full">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {SPONSORED_ADS.map((ad) => (
              <a
                key={ad.id}
                href={`https://${ad.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#E4E6EB] dark:hover:bg-[#3A3B3C] transition-colors group cursor-pointer"
              >
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="w-28 h-28 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-[#050505] dark:text-[#E4E6EB] leading-snug line-clamp-2 group-hover:text-[#0866FF]">
                    {ad.title}
                  </h4>
                  <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-1 flex items-center gap-1">
                    <span>{ad.domain}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      ) : (
        <section className="mb-4 p-3 bg-white/40 dark:bg-[#242526]/40 rounded-xl border border-dashed border-[#CED0D4] dark:border-[#393A3B] text-center">
          <h4 className="text-xs font-bold text-[#65676B] dark:text-[#B0B3B8] uppercase">
            Mission Dispatch
          </h4>
          <p className="text-xs text-[#050505] dark:text-[#E4E6EB] mt-1">
            Telemetry channels open for SCIENCE MSSN 2K27.
          </p>
        </section>
      )}

      <div className="border-t border-[#CED0D4] dark:border-[#393A3B] my-2" />

      {/* BIRTHDAYS WIDGET */}
      <section className="mb-3">
        <h3 className="text-base font-bold text-[#65676B] dark:text-[#B0B3B8] mb-2">
          Birthdays
        </h3>
        {contacts.length > 0 ? (
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#E4E6EB] dark:hover:bg-[#3A3B3C] cursor-pointer transition-colors">
            <div className="w-9 h-9 rounded-full bg-[#E7F3FF] dark:bg-[#263951] flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5 text-[#0866FF]" />
            </div>
            <p className="text-xs text-[#050505] dark:text-[#E4E6EB] leading-tight">
              <strong className="font-semibold">{contacts[0]?.name}</strong> and{' '}
              <strong className="font-semibold">others</strong> have birthdays today.
            </p>
          </div>
        ) : (
          <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] px-2 py-1">
            No member birthdays today.
          </p>
        )}
      </section>

      <div className="border-t border-[#CED0D4] dark:border-[#393A3B] my-2" />

      {/* CONTACTS LIST */}
      <section className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-bold text-[#65676B] dark:text-[#B0B3B8]">
            Contacts ({contacts.length})
          </h3>
          <div className="flex items-center gap-1 text-[#65676B] dark:text-[#B0B3B8]">
            {contacts.length > 0 && (
              <button
                onClick={() => setShowSearchInput(!showSearchInput)}
                className="p-1.5 hover:bg-[#E4E6EB] dark:hover:bg-[#3A3B3C] rounded-full transition-colors cursor-pointer"
                title="Search contacts"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
            <button
              className="p-1.5 hover:bg-[#E4E6EB] dark:hover:bg-[#3A3B3C] rounded-full transition-colors cursor-pointer"
              title="Options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collapsible search box */}
        {showSearchInput && (
          <div className="mb-2 relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchContact}
              onChange={(e) => setSearchContact(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (filteredContacts.length > 0) {
                    onOpenChat(filteredContacts[0]);
                  }
                }
              }}
              className="w-full bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-full px-3 py-1.5 text-xs text-[#050505] dark:text-[#E4E6EB] focus:outline-none pr-8"
              autoFocus
            />
            {searchContact && (
              <button
                onClick={() => setSearchContact('')}
                className="absolute right-2 top-2 text-[#65676B] hover:text-[#050505]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Contacts list */}
        <div className="space-y-0.5">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => onOpenChat(contact)}
              className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-[#E4E6EB] dark:hover:bg-[#3A3B3C] transition-colors cursor-pointer group"
            >
              {/* Avatar with status indicator */}
              <div className="relative flex-shrink-0">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                {contact.isOnline ? (
                  <span
                    className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#31A24C] border-2 border-white dark:border-[#242526] rounded-full"
                    title="Active now"
                  />
                ) : (
                  <span
                    className="absolute bottom-0 right-0 w-2 h-2 bg-[#8A8D91] border-2 border-white dark:border-[#242526] rounded-full"
                    title={contact.statusText}
                  />
                )}
              </div>

              {/* Name & subtle status */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#050505] dark:text-[#E4E6EB] truncate">
                  {contact.name}
                </p>
                {contact.email && (
                  <p className="text-[11px] text-[#0866FF] dark:text-[#4599FF] truncate font-mono">
                    {contact.email}
                  </p>
                )}
              </div>
            </div>
          ))}

          {contacts.length === 0 && (
            <div className="p-3 text-center rounded-xl bg-white/30 dark:bg-[#242526]/30 border border-dashed border-[#CED0D4] dark:border-[#393A3B]">
              <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
                No contacts online yet.
              </p>
              <p className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] mt-1">
                When other crew members log in, they will appear here with active status dots.
              </p>
              {onCopyLink && (
                <button
                  onClick={onCopyLink}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0866FF]/10 hover:bg-[#0866FF]/20 text-[#0866FF] text-xs font-semibold cursor-pointer transition-colors"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Copy Link & Invite</span>
                </button>
              )}
            </div>
          )}

          {contacts.length > 0 && filteredContacts.length === 0 && (
            <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] p-2 text-center">
              No contacts matching "{searchContact}"
            </p>
          )}
        </div>

        {/* Group conversations */}
        <div className="mt-4 pt-2 border-t border-[#CED0D4] dark:border-[#393A3B]">
          <h3 className="text-base font-bold text-[#65676B] dark:text-[#B0B3B8] mb-2">
            Mission Channels
          </h3>
          <div
            onClick={() => {
              const target = contacts[0] || {
                id: 'channel_ops',
                name: 'Mission Operations Crew 2K27',
                avatar: '',
                isOnline: true,
                statusText: 'All Crew Channel',
              };
              onOpenChat(target);
            }}
            className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-[#E4E6EB] dark:hover:bg-[#3A3B3C] transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#0866FF]/10 text-[#0866FF] flex items-center justify-center">
              <Users2 className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-[#050505] dark:text-[#E4E6EB] truncate">
              Mission Operations Crew 2K27
            </p>
          </div>
        </div>
      </section>
    </aside>
  );
};
