"use client";

import { useEffect, useRef, useState } from "react"; 
import { motion } from "framer-motion";

type MusicPlayerProps = {
  autoPlay?: boolean;
};

/**
 * Lofi Music Player Component
 * Uses royalty-free Lofi music from Pixabay Music (CC0 licensed)
 * Auto-loops continuously like Lofi Girl's stream
 */
export const MusicPlayer: React.FC<MusicPlayerProps> = ({ autoPlay = true }) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle mounting to avoid hydration issues
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
          // Auto-play blocked by browser (common on first visit)
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, isMounted]);

  const handleToggle = () => {
    setIsPlaying(!isPlaying);
  };

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
        preload="auto"
        src="https://cdn.pixabay.com/download/audio/2024/08/16/audio_8d88b67f5d.mp3"
      />
      <motion.button
        onClick={handleToggle}
        className="lofi-music-button"
        title={isPlaying ? "Pause music" : "Play music"}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <span className="lofi-music-icon">{isPlaying ? "⏸" : "▶"}</span>
      </motion.button>
      <span className="lofi-music-label">{isPlaying ? "ON" : "OFF"}</span>
    </motion.div>
  );
};
