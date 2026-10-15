import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  RotateCcw,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Copy,
  Check,
  Dumbbell,
  Utensils,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { sendAIChatMessage, getAIConversations, getAIConversationById } from '../../api/ai';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const AIAssistant = () => {
  const { user } = useAuth();
  const { notify } = useNotification();

  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        `Hello ${user?.name ? user.name.split(' ')[0] : 'Athlete'}! I am **FitMate AI**, your personal wellness and exercise coach.\n\nI can help you build structured workout splits, understand exercise biomechanics, calculate caloric & macronutrient targets, and stay consistent.\n\n*Note: I provide educational fitness guidance only and do not replace certified medical diagnosis.* How can I accelerate your training today?`,
      timestamp: new Date(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const suggestedPrompts = [
    { label: '4-Day Hypertrophy Split', icon: Dumbbell, text: 'Help me plan a 4-day upper/lower hypertrophy workout split.' },
    { label: 'High-Protein Meal Ideas', icon: Utensils, text: 'Suggest healthy meal ideas providing at least 35g protein per meal.' },
    { label: 'Progressive Overload Rules', icon: Zap, text: 'Explain how to apply progressive overload safely for beginners.' },
    { label: 'Optimal Rest & Recovery', icon: TrendingUp, text: 'How much rest is optimal between sets for muscle growth vs strength?' },
  ];

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
    notify('Response copied to clipboard', 'info');
  };

  const handleSendMessage = async (textToSend = inputMessage) => {
    const text = textToSend.trim();
    if (!text || loading) return;

    setInputMessage('');

    // Append user message immediately
    const userMsg = {
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await sendAIChatMessage(text, conversationId);

      if (res?.conversationId) {
        setConversationId(res.conversationId);
      }

      if (res?.isConfigured !== undefined) {
        setIsConfigured(res.isConfigured);
      }

      const botReply = {
        role: 'assistant',
        content: res?.reply || 'Received response from assistant.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      const errorReply = {
        role: 'assistant',
        content:
          err.response?.data?.message ||
          'I am having trouble connecting to the AI service right now. Please verify backend server connectivity.',
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = () => {
    setConversationId(null);
    setMessages([
      {
        role: 'assistant',
        content: `Fresh coaching session initiated! What training or nutrition challenge should we tackle?`,
        timestamp: new Date(),
      },
    ]);
    notify('New coaching session started.', 'info');
  };

  const renderFormattedText = (content) => {
    const paragraphs = content.split('\n\n');
    return paragraphs.map((para, pIdx) => {
      const lines = para.split('\n');
      return (
        <div key={pIdx} className="mb-2.5 last:mb-0 space-y-1">
          {lines.map((line, lIdx) => {
            const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
            const cleanLine = isBullet ? line.trim().substring(2) : line;

            const formatted = cleanLine.split(/(\*\*.*?\*\*)/g).map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
              }
              if (part.startsWith('*') && part.endsWith('*')) {
                return <em key={i} className="italic text-slate-600">{part.slice(1, -1)}</em>;
              }
              return part;
            });

            if (isBullet) {
              return (
                <div key={lIdx} className="flex items-start gap-2 pl-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                  <span className="text-slate-700 leading-relaxed">{formatted}</span>
                </div>
              );
            }

            return <p key={lIdx} className="leading-relaxed text-slate-700">{formatted}</p>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8.5rem)] page-transition">
      {/* Chat Header */}
      <div className="bg-white p-4 sm:p-5 rounded-t-3xl border border-slate-200/80 shadow-xs flex items-center justify-between backdrop-blur-xl animate-fade-up">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 animate-bounce-subtle">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">FitMate AI Coach</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider border border-emerald-200 animate-pulse">
                Active Assistant
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Personalized training intelligence & nutrition advisor
            </p>
          </div>
        </div>

        <button
          onClick={handleNewConversation}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-all hover:scale-[1.03] active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Advisory Banner */}
      <div className="bg-amber-50/90 border-x border-amber-200/80 px-4 py-2 flex items-center gap-2 text-[11px] text-amber-900">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>FitMate AI provides general wellness guidance only. Consult a physician for medical conditions.</span>
      </div>

      {/* Message History Container */}
      <div className="flex-1 bg-gradient-to-b from-slate-50/80 via-white/50 to-slate-50/80 border-x border-slate-200/80 p-4 sm:p-6 overflow-y-auto space-y-5">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 chat-message-in ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs transition-transform group-hover:scale-110 ${
                  isUser
                    ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white'
                    : 'bg-white border border-slate-200 text-emerald-600 shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 animate-bounce-subtle" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-xl text-xs sm:text-sm p-4 sm:p-5 rounded-2xl leading-relaxed shadow-xs transition-all ${
                  isUser
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none shadow-md shadow-emerald-600/15'
                    : msg.isError
                    ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-tl-none'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none hover:shadow-md'
                }`}
              >
                {isUser ? (
                  <p className="leading-relaxed font-medium">{msg.content}</p>
                ) : (
                  <div>{renderFormattedText(msg.content)}</div>
                )}

                <div
                  className={`flex items-center justify-between text-[10px] mt-2.5 pt-2 border-t ${
                    isUser
                      ? 'border-emerald-500/40 text-emerald-100'
                      : 'border-slate-100 text-slate-400'
                  }`}
                >
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                  {!isUser && !msg.isError && (
                    <button
                      onClick={() => handleCopy(msg.content, idx)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-emerald-600 transition-colors"
                      title="Copy message"
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator with Animated Dots */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white border border-slate-200 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none flex items-center gap-3 text-xs text-slate-600 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="font-medium text-slate-500">FitMate AI is formulating guidance...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      {messages.length <= 2 && (
        <div className="bg-slate-50/90 border-x border-slate-200/80 px-4 py-3 flex items-center gap-2 overflow-x-auto">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            Quick Prompts:
          </span>
          <div className="flex items-center gap-2">
            {suggestedPrompts.map((p, idx) => {
              const PIcon = p.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p.text)}
                  className="inline-flex items-center gap-1.5 text-xs whitespace-nowrap px-3.5 py-1.5 bg-white hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 text-slate-700 rounded-xl border border-slate-200 shadow-2xs transition-all duration-200 hover:scale-[1.04] active:scale-95 font-medium"
                >
                  <PIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="bg-white p-4 rounded-b-3xl border border-slate-200/80 shadow-sm backdrop-blur-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              maxLength={1500}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about workouts, nutrition targets, or exercise cues..."
              disabled={loading}
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50"
            />
            {inputMessage.length > 1200 && (
              <span className="absolute right-3 top-3.5 text-[10px] text-slate-400 font-medium">
                {1500 - inputMessage.length}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl shadow-md shadow-emerald-600/30 disabled:opacity-40 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shrink-0 glow-pulse"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

