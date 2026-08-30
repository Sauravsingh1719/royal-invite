"use client";

import React, { useState, useRef, useEffect } from "react";
import { Music, Play, Pause, Check, Volume2 } from "lucide-react";
import { AUDIO_PRESETS } from "@/lib/audio-presets";

interface AudioSelectorProps {
  value: string;
  onChange: (url: string) => void;
}

export default function AudioSelector({ value, onChange }: AudioSelectorProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleTogglePreview = (id: string, url: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play().catch((err) => console.log("Playback error:", err));
    setPlayingId(id);

    audio.onended = () => {
      setPlayingId(null);
    };
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-[#8B1E41]" />
          <label className="block text-xs font-bold uppercase text-gray-900 font-[family-name:var(--font-cinzel)]">
            Background Music
          </label>
        </div>
        <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
          <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" /> Click play to preview
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {AUDIO_PRESETS.map((preset) => {
          const isSelected = value === preset.url;
          const isPlaying = playingId === preset.id;

          return (
            <div
              key={preset.id}
              onClick={() => onChange(preset.url)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-between gap-3 ${
                isSelected
                  ? "border-[#8B1E41] bg-[#8B1E41]/5 shadow-sm ring-2 ring-[#8B1E41]/20"
                  : "border-gray-300 hover:border-[#D4AF37] bg-white"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-black font-[family-name:var(--font-cinzel)]">
                  {preset.title}
                </span>
                {isSelected && (
                  <span className="p-0.5 bg-[#8B1E41] text-[#D4AF37] rounded-full">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => handleTogglePreview(preset.id, preset.url, e)}
                className={`p-2.5 rounded-full transition-all shadow-sm ${
                  isPlaying
                    ? "bg-[#8B1E41] text-[#D4AF37] ring-4 ring-[#8B1E41]/20 scale-105"
                    : "bg-[#FDFBF7] hover:bg-[#8B1E41] text-gray-700 hover:text-white border border-[#D4AF37]/40"
                }`}
                title={isPlaying ? "Pause" : "Preview"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 pl-0.5" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}