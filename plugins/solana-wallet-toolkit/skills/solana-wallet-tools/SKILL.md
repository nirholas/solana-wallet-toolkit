---
name: solana-wallet-tools
description: Generate Solana keypairs and vanity addresses, sign and verify messages, validate addresses and restore keypairs with the solana-wallet-toolkit MCP server. Use when asked to create a throwaway wallet, grind a vanity prefix or suffix, or check a signature.
---

# Solana wallet toolkit

The plugin starts the `solana-wallet-toolkit-mcp` npm package over stdio (`npx -y solana-wallet-toolkit-mcp`). It needs no API keys and no network access: keys are generated locally with `@solana/web3.js`.

## Tools

| Tool | Arguments | What it does |
|---|---|---|
| `generate_keypair` | `saveId` (optional) | New keypair. Returns the public key and the secret key as Base58 |
| `generate_vanity` | `prefix`, `suffix` (at least one, Base58 characters only), `caseInsensitive` (default false), `timeout` (seconds, 1 to 300, default 60), `saveId` | Searches in-process until the address matches or the timeout passes |
| `estimate_vanity_time` | `prefix`, `suffix`, `caseInsensitive` | Estimates how long a pattern takes |
| `sign_message` | `message` (required), `keypairId` or `privateKey` | Signs a message |
| `verify_signature` | `message`, `signature` (Base58), `publicKey` (all required) | Verifies a signature |
| `validate_address` | `address` (required) | Checks Solana address format |
| `restore_keypair` | `seedPhrase` (12 or 24 words) or `privateKey` (Base58), `saveId` | Rebuilds a keypair |

A `saveId` keeps the keypair in server memory for the session so later calls can pass `keypairId`. Nothing is written to disk.

## Secret handling

`generate_keypair`, `generate_vanity` and `restore_keypair` return the secret key as text, which means it enters the conversation transcript. Treat every key made this way as exposed to anything that can read the session. Use it for throwaway wallets, tests and devnet. Do not restore a real wallet's seed phrase or private key through these tools, and never paste one into a prompt. Never print a secret key back to the user unless they asked for it.

## Worked example

Ask: "Make me a devnet wallet whose address starts with `So1`, and prove I control it."

1. `estimate_vanity_time` with `{"prefix": "So1"}` to set expectations. Longer patterns grow about 58 times slower per added character.
2. `generate_vanity` with `{"prefix": "So1", "caseInsensitive": false, "timeout": 120, "saveId": "devnet-main"}`.
3. `sign_message` with `{"message": "I control this wallet", "keypairId": "devnet-main"}`.
4. `verify_signature` with the message, the signature returned in step 3 and the public key from step 2.

If `generate_vanity` times out, raise `timeout` up to 300, shorten the pattern, or set `caseInsensitive` to true.

## Other pieces in the repo

The repo also has a TypeScript library with a CLI (npm package `solana-vanity-ts`, source in `typescript/`) and a Rust implementation in `rust/` that uses all CPU cores. Both are better than the MCP tool for long grinds. Read `typescript/README.md` and `rust/README.md` before using them.
