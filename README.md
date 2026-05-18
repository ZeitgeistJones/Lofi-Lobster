# Lofi Lobster

A minimal, always-on pixel art scene where the CLAWD ecosystem breathes in real time.

Think Lofi Girl — but the world outside the window is the CLAWD blockchain. A cozy 8-bit desk scene with a live data monitor showing key CLAWD metrics, refreshing every 30 seconds.

## Live

**[https://bafybeifzeweansegq4tocnfaofar2piqzcfj7iyfpvvzkcw6gq3vebkkfi.ipfs.community.bgipfs.com/](https://bafybeifzeweansegq4tocnfaofar2piqzcfj7iyfpvvzkcw6gq3vebkkfi.ipfs.community.bgipfs.com/)**

Deployed to IPFS via [bgipfs](https://bgipfs.com). Censorship-resistant. No servers.

## What It Shows

| Metric | Source |
|--------|--------|
| **CLAWD Price** | DexScreener API (highest-liquidity pair) |
| **CLAWD Burned** | `100B - totalSupply()` from CLAWD token contract |
| **Jobs Built** | `nextJobId() - 1` from LeftClaw Services contract |
| **Total Supply** | `totalSupply()` from CLAWD token contract |

Data refreshes every 30 seconds. All contract reads use Base mainnet via viem.

## Contracts (Read-Only)

| Contract | Address | Chain |
|----------|---------|-------|
| CLAWD Token | [0x9f86dB9fc6f7c9408e8Fda3Ff8ce4e78ac7a6b07](https://basescan.org/address/0x9f86dB9fc6f7c9408e8Fda3Ff8ce4e78ac7a6b07) | Base |
| LeftClaw Services | [0xb2fb486a9569ad2c97d9c73936b46ef7fdaa413a](https://basescan.org/address/0xb2fb486a9569ad2c97d9c73936b46ef7fdaa413a) | Base |

No new contracts were deployed — this is a pure frontend reading existing CLAWD ecosystem contracts.

## Stack

- [Scaffold-ETH 2](https://scaffoldeth.io) — Next.js + Foundry starter
- [viem](https://viem.sh) — onchain reads
- [DexScreener API](https://dexscreener.com) — price data
- [bgipfs](https://bgipfs.com) — IPFS hosting

## Run Locally

```bash
cd packages/nextjs
yarn install
yarn start
```

Set `NEXT_PUBLIC_BASE_RPC` in `.env.local` for your own Alchemy key (optional — defaults to public Base RPC).

## Build for IPFS

```bash
cd packages/nextjs
NEXT_PUBLIC_IPFS_BUILD=true yarn build
npx bgipfs upload out
```

---

Built by [@clawdbotatg](https://github.com/clawdbotatg) · [leftclaw.services](https://leftclaw.services)
