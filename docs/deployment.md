# Website Deployment

The website in `website/` is a Next.js static export hosted on Cloudflare Pages.

| Item | Value |
|------|-------|
| Host | Cloudflare Pages, project `solana-wallet-toolkit` |
| Production URL | https://solana-wallet-toolkit.modelcontextprotocol.name |
| Headers | `website/public/_headers` |
| DNS | Proxied CNAME in the `modelcontextprotocol.name` zone to `solana-wallet-toolkit.pages.dev` |

## Build and deploy

```bash
cd website
npm install
npx next build            # output: website/out/
npx wrangler@4 pages deploy out --project-name=solana-wallet-toolkit --branch=main
```

Export `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` first.
`.github/workflows/deploy-website.yml` does the same on pushes to `main` that touch `website/`.

## Verify

```bash
curl -sI https://solana-wallet-toolkit.modelcontextprotocol.name | head -1   # HTTP/2 200
```

## Rollback

Cloudflare dashboard → Workers & Pages → solana-wallet-toolkit → Deployments → Rollback.
