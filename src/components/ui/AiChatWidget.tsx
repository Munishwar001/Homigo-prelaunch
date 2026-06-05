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
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function renderContent(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

// ─── Welcome message ──────────────────────────────────────────────────────────

const WELCOME: Message = {
  role:        "assistant",
  content:     "Namaste! 👋 I'm Homigo's assistant.\n\nAsk me anything about our AI-powered home services platform — how it works, what we offer, pricing, or how to join early.",
  time:        nowTime(),
  suggestions: ["How does it work? 🔄", "Services we offer 🔧", "Join waitlist 🚀"],
  cta:         null,
};

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary block"
            style={{ animation: "bounce 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      <span className="text-[11px] text-gray-400 italic">Thinking…</span>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

interface BubbleProps {
  msg:         Message;
  isNew?:      boolean;
  onChipClick: (text: string) => void;
  onCta:       (section: string) => void;
}

function Bubble({ msg, isNew, onChipClick, onCta }: BubbleProps) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex flex-col gap-2 ${isNew ? "chat-msg-in" : ""}`}>
      <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>

        {/* Bot avatar */}
        {!isUser && (
          <div
            className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center shadow-sm"
            style={{ background: "linear-gradient(135deg, #0D9488, #0b7c70)" }}
          >
            <Bot size={13} className="text-white" />
          </div>
        )}

        <div className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"} max-w-[80%]`}>
          {/* Bubble */}
          <div
            className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
              isUser
                ? "text-white rounded-2xl rounded-tr-sm"
                : "bg-white text-[#1C1C1E] rounded-2xl rounded-tl-sm"
            }`}
            style={
              isUser
                ? {
                    background:  "linear-gradient(135deg, #0D9488, #0f766e)",
                    boxShadow:   "0 4px 14px rgba(13,148,136,0.28)",
                  }
                : {
                    borderLeft:  "3px solid #0D9488",
                    boxShadow:   "0 2px 12px rgba(0,0,0,0.07), inset 0 0 0 1px rgba(13,148,136,0.07)",
                  }
            }
          >
            {renderContent(msg.content)}
          </div>
          <span className="text-[10px] text-gray-400 px-1">{msg.time}</span>
        </div>

        {/* User avatar */}
        {isUser && (
          <div
            className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold text-white shadow-sm"
            style={{ background: "linear-gradient(135deg, #374151, #1f2937)" }}
          >
            You
          </div>
        )}
      </div>

      {/* Suggestion chips */}
      {!isUser && msg.suggestions.length > 0 && (
        <div
          className="pl-9 flex flex-wrap gap-1.5 chip-fade-in"
          style={{ animationDelay: "0.2s", opacity: 0 }}
        >
          {msg.suggestions.map((chip) => (
            <button
              key={chip}
              onClick={() => onChipClick(chip)}
              className="text-[11px] px-3 py-1.5 rounded-full border border-primary/30 text-primary bg-primary/5 hover:bg-primary hover:text-white hover:border-primary hover:shadow-md transition-all duration-200 font-medium"
              style={{ ["--tw-shadow-color" as string]: "rgba(13,148,136,0.25)" }}
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* CTA button */}
      {!isUser && msg.cta && (
        <div className="pl-9 chip-fade-in" style={{ animationDelay: "0.3s", opacity: 0 }}>
          <button
            onClick={() => onCta(msg.cta!.section)}
            className="inline-flex items-center gap-1.5 text-[11px] px-4 py-2 rounded-full font-semibold text-white transition-all duration-150 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background:  "linear-gradient(135deg, #0D9488, #0b7c70)",
              boxShadow:   "0 4px 14px rgba(13,148,136,0.3)",
            }}
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

      setMessages(prev => {
        setNewIdx(prev.length);
        return [...prev, {
          role:        "assistant" as const,
          content:     data.reply ?? "Sorry, I couldn't process that. Please try again.",
          time:        nowTime(),
          suggestions: data.suggestions ?? [],
          cta:         data.cta ?? null,
        }];
      });
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">

      {/* ── Chat panel ───────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden flex flex-col"
        style={{
          width:         "min(360px, calc(100vw - 48px))",
          height:        520,
          border:        "1px solid rgba(13,148,136,0.14)",
          boxShadow:     "0 32px 80px rgba(13,148,136,0.2), 0 8px 32px rgba(0,0,0,0.15)",
          opacity:       open ? 1 : 0,
          transform:     open ? "translateY(0) scale(1)" : "translateY(20px) scale(0.94)",
          pointerEvents: open ? "auto" : "none",
          transition:    "opacity 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.34,1.2,0.64,1)",
        }}
      >

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div
          className="px-4 py-4 flex items-center justify-between shrink-0 relative overflow-hidden"
          style={{ background: "linear-gradient(145deg, #0c1f1c 0%, #115e59 55%, #0D9488 100%)" }}
        >
          {/* Decorative orbs */}
          <div
            className="absolute top-0 right-0 w-44 h-44 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(94,234,212,0.15), transparent 70%)",
              transform:  "translate(35%, -35%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-32 h-32 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(13,148,136,0.2), transparent 70%)",
              transform:  "translate(-30%, 50%)",
            }}
          />

          {/* Avatar + info */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="relative">
              {/* Animated ping ring */}
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: "rgba(94,234,212,0.35)", animationDuration: "2.5s" }}
              />
              {/* Avatar */}
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center relative"
                style={{
                  background:    "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))",
                  border:        "1.5px solid rgba(255,255,255,0.25)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Bot size={20} className="text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="text-white font-bold text-sm tracking-tight">Homigo AI</p>
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider"
                  style={{
                    background: "rgba(94,234,212,0.15)",
                    color:      "#5eead4",
                    border:     "1px solid rgba(94,234,212,0.3)",
                  }}
                >
                  Beta
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  style={{ boxShadow: "0 0 6px #34d399" }}
                />
                <span className="text-white/55 text-[10px]">Always online · Instant replies</span>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.1)",
              border:     "1px solid rgba(255,255,255,0.12)",
            }}
            aria-label="Close chat"
          >
            <X size={14} className="text-white" />
          </button>
        </div>

        {/* ── Messages ───────────────────────────────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{
            background:      "linear-gradient(180deg, #f0fdf9 0%, #ffffff 40%)",
            backgroundImage: "radial-gradient(circle at 80% 20%, rgba(13,148,136,0.04) 0%, transparent 50%)",
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
                className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center shadow-sm"
                style={{ background: "linear-gradient(135deg, #0D9488, #0b7c70)" }}
              >
                <Bot size={13} className="text-white" />
              </div>
              <div
                className="bg-white rounded-2xl rounded-tl-sm px-4 py-3"
                style={{
                  borderLeft: "3px solid #0D9488",
                  boxShadow:  "0 2px 12px rgba(0,0,0,0.07), inset 0 0 0 1px rgba(13,148,136,0.07)",
                }}
              >
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── Input ──────────────────────────────────────────────────────── */}
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="px-3 py-3 bg-white flex gap-2 items-center shrink-0"
          style={{ borderTop: "1px solid rgba(13,148,136,0.08)" }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onFocus={e => {
              e.target.style.borderColor = "#0D9488";
              e.target.style.boxShadow   = "0 0 0 3px rgba(13,148,136,0.1)";
              e.target.style.background  = "#fff";
            }}
            onBlur={e => {
              e.target.style.borderColor = "#e5e7eb";
              e.target.style.boxShadow   = "none";
            }}
            placeholder="Ask about Homigo…"
            autoComplete="off"
            className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 outline-none text-[#1C1C1E] placeholder-gray-400 transition-all duration-200"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-full text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shrink-0"
            style={{
              background: "linear-gradient(135deg, #0D9488, #0b7c70)",
              boxShadow:  "0 4px 14px rgba(13,148,136,0.38)",
            }}
            aria-label="Send message"
          >
            <Send size={15} />
          </button>
        </form>
      </div>

      {/* ── Toggle button ──────────────────────────────────────────────────── */}
      <div className="relative self-end">

        {/* Pulsing rings when closed */}
        {!open && (
          <>
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: "rgba(13,148,136,0.22)", animationDuration: "2s" }}
            />
            <div
              className="absolute -inset-2.5 rounded-full"
              style={{
                background: "rgba(13,148,136,0.1)",
                animation:  "pulse 2.5s ease-in-out infinite",
              }}
            />
          </>
        )}

        {/* Floating tooltip (shown before first open) */}
        {!open && !opened && (
          <div
            className="absolute bottom-full right-0 mb-3 pointer-events-none"
            style={{ animation: "tooltipIn 0.35s 0.7s cubic-bezier(0.34,1.4,0.64,1) both" }}
          >
            <div
              className="flex items-center gap-1.5 bg-white rounded-2xl px-3.5 py-2 whitespace-nowrap"
              style={{
                boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(13,148,136,0.1)",
                border:    "1px solid rgba(13,148,136,0.1)",
              }}
            >
              <Sparkles size={12} className="text-primary" />
              <span className="text-sm font-semibold text-gray-700">Ask Homigo AI</span>
            </div>
            {/* Arrow */}
            <div className="flex justify-end pr-5">
              <div
                className="w-3 h-3 bg-white rotate-45 -translate-y-1.5"
                style={{
                  border:       "1px solid rgba(13,148,136,0.1)",
                  borderTop:    "none",
                  borderLeft:   "none",
                  boxShadow:    "2px 2px 4px rgba(0,0,0,0.04)",
                }}
              />
            </div>
          </div>
        )}

        {/* Notification badge */}
        {!opened && (
          <div
            className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white animate-bounce"
            style={{ boxShadow: "0 2px 8px rgba(239,68,68,0.5)", border: "2px solid white", animationDuration: "1.5s" }}
          >
            1
          </div>
        )}

        {/* Main button */}
        <button
          onClick={() => setOpen(o => !o)}
          className="relative w-16 h-16 rounded-full text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #0D9488, #0b7c70)",
            boxShadow:  open
              ? "0 8px 24px rgba(13,148,136,0.4)"
              : "0 10px 36px rgba(13,148,136,0.55), 0 3px 10px rgba(0,0,0,0.15)",
          }}
          aria-label={open ? "Close assistant" : "Open Homigo assistant"}
        >
          <div
            style={{
              transition: "transform 0.32s cubic-bezier(0.34,1.4,0.64,1)",
              transform:  open ? "rotate(90deg) scale(0.85)" : "rotate(0deg) scale(1)",
            }}
          >
            {open ? <X size={22} /> : <MessageCircle size={24} />}
          </div>
        </button>
      </div>

    </div>
  );
}

export default AiChatWidget;
