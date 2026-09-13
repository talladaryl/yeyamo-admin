import { mkdir, writeFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Compass, MapPin, Route, Heart, Users, Camera, ShieldCheck, LockKeyhole, Smartphone, Download, BookOpen, MessageCircle, Sparkles, Globe, Handshake, CircleHelp, Fingerprint, Search, Bookmark, Mountain, Leaf } from "lucide-react";

// Decorative vector artwork: each page has its own theme and colour palette.
const themes = {
  fonctionnalites: ["#143c49", "#368e91", Compass, Search, Bookmark],
  solutions: ["#42332a", "#ad7647", Route, MapPin, Handshake],
  profils: ["#393050", "#9474af", Users, Camera, Compass],
  destinations: ["#163d38", "#549a78", Mountain, MapPin, Leaf],
  communaute: ["#532a36", "#c27478", Users, Heart, MessageCircle],
  securite: ["#183947", "#4c94b2", ShieldCheck, LockKeyhole, Fingerprint],
  application: ["#25304b", "#6b85c4", Smartphone, MapPin, Heart],
  "a-propos": ["#453a27", "#ae945b", Globe, Heart, Sparkles],
  faq: ["#263d46", "#669bad", CircleHelp, MessageCircle, Search],
  telechargement: ["#493039", "#b86d82", Download, Smartphone, Sparkles],
  documentation: ["#203b3b", "#68988b", BookOpen, Bookmark, Compass],
  confidentialite: ["#302d47", "#8b80b4", LockKeyhole, Fingerprint, ShieldCheck],
};
const output = new URL("../public/backgrounds/", import.meta.url);
await mkdir(output, { recursive: true });
for (const [name, [base, accent, Main, First, Second]] of Object.entries(themes)) {
  const icon = (Icon, x, y, size, opacity = 1) => `<g transform="translate(${x} ${y})" opacity="${opacity}">${renderToStaticMarkup(createElement(Icon, { width: size, height: size, color: "#fff2df", strokeWidth: 1, "aria-hidden": true }))}</g>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="480" viewBox="0 0 1440 480" fill="none">
    <defs><linearGradient id="base"><stop stop-color="${base}"/><stop offset="1" stop-color="${accent}"/></linearGradient><radialGradient id="glow"><stop stop-color="#fff2df" stop-opacity=".22"/><stop offset="1" stop-color="#fff2df" stop-opacity="0"/></radialGradient><pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#fff2df" opacity=".14"/></pattern></defs>
    <path fill="url(#base)" d="M0 0h1440v480H0z"/><path fill="url(#dots)" d="M0 0h1440v480H0z"/>
    <ellipse cx="1110" cy="230" rx="390" ry="310" fill="url(#glow)"/>
    <g stroke="#fff2df" stroke-opacity=".13"><circle cx="1110" cy="240" r="170"/><circle cx="1110" cy="240" r="224"/><circle cx="1110" cy="240" r="300"/><path d="M0 430C400 210 540 570 890 340S1190 40 1440 140M0 452C400 232 540 592 890 362S1190 62 1440 162"/></g>
    <g transform="rotate(-8 1110 240)"><rect x="1000" y="130" width="220" height="220" rx="48" fill="${base}" fill-opacity=".35" stroke="#fff2df" stroke-opacity=".35"/>${icon(Main, 1042, 172, 136, .9)}</g>
    <rect x="880" y="74" width="88" height="88" rx="24" fill="${base}" fill-opacity=".4" stroke="#fff2df" stroke-opacity=".18"/>${icon(First, 904, 98, 40, .75)}
    <rect x="1270" y="326" width="88" height="88" rx="24" fill="${base}" fill-opacity=".4" stroke="#fff2df" stroke-opacity=".18"/>${icon(Second, 1294, 350, 40, .75)}
    <g fill="#fff2df"><circle cx="1270" cy="98" r="5" opacity=".8"/><circle cx="923" cy="351" r="4" opacity=".6"/><circle cx="1360" cy="220" r="3" opacity=".5"/></g>
  </svg>`;
  await writeFile(new URL(`${name}.svg`, output), svg);
}
