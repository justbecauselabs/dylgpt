'use client'

import { useState, useEffect } from 'react'
import ChatInterface from '@/components/ChatInterface'
import NameModal from '@/components/NameModal'
import { getCookie, setCookie } from '@/utils/cookies'

export default function Home() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

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

      if (response.ok) {
        setMessages([...newMessages, { 
          role: 'assistant' as const, 
          content: 'Your message has been sent via SMS!' 
        }]);
      } else {
        throw new Error('Failed to send SMS');
      }
    } catch (error) {
      setMessages([...newMessages, { 
        role: 'assistant' as const, 
        content: 'Sorry, there was an error sending your message. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NameModal isOpen={showModal} onSubmit={handleNameSubmit} />
      <div className="chrome-page flex h-screen">
        {/* Sidebar */}
        <div className="chrome-surface-dark chrome-bevel-dark relative hidden md:flex md:w-[260px] md:flex-col">
          {/* Bright edge where the panel catches the light */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-white/50 via-white/10 to-white/40" />
          <div className="flex h-full min-h-0 flex-col">
            <div className="px-4 pt-5">
              <span className="chrome-text text-lg font-semibold tracking-tight">DylGPT</span>
            </div>
            <div className="p-4">
              <button className="chrome-surface chrome-bevel chrome-sheen mb-2 flex w-full items-center justify-center gap-3 rounded-full p-3 text-sm font-medium text-gray-900 transition-transform duration-150 hover:-translate-y-px active:translate-y-0">
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
