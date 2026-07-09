"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type MusicPlayerProps = {
  autoPlay?: boolean;
};

/**
 * Lofi Music Player — royalty-free Pixabay track (CC0), loops continuously.
 * Starts paused; browsers block autoplay without a user gesture.
 */
export const MusicPlayer = ({ autoPlay = false }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const autoPlayAttempted = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, isMounted]);

  useEffect(() => {
    if (!isMounted || !autoPlay || autoPlayAttempted.current) return;
    autoPlayAttempted.current = true;
    setIsPlaying(true);
  }, [autoPlay, isMounted]);

  if (!isMounted) return null;

  return (
    <motion.div
      className="lofi-music-player"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <audio
        ref={audioRef}
        loop
        preload="metadata"
        src="https://cdn.pixabay.com/download/audio/2024/08/16/audio_8d88b67f5d.mp3"
      />
      <motion.button
        type="button"
        onClick={() => setIsPlaying(prev => !prev)}
        className="lofi-music-button"
        aria-label={isPlaying ? "Pause music" : "Play music"}
        aria-pressed={isPlaying}
        title={isPlaying ? "Pause music" : "Play music"}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <span className="lofi-music-icon" aria-hidden>
          {isPlaying ? "⏸" : "▶"}
        </span>
        <span className="lofi-music-emoji" aria-hidden>
          🎵
        </span>
      </motion.button>
      <span className="lofi-music-label">{isPlaying ? "ON" : "OFF"}</span>
    </motion.div>
  );
};
