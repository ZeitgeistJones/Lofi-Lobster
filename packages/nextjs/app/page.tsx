"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { NextPage } from "next";
import { createPublicClient, formatUnits, http } from "viem";
import { base } from "viem/chains";
import { AnimatedNumber } from "~~/components/AnimatedNumber";
import { MusicPlayer } from "~~/components/MusicPlayer";

const CLAWD_ADDRESS = "0x9f86dB9fc6f7c9408e8Fda3Ff8ce4e78ac7a6b07" as const;
const LEFTCLAW_ADDRESS = "0xb2fb486a9569ad2c97d9c73936b46ef7fdaa413a" as const;
const MAX_SUPPLY = 100_000_000_000n * 10n ** 18n;

const TOTAL_SUPPLY_ABI = [
  {
    name: "totalSupply",
    type: "function",
    inputs: [],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
] as const;

const NEXT_JOB_ID_ABI = [
  {
    name: "nextJobId",
    type: "function",
    inputs: [],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
] as const;

const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_BASE_RPC || "https://mainnet.base.org"),
});

const formatBurned = (burned: bigint): string => {
  const burnedTokens = Number(formatUnits(burned, 18));
  if (burnedTokens >= 1_000_000_000) {
    return `${(burnedTokens / 1_000_000_000).toFixed(2)}B`;
  }
  if (burnedTokens >= 1_000_000) {
    return `${(burnedTokens / 1_000_000).toFixed(2)}M`;
  }
  if (burnedTokens >= 1_000) {
    return `${(burnedTokens / 1_000).toFixed(2)}K`;
  }
  return burnedTokens.toFixed(0);
};

const formatPrice = (price: string | number): string => {
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (!isFinite(num) || num <= 0) return "--";
  if (num < 0.0001) return `$${num.toFixed(8)}`;
  if (num < 0.01) return `$${num.toFixed(6)}`;
  if (num < 1) return `$${num.toFixed(4)}`;
  return `$${num.toFixed(2)}`;
};

type ClawdData = {
  price: string;
  burned: string;
  totalJobs: string;
  totalSupply: string;
  loading: boolean;
  lastUpdated: Date | null;
};

const INITIAL_DATA: ClawdData = {
  price: "--",
  burned: "--",
  totalJobs: "--",
  totalSupply: "--",
  loading: true,
  lastUpdated: null,
};

