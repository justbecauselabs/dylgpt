'use client'

import { useState, useEffect, useRef } from 'react'
import ChatInterface from '@/components/ChatInterface'
import NameModal from '@/components/NameModal'
import { getCookie, setCookie } from '@/utils/cookies'
import { APOLOGIES, CONFIRMATIONS, pickRandom } from '@/utils/concierge'

// The concierge never rushes; it also keeps the sending state from flashing by.
const MIN_SEND_MS = 1400

export default function Home() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const lastReply = useRef<string | null>(null);

  useEffect(() => {
    const storedName = getCookie('dylgpt_user');
    if (storedName) {
      setUserName(storedName);
    } else {
      setShowModal(true);
    }
  }, []);

  const handleNameSubmit = (name: string) => {
    setCookie('dylgpt_user', name);
    setUserName(name);
    setShowModal(false);
  };

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    const newMessages = [...messages, { role: 'user' as const, content: message }];
    setMessages(newMessages);
    const startedAt = Date.now();

    let reply: string;
    try {
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          userName 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send SMS');
      }

      reply = pickRandom(CONFIRMATIONS, lastReply.current);
    } catch {
      reply = pickRandom(APOLOGIES, lastReply.current);
    }
    lastReply.current = reply;

    const remaining = MIN_SEND_MS - (Date.now() - startedAt);
    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }

    setMessages([...newMessages, { role: 'assistant' as const, content: reply }]);
    setIsLoading(false);
  };

  return (
    <>
      <NameModal isOpen={showModal} onSubmit={handleNameSubmit} />
      <div className="gilded-room flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-[280px] md:flex-col border-r-[4px] border-[color:var(--ink)] bg-[color:var(--grape-900)]">
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex h-full min-h-0 flex-col">
            <div className="px-5 pt-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="gilded-medallion gilded-glint flex h-11 w-11 items-center justify-center rounded-full">
                  <svg stroke="var(--ink)" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <span className="gilded-text font-[family-name:var(--font-display)] text-3xl tracking-wide">
                  DylGPT
                </span>
              </div>
              <hr className="gilded-rule my-5" />
              <button className="gilded-ghost mb-2 flex w-full items-center justify-center gap-3 rounded-full p-3 font-[family-name:var(--font-display)] text-lg tracking-wide">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                New chat
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <nav className="flex h-full flex-col px-3 pb-3.5">
                <div className="flex-1"></div>
              </nav>
            </div>
            <div className="px-5 pb-6">
              <hr className="gilded-rule mb-4" />
              <p className="gilded-badge mx-auto w-fit -rotate-2 rounded-full px-4 py-1.5 text-center font-[family-name:var(--font-display)] text-sm tracking-widest">
                Solid Gold Service
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <ChatInterface messages={messages} onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
    </>
  );
}
