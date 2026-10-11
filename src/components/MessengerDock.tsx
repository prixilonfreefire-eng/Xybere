import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Minus,
  Maximize2,
  ThumbsUp,
  Send,
  Phone,
  Video,
  Smile,
  Image,
} from 'lucide-react';
import { ActiveChat, User } from '../types';
import { generateInitialsAvatar } from '../utils/avatar';

interface MessengerDockProps {
  activeChats: ActiveChat[];
  onCloseChat: (userId: string) => void;
  onToggleMinimize: (userId: string) => void;
  onSendMessage: (userId: string, text: string, isThumb?: boolean) => void;
  currentUser: User | null;
}

export const MessengerDock: React.FC<MessengerDockProps> = ({
  activeChats,
  onCloseChat,
  onToggleMinimize,
  onSendMessage,
  currentUser,
}) => {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const messagesEndRefs = useRef<Record<string, HTMLDivElement | null>>({});

  if (!currentUser) return null;

  // Auto-scroll chat to bottom
  useEffect(() => {
    activeChats.forEach((chat) => {
      const el = messagesEndRefs.current[chat.contact.id];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }, [activeChats]);

  const handleInputChange = (userId: string, val: string) => {
    setInputs((prev) => ({ ...prev, [userId]: val }));
  };

  const handleSend = (userId: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputs[userId]?.trim();
    if (!text) return;
    onSendMessage(userId, text);
    setInputs((prev) => ({ ...prev, [userId]: '' }));
  };

  const handleSendThumb = (userId: string) => {
    onSendMessage(userId, '👍', true);
  };

  if (activeChats.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-4 z-40 flex items-end gap-3 select-none pointer-events-none">
      {activeChats.map((chat) => {
        const { contact, messages, isMinimized } = chat;
        const currentInput = inputs[contact.id] || '';

        return (
          <div
            key={contact.id}
            className={`pointer-events-auto w-80 bg-white dark:bg-[#242526] rounded-t-xl shadow-2xl border border-b-0 border-[#E4E6EB] dark:border-[#393A3B] flex flex-col transition-all duration-200 ${
              isMinimized ? 'h-12' : 'h-105'
            }`}
          >
            {/* CHAT HEADER */}
            <div
              onClick={() => onToggleMinimize(contact.id)}
              className="h-12 px-3 py-2 flex items-center justify-between border-b border-[#E4E6EB] dark:border-[#393A3B] cursor-pointer hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] rounded-t-xl transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    src={contact.avatar || generateInitialsAvatar(contact.name)}
                    alt={contact.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {contact.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#31A24C] border-2 border-white dark:border-[#242526] rounded-full" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB] truncate">
                    {contact.name}
                  </h4>
                  <p className="text-[10px] text-[#65676B] dark:text-[#B0B3B8] truncate leading-none">
                    {contact.isOnline ? 'Active now' : contact.statusText || 'Offline'}
                  </p>
                </div>
              </div>

              {/* Window Controls */}
              <div
                className="flex items-center gap-1 text-[#65676B] dark:text-[#B0B3B8]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onToggleMinimize(contact.id)}
                  className="p-1 hover:bg-[#E4E6EB] dark:hover:bg-[#4E4F50] rounded-full cursor-pointer"
                  title={isMinimized ? 'Expand' : 'Minimize'}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-3.5 h-3.5" />
                  ) : (
                    <Minus className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => onCloseChat(contact.id)}
                  className="p-1 hover:bg-[#E4E6EB] dark:hover:bg-[#4E4F50] rounded-full cursor-pointer"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* EXPANDED CONTENT */}
            {!isMinimized && (
              <>
                {/* MESSAGES THREAD */}
                <div className="flex-1 p-3 overflow-y-auto fb-scrollbar space-y-2.5 bg-white dark:bg-[#242526]">
                  {/* Top user profile summary */}
                  <div className="text-center py-3 border-b border-[#F0F2F5] dark:border-[#393A3B] mb-2">
                    <img
                      src={contact.avatar || generateInitialsAvatar(contact.name)}
                      alt={contact.name}
                      className="w-14 h-14 rounded-full object-cover mx-auto mb-1 ring-2 ring-[#0866FF]"
                    />
                    <h5 className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
                      {contact.name}
                    </h5>
                    <p className="text-[10px] text-[#65676B] dark:text-[#B0B3B8]">
                      Mission Crew Member
                    </p>
                  </div>

                  {messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-end gap-1.5 ${
                          isMe ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {!isMe && (
                          <img
                            src={contact.avatar || generateInitialsAvatar(contact.name)}
                            alt={contact.name}
                            className="w-6 h-6 rounded-full object-cover mb-0.5"
                          />
                        )}
                        <div
                          className={`max-w-[75%] px-3 py-1.5 rounded-2xl text-xs break-words ${
                            msg.isThumb
                              ? 'text-3xl bg-transparent p-0'
                              : isMe
                              ? 'bg-[#0866FF] text-white rounded-br-xs'
                              : 'bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] rounded-bl-xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                  <div
                    ref={(el) => {
                      messagesEndRefs.current[contact.id] = el;
                    }}
                  />
                </div>

                {/* CHAT INPUT FORM */}
                <form
                  onSubmit={(e) => handleSend(contact.id, e)}
                  className="p-2 border-t border-[#E4E6EB] dark:border-[#393A3B] flex items-center gap-1.5 bg-white dark:bg-[#242526]"
                >
                  <div className="flex-1 flex items-center bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-full px-3 py-1.5">
                    <input
                      type="text"
                      value={currentInput}
                      onChange={(e) =>
                        handleInputChange(contact.id, e.target.value)
                      }
                      placeholder="Aa"
                      className="w-full text-xs bg-transparent text-[#050505] dark:text-[#E4E6EB] placeholder-[#65676B] dark:placeholder-[#B0B3B8] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleInputChange(contact.id, currentInput + ' 😊')
                      }
                      className="text-[#65676B] dark:text-[#B0B3B8] hover:text-[#050505] p-0.5"
                    >
                      <Smile className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {currentInput.trim() ? (
                    <button
                      type="submit"
                      className="p-1.5 text-[#0866FF] hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Send className="w-4 h-4 fill-[#0866FF]" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendThumb(contact.id)}
                      className="p-1.5 text-[#0866FF] hover:scale-125 transition-transform cursor-pointer"
                      title="Send thumbs up"
                    >
                      <ThumbsUp className="w-4 h-4 fill-[#0866FF]" />
                    </button>
                  )}
                </form>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
