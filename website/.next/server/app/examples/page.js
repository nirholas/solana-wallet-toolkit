(()=>{var e={};e.id=668,e.ids=[668],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},2065:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>i.a,__next_app__:()=>x,originalPathname:()=>p,pages:()=>c,routeModule:()=>m,tree:()=>d}),r(4823),r(310),r(5866);var s=r(3191),a=r(8716),o=r(7922),i=r.n(o),n=r(5231),l={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>n[e]);r.d(t,l);let d=["",{children:["examples",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,4823)),"/workspaces/solana-wallet-toolkit/website/src/app/examples/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,310)),"/workspaces/solana-wallet-toolkit/website/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,5866,23)),"next/dist/client/components/not-found-error"]}],c=["/workspaces/solana-wallet-toolkit/website/src/app/examples/page.tsx"],p="/examples/page",x={require:r,loadChunk:()=>Promise.resolve()},m=new s.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/examples/page",pathname:"/examples",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},5464:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,2994,23)),Promise.resolve().then(r.t.bind(r,6114,23)),Promise.resolve().then(r.t.bind(r,9727,23)),Promise.resolve().then(r.t.bind(r,9671,23)),Promise.resolve().then(r.t.bind(r,1868,23)),Promise.resolve().then(r.t.bind(r,4759,23))},9082:(e,t,r)=>{Promise.resolve().then(r.bind(r,4261))},3254:(e,t,r)=>{Promise.resolve().then(r.bind(r,4780)),Promise.resolve().then(r.bind(r,5263)),Promise.resolve().then(r.bind(r,4609))},4261:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>i});var s=r(326),a=r(7577);let o=[{id:"rust-basic",lang:"rust",title:"Rust — Basic Generation",code:`use solana_sdk::signer::keypair::Keypair;
use solana_sdk::signer::Signer;

fn main() {
    let keypair = Keypair::new();
    let pubkey = keypair.pubkey();
    println!("Address: {}", pubkey);
    println!("Secret key: {:?}", keypair.to_bytes());
}`},{id:"rust-vanity",lang:"rust",title:"Rust — Vanity Address",code:`use solana_sdk::signer::keypair::Keypair;
use solana_sdk::signer::Signer;

fn find_vanity(prefix: &str) -> Keypair {
    loop {
        let keypair = Keypair::new();
        let addr = keypair.pubkey().to_string();
        if addr.starts_with(prefix) {
            return keypair;
        }
    }
}

fn main() {
    let kp = find_vanity("Sol");
    println!("Found: {}", kp.pubkey());
}`},{id:"rust-multithreaded",lang:"rust",title:"Rust — Multi-threaded Mining",code:`use solana_sdk::signer::keypair::Keypair;
use solana_sdk::signer::Signer;
use std::sync::{Arc, atomic::{AtomicBool, Ordering}};
use std::thread;

fn main() {
    let found = Arc::new(AtomicBool::new(false));
    let threads: Vec<_> = (0..num_cpus::get()).map(|_| {
        let found = found.clone();
        thread::spawn(move || {
            while !found.load(Ordering::Relaxed) {
                let kp = Keypair::new();
                if kp.pubkey().to_string().starts_with("Sol") {
                    found.store(true, Ordering::Relaxed);
                    println!("Found: {}", kp.pubkey());
                    return Some(kp);
                }
            }
            None
        })
    }).collect();

    for t in threads { t.join().ok(); }
}`},{id:"ts-basic",lang:"typescript",title:"TypeScript — Basic Generation",code:`import { Keypair } from '@solana/web3.js';

const keypair = Keypair.generate();
console.log('Address:', keypair.publicKey.toBase58());
console.log('Secret key:', JSON.stringify(Array.from(keypair.secretKey)));`},{id:"ts-vanity",lang:"typescript",title:"TypeScript — Vanity Address",code:`import { Keypair } from '@solana/web3.js';