const Home: NextPage = () => {
  const [data, setData] = useState<ClawdData>(INITIAL_DATA);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      const updates: Partial<ClawdData> = {
        loading: false,
        lastUpdated: new Date(),
      };

      const [supplyResult, jobIdResult, priceResult] = await Promise.allSettled([
        publicClient.readContract({
          address: CLAWD_ADDRESS,
          abi: TOTAL_SUPPLY_ABI,
          functionName: "totalSupply",
        }),
        publicClient.readContract({
          address: LEFTCLAW_ADDRESS,
          abi: NEXT_JOB_ID_ABI,
          functionName: "nextJobId",
        }),
        fetch(`https://api.dexscreener.com/latest/dex/tokens/${CLAWD_ADDRESS}`)
          .then(r => r.json())
          .catch(() => null),
      ]);

      if (supplyResult.status === "fulfilled") {
        const totalSupply = supplyResult.value as bigint;
        const burned = MAX_SUPPLY - totalSupply;
        updates.burned = `${formatBurned(burned)} CLAWD`;
        const supplyTokens = Number(formatUnits(totalSupply, 18));
        updates.totalSupply = supplyTokens.toLocaleString(undefined, { maximumFractionDigits: 0 });
      }

      if (jobIdResult.status === "fulfilled") {
        const totalJobs = Number(jobIdResult.value as bigint) - 1;
        updates.totalJobs = totalJobs >= 0 ? totalJobs.toLocaleString() : "--";
      }

      if (priceResult.status === "fulfilled" && priceResult.value) {
        const pairs = priceResult.value?.pairs as
          | Array<{ priceUsd?: string; liquidity?: { usd?: number } }>
          | undefined;
        if (pairs && pairs.length > 0) {
          const best = [...pairs].sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0];
          if (best?.priceUsd) {
            updates.price = formatPrice(best.priceUsd);
          }
        }
      }

      if (!cancelled) {
        setData(prev => ({ ...prev, ...updates }));
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const liveLabel = data.lastUpdated
    ? `LIVE ${data.lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : data.loading
      ? "LOADING"
      : "LIVE";

  return (
    <div className="lofi-root">
      <div className="lofi-scene">
        <div className="lofi-header">
          <div className="lofi-title">LOFI LOBSTER</div>
          <div className="lofi-header-actions">
            <div className="lofi-live">
              <span className="lofi-dot" />
              {liveLabel}
            </div>
            <MusicPlayer />
          </div>
        </div>

        <motion.div
          className="lofi-stage"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="lofi-room"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="lofi-window">
              <div className="lofi-sky">
                <div className="lofi-star lofi-star-1" />
                <div className="lofi-star lofi-star-2" />
                <div className="lofi-star lofi-star-3" />
                <div className="lofi-star lofi-star-4" />
                <div className="lofi-star lofi-star-5" />
                <div className="lofi-moon" />
              </div>
              <div className="lofi-window-frame-h" />
              <div className="lofi-window-frame-v" />
            </div>

            <div className="lofi-desk">
              <div className="lofi-lamp">
                <div className="lofi-lamp-glow" />
                <div className="lofi-lamp-head" />
                <div className="lofi-lamp-arm" />
                <div className="lofi-lamp-base" />
              </div>

              <div className="lofi-cup">
                <div className="lofi-steam lofi-steam-1" />
                <div className="lofi-steam lofi-steam-2" />
                <div className="lofi-cup-body" />
                <div className="lofi-cup-handle" />
              </div>

              <div className="lofi-lobster" aria-label="pixel lobster">
                <div className="lofi-lob-claw-l" />
                <div className="lofi-lob-claw-r" />
                <div className="lofi-lob-body" />
                <div className="lofi-lob-tail" />
                <div className="lofi-lob-eye-l" />
                <div className="lofi-lob-eye-r" />
              </div>

              <div className="lofi-desk-top" />
              <div className="lofi-desk-leg lofi-desk-leg-l" />
              <div className="lofi-desk-leg lofi-desk-leg-r" />
            </div>
          </motion.div>

          <motion.div
            className="lofi-monitor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="lofi-monitor-screen">
              {data.loading && (
                <motion.div
                  className="lofi-loading-indicator"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="lofi-loading-pulse" />
                  <span className="lofi-loading-text">FETCHING...</span>
                </motion.div>
              )}
              <motion.div
                className="lofi-panel lofi-panel-interactive"
                whileHover={{ scale: 1.02, x: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="lofi-panel-label">PRICE</div>
                <AnimatedNumber value={data.price} className="lofi-panel-value lofi-glow-green" />
              </motion.div>
              <div className="lofi-panel-divider" />
              <motion.div
                className="lofi-panel lofi-panel-interactive"
                whileHover={{ scale: 1.02, x: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="lofi-panel-label">BURNED</div>
                <AnimatedNumber value={data.burned} className="lofi-panel-value lofi-glow-orange" />
              </motion.div>
              <div className="lofi-panel-divider" />
              <motion.div
                className="lofi-panel lofi-panel-interactive"
                whileHover={{ scale: 1.02, x: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="lofi-panel-label">JOBS BUILT</div>
                <AnimatedNumber value={data.totalJobs} className="lofi-panel-value lofi-glow-green" />
              </motion.div>
              <div className="lofi-panel-divider" />
              <motion.div
                className="lofi-panel lofi-panel-interactive"
                whileHover={{ scale: 1.02, x: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="lofi-panel-label">SUPPLY</div>
                <AnimatedNumber value={data.totalSupply} className="lofi-panel-value lofi-glow-purple" />
              </motion.div>
              <div className="lofi-cursor">
                <span className="lofi-prompt">{">"}</span>
                <span className="lofi-blink">_</span>
              </div>
            </div>
            <div className="lofi-monitor-stand" />
            <div className="lofi-monitor-base" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
