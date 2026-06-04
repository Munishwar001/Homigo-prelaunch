"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

/**
 * Cycles through `messages` in a bounce pattern: 0→1→2→1→0→1→2→…
 * Each message fades out, then the next fades in.
 */

interface ChatBubbleProps {
  messages: readonly string[];
  /** ms each message stays visible before transition  (default 2800) */
  holdMs?: number;
  /** ms for fade-out + fade-in transition              (default 400) */
  transitionMs?: number;
  time?: string;
}

function buildBounceSequence(length: number): number[] {
  if (length <= 1) return [0];
  const forward  = Array.from({ length }, (_, i) => i);           // [0,1,2]
  const backward = Array.from({ length: length - 2 }, (_, i) => length - 2 - i); // [1] (skip first+last)
  return [...forward, ...backward]; // [0,1,2,1]
}

export function ChatBubble({
  messages,
  holdMs = 2800,
  transitionMs = 400,
  time = "9:14 AM",
}: ChatBubbleProps) {
  const sequence = buildBounceSequence(messages.length); // e.g. [0,1,2,1]
  const [seqIdx, setSeqIdx]   = useState(0);   // current position in sequence
  const [visible, setVisible] = useState(true); // controls opacity

  useEffect(() => {
    // hold → fade-out → advance index → fade-in → repeat
    const holdTimer = setTimeout(() => {
      setVisible(false);

      const advTimer = setTimeout(() => {
        setSeqIdx((prev) => (prev + 1) % sequence.length);
        setVisible(true);
      }, transitionMs);

      return () => clearTimeout(advTimer);
    }, holdMs);

    return () => clearTimeout(holdTimer);
  }, [seqIdx, holdMs, transitionMs, sequence.length]);

  const currentMsg = messages[sequence[seqIdx]];

  // Dot indicator positions in the sequence
  const uniqueIndices = Array.from({ length: messages.length }, (_, i) => i);
  const activeMsg = sequence[seqIdx];

  return (
    <div className="mt-6 max-w-[270px] text-left select-none">
      {/* Bubble */}
      <div
        className="relative bg-[#0D9488] text-white text-sm rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg leading-relaxed min-h-[56px]"
        style={{
          opacity: visible ? 1 : 0,
          transition: `opacity ${transitionMs}ms ease-in-out`,
        }}
      >
        {/* speech tail */}
        <div className="absolute -top-1.5 left-4 w-3 h-3 bg-[#0D9488] rotate-45 rounded-sm" />
        &ldquo;{currentMsg}&rdquo;
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between mt-1.5 px-1">
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-[#6B7280]">{time}</span>
          <CheckCircle2 size={11} className="text-[#0D9488]" />
        </div>

        {/* Dot indicators */}
        <div className="flex gap-1 items-center">
          {uniqueIndices.map((idx) => (
            <span
              key={idx}
              className="rounded-full transition-all duration-300"
              style={{
                width:  activeMsg === idx ? 14 : 6,
                height: 6,
                background: activeMsg === idx ? "#0D9488" : "#d1d5db",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatBubble;