function findVanity(prefix: string): Keypair {
  let attempts = 0;
  while (true) {
    const kp = Keypair.generate();
    attempts++;
    if (kp.publicKey.toBase58().startsWith(prefix)) {
      console.log(\`Found in \${attempts} attempts\`);
      return kp;
    }
  }
}

const wallet = findVanity('So1');
console.log('Address:', wallet.publicKey.toBase58());`},{id:"ts-sign",lang:"typescript",title:"TypeScript — Sign & Verify",code:`import { Keypair } from '@solana/web3.js';
import * as nacl from 'tweetnacl';

const keypair = Keypair.generate();
const message = new TextEncoder().encode('Hello, Solana!');

// Sign
const signature = nacl.sign.detached(message, keypair.secretKey);
console.log('Signature:', Buffer.from(signature).toString('hex'));

// Verify
const isValid = nacl.sign.detached.verify(
  message, signature, keypair.publicKey.toBytes()
);
console.log('Valid:', isValid); // true`},{id:"ts-restore",lang:"typescript",title:"TypeScript — Restore Keypair",code:`import { Keypair } from '@solana/web3.js';
import * as fs from 'fs';

// From JSON file (Solana CLI format)
const secretKey = JSON.parse(fs.readFileSync('wallet.json', 'utf-8'));
const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
console.log('Restored address:', keypair.publicKey.toBase58());`},{id:"bash-gen",lang:"bash",title:"Shell — Generate & Verify",code:`#!/bin/bash
# Generate a vanity wallet
./scripts/generate-vanity.sh Sol

# Verify the generated keypair
./scripts/verify-keypair.sh ./keys/SolXXX.json

# Batch generate
./scripts/batch-generate.sh --prefix Sol --count 5`}];function i(){let[e,t]=(0,a.useState)("all"),[r,i]=(0,a.useState)(null),n="all"===e?o:o.filter(t=>t.lang===e);return(0,s.jsxs)("div",{className:"max-w-4xl mx-auto px-4 sm:px-6 py-8",children:[s.jsx("h1",{className:"text-2xl sm:text-3xl font-bold text-gradient mb-2",children:"Code Examples"}),s.jsx("p",{className:"text-sm text-muted-foreground mb-6",children:"Copy-paste code snippets for integrating Solana wallet generation into your project."}),s.jsx("div",{className:"flex gap-1 mb-6",children:[{id:"all",label:"All"},{id:"rust",label:"Rust"},{id:"typescript",label:"TypeScript"},{id:"bash",label:"Shell"}].map(r=>s.jsx("button",{onClick:()=>t(r.id),className:`px-3 py-1.5 text-xs sm:text-sm font-medium rounded transition-all ${e===r.id?"bg-white text-black":"text-muted-foreground hover:text-white hover:bg-dark-700"}`,children:r.label},r.id))}),s.jsx("div",{className:"space-y-6",children:n.map(e=>(0,s.jsxs)("div",{className:"border border-border rounded-lg overflow-hidden",children:[(0,s.jsxs)("div",{className:"flex items-center justify-between px-4 py-2 bg-dark-800 border-b border-border",children:[(0,s.jsxs)("div",{className:"flex items-center gap-2",children:[s.jsx("span",{className:`px-1.5 py-0.5 text-[10px] font-bold rounded uppercase ${"rust"===e.lang?"bg-orange-500/20 text-orange-400":"typescript"===e.lang?"bg-blue-500/20 text-blue-400":"bg-green-500/20 text-green-400"}`,children:e.lang}),s.jsx("span",{className:"text-sm font-medium text-white",children:e.title})]}),s.jsx("button",{onClick:()=>{var t,r;return t=e.id,r=e.code,void(navigator.clipboard.writeText(r).catch(()=>{}),i(t),setTimeout(()=>i(null),1500))},className:"px-2 py-1 text-xs border border-border rounded hover:bg-dark-700 transition-colors text-muted-foreground hover:text-white",children:r===e.id?"✓ Copied":"Copy"})]}),s.jsx("pre",{className:"p-4 overflow-x-auto font-mono text-xs text-muted-foreground leading-relaxed",children:e.code})]},e.id))})]})}},4780:(e,t,r)=>{"use strict";r.d(t,{Navigation:()=>c});var s=r(326),a=r(434),o=r(5047),i=r(7577),n=r(1135),l=r(4609);let d=[{href:"/",label:"Home"},{href:"/tools",label:"Tools"},{href:"/docs",label:"Docs"},{href:"/examples",label:"Examples"},{href:"/mcp",label:"MCP"}];function c(){let e=(0,o.usePathname)(),[t,r]=(0,i.useState)(!1);return(0,s.jsxs)("nav",{className:"relative z-50 border-b border-border bg-black/80 backdrop-blur-md",children:[(0,s.jsxs)("div",{className:"max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between",children:[s.jsx(a.default,{href:"/",className:"flex items-center gap-2 group",children:(0,s.jsxs)("span",{className:"text-lg font-semibold tracking-tight",children:[s.jsx("span",{className:"text-solana",children:"◎"})," ",s.jsx("span",{className:"text-white group-hover:text-gradient-solana transition-all",children:"Solana Wallet Toolkit"})]})}),(0,s.jsxs)("div",{className:"hidden sm:flex items-center gap-1",children:[d.map(t=>s.jsx(a.default,{href:t.href,className:(0,n.W)("px-3 py-1.5 text-sm rounded transition-colors",e===t.href?"text-white bg-dark-600":"text-muted-foreground hover:text-white hover:bg-dark-700"),children:t.label},t.href)),s.jsx("a",{href:"https://github.com/nirholas/solana-wallet-toolkit",target:"_blank",rel:"noopener noreferrer",className:"ml-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-white transition-colors",children:"GitHub"}),s.jsx(l.T,{})]}),s.jsx("button",{onClick:()=>r(!t),className:"sm:hidden p-2 text-muted-foreground hover:text-white",children:s.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:t?s.jsx("path",{d:"M5 5L15 15M15 5L5 15",stroke:"currentColor",strokeWidth:"1.5"}):(0,s.jsxs)(s.Fragment,{children:[s.jsx("path",{d:"M3 5H17",stroke:"currentColor",strokeWidth:"1.5"}),s.jsx("path",{d:"M3 10H17",stroke:"currentColor",strokeWidth:"1.5"}),s.jsx("path",{d:"M3 15H17",stroke:"currentColor",strokeWidth:"1.5"})]})})})]}),t&&s.jsx("div",{className:"sm:hidden border-t border-border bg-black/95 backdrop-blur-md",children:(0,s.jsxs)("div",{className:"px-4 py-3 space-y-1",children:[d.map(t=>s.jsx(a.default,{href:t.href,onClick:()=>r(!1),className:(0,n.W)("block px-3 py-2 text-sm rounded transition-colors",e===t.href?"text-white bg-dark-600":"text-muted-foreground hover:text-white"),children:t.label},t.href)),s.jsx("a",{href:"https://github.com/nirholas/solana-wallet-toolkit",target:"_blank",rel:"noopener noreferrer",className:"block px-3 py-2 text-sm text-muted-foreground hover:text-white",children:"GitHub ↗"})]})})]})}},5263:(e,t,r)=>{"use strict";function s(){return null}r.d(t,{ServiceWorkerRegistrar:()=>s}),r(7577)},4609:(e,t,r)=>{"use strict";r.d(t,{T:()=>n,ThemeProvider:()=>i});var s=r(326),a=r(7577);let o=(0,a.createContext)({theme:"dark",toggle:()=>{}});function i({children:e}){let[t,r]=(0,a.useState)("dark");return s.jsx(o.Provider,{value:{theme:t,toggle:function(){let e="dark"===t?"light":"dark";r(e),localStorage.setItem("swt-theme",e),document.documentElement.classList.toggle("light","light"===e),document.documentElement.classList.toggle("dark","dark"===e)}},children:e})}function n(){let{theme:e,toggle:t}=(0,a.useContext)(o);return s.jsx("button",{onClick:t,className:"p-1.5 text-muted-foreground hover:text-white border border-border rounded transition-colors",title:`Switch to ${"dark"===e?"light":"dark"} mode`,children:"dark"===e?(0,s.jsxs)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[s.jsx("circle",{cx:"12",cy:"12",r:"5"}),s.jsx("path",{d:"M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"})]}):s.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:s.jsx("path",{d:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"})})})}},4823:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>s});let s=(0,r(8570).createProxy)(String.raw`/workspaces/solana-wallet-toolkit/website/src/app/examples/page.tsx#default`)},310:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>c,metadata:()=>d});var s=r(9510);r(5023);var a=r(8570);let o=(0,a.createProxy)(String.raw`/workspaces/solana-wallet-toolkit/website/src/components/Navigation.tsx#Navigation`);function i(){return s.jsx("footer",{className:"relative z-10 border-t border-border bg-black/80",children:(0,s.jsxs)("div",{className:"max-w-6xl mx-auto px-4 sm:px-6 py-8",children:[(0,s.jsxs)("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-4",children:[(0,s.jsxs)("div",{className:"text-sm text-muted-foreground",children:[s.jsx("span",{className:"text-solana",children:"◎"})," Solana Wallet Toolkit — Uses only official"," ",s.jsx("a",{href:"https://github.com/solana-labs",target:"_blank",rel:"noopener noreferrer",className:"text-white hover:text-solana transition-colors",children:"Solana Labs"})," ","libraries"]}),(0,s.jsxs)("div",{className:"flex items-center gap-4 text-sm text-muted-foreground",children:[s.jsx("a",{href:"https://github.com/nirholas/solana-wallet-toolkit",target:"_blank",rel:"noopener noreferrer",className:"hover:text-white transition-colors",children:"GitHub"}),s.jsx("span",{className:"text-border",children:"|"}),s.jsx("span",{children:"MIT License"}),s.jsx("span",{className:"text-border",children:"|"}),s.jsx("a",{href:"https://x.com/nichxbt",target:"_blank",rel:"noopener noreferrer",className:"hover:text-white transition-colors",children:"@nichxbt"})]})]}),s.jsx("div",{className:"mt-4 pt-4 border-t border-border text-center",children:s.jsx("p",{className:"text-xs text-muted",children:"Educational tool for understanding Solana wallet mechanics. Not financial advice. Use at your own risk."})})]})})}let n=(0,a.createProxy)(String.raw`/workspaces/solana-wallet-toolkit/website/src/components/ThemeProvider.tsx#ThemeProvider`);(0,a.createProxy)(String.raw`/workspaces/solana-wallet-toolkit/website/src/components/ThemeProvider.tsx#useTheme`),(0,a.createProxy)(String.raw`/workspaces/solana-wallet-toolkit/website/src/components/ThemeProvider.tsx#ThemeToggle`);let l=(0,a.createProxy)(String.raw`/workspaces/solana-wallet-toolkit/website/src/components/ServiceWorkerRegistrar.tsx#ServiceWorkerRegistrar`),d={title:"Solana Wallet Toolkit",description:"Secure, auditable toolkit for Solana wallet generation and vanity addresses — using only official Solana Labs libraries.",keywords:["solana","wallet","vanity address","keypair","ed25519","cryptocurrency","blockchain"]};function c({children:e}){return(0,s.jsxs)("html",{lang:"en",className:"dark",suppressHydrationWarning:!0,children:[(0,s.jsxs)("head",{children:[s.jsx("link",{rel:"manifest",href:"/manifest.json"}),s.jsx("meta",{name:"theme-color",content:"#9945FF"})]}),s.jsx("body",{className:"min-h-screen bg-black text-white antialiased dark:bg-black dark:text-white",children:(0,s.jsxs)("div",{className:"relative min-h-screen flex flex-col",children:[s.jsx("div",{className:"fixed inset-0 bg-grid opacity-100 pointer-events-none"}),s.jsx("div",{className:"fixed inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none"}),(0,s.jsxs)(n,{children:[s.jsx(o,{}),s.jsx("main",{className:"relative z-10 flex-1",children:e}),s.jsx(i,{}),s.jsx(l,{})]})]})})]})}},5023:()=>{}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[359],()=>r(2065));module.exports=s})();