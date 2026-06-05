"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { Bot, Send, X, MessageCircle, Sparkles, ExternalLink } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  role:        "user" | "assistant";
  content:     string;
  time:        string;
  suggestions: string[];
  cta:         { label: string; section: string } | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nowTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour:   "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function renderContent(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

// ─── Welcome message ──────────────────────────────────────────────────────────

const WELCOME: Message = {
  role:        "assistant",
  content:     "Namaste! 👋 I'm Homigo's assistant.\n\nAsk me anything about our AI-powered home services platform — how it works, what we offer, pricing, or how to join early.",
  time:        nowTime(),
  suggestions: ["How does it work? 🔄", "Services we offer 🔧", "Join waitlist 🚀"],
  cta:         null,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-primary"
          style={{ animation: "bounce 1.2s ease-in-out infinite", animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </div>
  );
}

interface BubbleProps {
  msg:         Message;
  isNew?:      boolean;
  onChipClick: (text: string) => void;
  onCta:       (section: string) => void;
}

function Bubble({ msg, isNew, onChipClick, onCta }: BubbleProps) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex flex-col gap-1 ${isNew ? "chat-msg-in" : ""}`}>
      <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>

        {!isUser && (
          <div
            className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0D9488, #0b7c70)" }}
          >
            <Bot size={14} className="text-white" />
          </div>
        )}

        <div className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"} max-w-[78%]`}>
          <div
            className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
              isUser
                ? "text-white rounded-tr-sm"
                : "bg-white text-[#1C1C1E] rounded-tl-sm shadow-sm border border-gray-100/80"
            }`}
            style={isUser ? { background: "linear-gradient(135deg, #0D9488, #0f766e)" } : undefined}
          >
            {renderContent(msg.content)}
          </div>
          <span className="text-[10px] text-gray-400 px-1">{msg.time}</span>
        </div>

        {isUser && (
          <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center bg-gray-200 text-[10px] font-semibold text-gray-500">
            You
          </div>
        )}
      </div>

      {!isUser && msg.suggestions.length > 0 && (
        <div className="pl-9 flex flex-wrap gap-1.5 chip-fade-in" style={{ animationDelay: "0.15s", opacity: 0 }}>
          {msg.suggestions.map((chip) => (
            <button
              key={chip}
              onClick={() => onChipClick(chip)}
              className="text-[11px] px-2.5 py-1 rounded-full border border-primary/40 text-primary bg-primary/5 hover:bg-primary hover:text-white hover:border-primary transition-all duration-150 font-medium"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {!isUser && msg.cta && (
        <div className="pl-9 chip-fade-in" style={{ animationDelay: "0.25s", opacity: 0 }}>
          <button
            onClick={() => onCta(msg.cta!.section)}
            className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full font-semibold text-white transition-all duration-150 hover:brightness-110 hover:scale-[1.03]"
            style={{ background: "linear-gradient(135deg, #0D9488, #0b7c70)" }}
          >
            <ExternalLink size={11} />
            {msg.cta.label}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main widget ──────────────────────────────────────────────────────────────

export function AiChatWidget() {
  const [open, setOpen]         = useState(false);
  const [opened, setOpened]     = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [newIdx, setNewIdx]     = useState<number | null>(null);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setOpened(true);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    if (/waitlist/i.test(trimmed) && !/tell me|how|what|explain/i.test(trimmed)) {
      scrollToSection("waitlist");
      return;
    }

    const userMsg: Message = {
      role: "user", content: trimmed, time: nowTime(), suggestions: [], cta: null,
    };

    setMessages(prev => { setNewIdx(prev.length); return [...prev, userMsg]; });
    setInput("");
    setLoading(true);

    try {
      const res  = await fetch("/api/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ message: trimmed }),
      });
      const data = await res.json() as {
        reply?:       string;
        suggestions?: string[];
        cta?:         { label: string; section: string } | null;
        error?:       string;
      };

      const aiMsg: Message = {
        role:        "assistant",
        content:     data.reply ?? "Sorry, I couldn't process that. Please try again.",
        time:        nowTime(),
        suggestions: data.suggestions ?? [],
        cta:         data.cta ?? null,
      };

      setMessages(prev => { setNewIdx(prev.length); return [...prev, aiMsg]; });
    } catch {
      setMessages(prev => {
        setNewIdx(prev.length);
        return [...prev, {
          role: "assistant" as const,
          content: "Something went wrong. Please try again.",
          time: nowTime(), suggestions: [], cta: null,
        }];
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* ── Chat panel ───────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden flex flex-col"
        style={{
          width:         "min(340px, calc(100vw - 48px))",
          height:        448,
          boxShadow:     "0 24px 60px rgba(13,148,136,0.18), 0 8px 24px rgba(0,0,0,0.12)",
          opacity:       open ? 1 : 0,
          transform:     open ? "translateY(0) scale(1)" : "translateY(18px) scale(0.95)",
          pointerEvents: open ? "auto" : "none",
          transition:    "opacity 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.28s cubic-bezier(0.34,1.2,0.64,1)",
        }}
      >
        {/* Header */}
        <div
          className="px-4 py-3 flex items-center justify-between shrink-0 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0D9488 0%, #0b7c70 100%)" }}
        >
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full bg-white/5" />

          <div className="flex items-center gap-2.5 relative z-10">
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-white text-sm font-semibold leading-none">Homigo Assistant</p>
                <Sparkles size={11} className="text-white/70" />
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/70 text-[10px]">Online · Ask me anything</span>
              </div>
            </div>
          </div>

          {/* Close */}
          <div className="relative z-10">
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
              aria-label="Close chat"
            >
              <X size={14} className="text-white" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{
            background:      "#F5F5F0",
            backgroundImage: "radial-gradient(circle at 20px 20px, rgba(13,148,136,0.04) 1px, transparent 0)",
            backgroundSize:  "40px 40px",
          }}
        >
          {messages.map((msg, i) => (
            <Bubble
              key={i}
              msg={msg}
              isNew={i === newIdx}
              onChipClick={sendMessage}
              onCta={scrollToSection}
            />
          ))}

          {loading && (
            <div className="flex items-end gap-2 chat-msg-in">
              <div
                className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #0D9488, #0b7c70)" }}
              >
                <Bot size={14} className="text-white" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm border border-gray-100/80 px-4 py-3">
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="px-3 py-3 bg-white border-t border-gray-100 flex gap-2 items-center shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about Homigo…"
            autoComplete="off"
            className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary focus:bg-white transition-all text-[#1C1C1E] placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:brightness-110 hover:scale-105 active:scale-95 shrink-0"
            style={{ background: "linear-gradient(135deg, #0D9488, #0b7c70)" }}
            aria-label="Send message"
          >
            <Send size={15} />
          </button>
        </form>
      </div>

      {/* ── Toggle button ──────────────────────────────────────────────────── */}
      <div className="relative">
        {!open && (
          <div
            className="absolute inset-0 rounded-full animate-pulse-ring"
            style={{ background: "rgba(13,148,136,0.25)" }}
          />
        )}
        {!opened && (
          <div className="absolute -top-1 -right-1 z-10">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          </div>
        )}
        <button
          onClick={() => setOpen(o => !o)}
          className="relative w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ background: "linear-gradient(135deg, #0D9488, #0b7c70)" }}
          aria-label={open ? "Close assistant" : "Open Homigo assistant"}
        >
          <div style={{ transition: "transform 0.2s ease", transform: open ? "rotate(90deg)" : "rotate(0deg)" }}>
            {open ? <X size={22} /> : <MessageCircle size={22} />}
          </div>
        </button>
      </div>

    </div>
  );
}

export default AiChatWidget;
