/** Minimal, dependency-free Markdown -> HTML for the subset used by these docs. */

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Inline: code, bold, italic, links, <sub> passthrough. */
function inline(text) {
  let s = esc(text);
  // Restore intentional <sub> tags used for feature tags.
  s = s.replace(/&lt;sub&gt;/g, "<sub>").replace(/&lt;\/sub&gt;/g, "</sub>");
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    const to = href.replace(/\.md(#|$)/, ".html$1");
    return `<a href="${to}">${label}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  return s;
}

const splitRow = (line) =>
  line.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());

const alignOf = (cell) => {
  const l = cell.startsWith(":");
  const r = cell.endsWith(":");
  if (l && r) return " style=\"text-align:center\"";
  if (r) return " style=\"text-align:right\"";
  return "";
};

export function markdownToHtml(md) {
  const lines = md.split("\n");
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    // Table
    if (line.trim().startsWith("|") && lines[i + 1] && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      const head = splitRow(line);
      const aligns = splitRow(lines[i + 1]).map(alignOf);
      i += 2;
      const body = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        body.push(splitRow(lines[i]));
        i++;
      }
      const headHtml = head.some((h) => h !== "")
        ? `<thead><tr>${head.map((h, n) => `<th${aligns[n] || ""}>${inline(h)}</th>`).join("")}</tr></thead>`
        : "";
      const bodyHtml = body
        .map((r) => `<tr>${r.map((c, n) => `<td${aligns[n] || ""}>${inline(c)}</td>`).join("")}</tr>`)
        .join("");
      out.push(`<div class="table-wrap"><table>${headHtml}<tbody>${bodyHtml}</tbody></table></div>`);
      continue;
    }

    // Heading
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const id = h[2].toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
      out.push(`<h${level} id="${id}">${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith(">")) {
      const buf = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      out.push(`<blockquote>${inline(buf.join(" "))}</blockquote>`);
      continue;
    }

    // List
    if (/^\s*[-*]\s+/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      out.push(`<ul>${buf.map((b) => `<li>${inline(b)}</li>`).join("")}</ul>`);
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) { out.push("<hr>"); i++; continue; }

    // Paragraph
    const buf = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith(">") &&
      !lines[i].trim().startsWith("|") &&
      !/^\s*[-*]\s+/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    out.push(`<p>${inline(buf.join(" "))}</p>`);
  }

  return out.join("\n");
}

export function page({ title, body, depth = 0, nav = "", subtitle = "" }) {
  const up = "../".repeat(depth) || "./";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${subtitle || title} — D&D 5e (2014) class reference.">
<link rel="stylesheet" href="${up}style.css">
</head>
<body>
<header class="site-header">
  <a class="brand" href="${up}index.html">D&amp;D 5e Classes <span class="edition">2014</span></a>
  <button class="theme-toggle" id="theme-toggle" aria-label="Toggle colour scheme">◐</button>
</header>
${nav ? `<nav class="crumbs">${nav}</nav>` : ""}
<main>
${body}
</main>
<footer>
  <p>Generated from JSON source data. Class rules from the SRD are used under
  <a href="https://creativecommons.org/licenses/by/4.0/">CC-BY-4.0</a>; non-SRD subclasses are summarised
  in original wording with source citations, and are the property of Wizards of the Coast.
  This is an unofficial fan reference.</p>
</footer>
<script>
(function () {
  var key = "dnd-theme";
  var saved = localStorage.getItem(key);
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  document.getElementById("theme-toggle").addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme");
    var next = cur === "dark" ? "light" : cur === "light" ? "dark"
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(key, next);
  });
})();
</script>
</body>
</html>`;
}

export const STYLESHEET = `:root {
  --bg: #faf7f2;
  --surface: #ffffff;
  --text: #241f1a;
  --muted: #6b625a;
  --accent: #8a1c1c;
  --accent-soft: #f3e4e4;
  --border: #e0d8cc;
  --row-alt: #f6f2eb;
  --shadow: 0 1px 2px rgba(36,31,26,.06), 0 8px 24px rgba(36,31,26,.06);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #14110e;
    --surface: #1c1815;
    --text: #ece5db;
    --muted: #a1968a;
    --accent: #e0736b;
    --accent-soft: #33201f;
    --border: #322b25;
    --row-alt: #201b17;
    --shadow: none;
    color-scheme: dark;
  }
}
:root[data-theme="dark"] {
  --bg: #14110e;
  --surface: #1c1815;
  --text: #ece5db;
  --muted: #a1968a;
  --accent: #e0736b;
  --accent-soft: #33201f;
  --border: #322b25;
  --row-alt: #201b17;
  --shadow: none;
  color-scheme: dark;
}

* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font: 16px/1.65 "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
  -webkit-text-size-adjust: 100%;
}
main { max-width: 62rem; margin: 0 auto; padding: 1.5rem 1.25rem 4rem; }

.site-header {
  position: sticky; top: 0; z-index: 10;
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: .75rem 1.25rem;
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}
.brand {
  font-weight: 700; letter-spacing: .01em; color: var(--text); text-decoration: none;
  font-size: 1.05rem;
}
.brand .edition {
  font-size: .7rem; text-transform: uppercase; letter-spacing: .12em;
  color: var(--accent); border: 1px solid var(--accent); border-radius: 999px;
  padding: .1rem .45rem; margin-left: .4rem; vertical-align: 2px;
}
.theme-toggle {
  background: none; border: 1px solid var(--border); color: var(--muted);
  border-radius: 999px; width: 2rem; height: 2rem; cursor: pointer; font-size: .9rem;
}
.theme-toggle:hover { color: var(--accent); border-color: var(--accent); }

.crumbs {
  max-width: 62rem; margin: 0 auto; padding: .85rem 1.25rem 0;
  font-size: .85rem; color: var(--muted);
}
.crumbs a { color: var(--muted); }

h1 {
  font-size: clamp(2rem, 5vw, 2.9rem); line-height: 1.1; margin: .6rem 0 .3rem;
  letter-spacing: -.02em;
}
h2 {
  font-size: 1.5rem; margin: 2.5rem 0 .75rem; padding-bottom: .35rem;
  border-bottom: 2px solid var(--accent); color: var(--accent);
  letter-spacing: -.01em;
}
h3 { font-size: 1.15rem; margin: 1.75rem 0 .35rem; }
h3 + p em:first-child { color: var(--muted); }
p { margin: .7rem 0; }
a { color: var(--accent); text-decoration-thickness: 1px; text-underline-offset: 2px; }
sub { color: var(--muted); font-size: .75em; }
code {
  background: var(--accent-soft); padding: .1rem .3rem; border-radius: 3px;
  font-size: .9em; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
hr { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }

blockquote {
  margin: 1rem 0; padding: .75rem 1rem;
  border-left: 3px solid var(--accent); background: var(--accent-soft);
  border-radius: 0 6px 6px 0; font-size: 1.05rem;
}
ul { padding-left: 1.25rem; }
li { margin: .3rem 0; }

.table-wrap {
  overflow-x: auto; margin: 1rem 0;
  border: 1px solid var(--border); border-radius: 8px; background: var(--surface);
  box-shadow: var(--shadow);
}
table { border-collapse: collapse; width: 100%; font-size: .9rem; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }
thead th {
  background: var(--accent); color: #fff; text-align: left;
  padding: .55rem .7rem; font-weight: 600; font-size: .8rem;
  text-transform: uppercase; letter-spacing: .04em; white-space: nowrap;
}
td { padding: .5rem .7rem; border-top: 1px solid var(--border); vertical-align: top; }
tbody tr:nth-child(even) { background: var(--row-alt); }
tbody tr:hover { background: var(--accent-soft); }

/* Class index cards */
.class-grid {
  display: grid; gap: 1rem; margin: 1.5rem 0;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
}
.class-card {
  display: block; padding: 1rem 1.1rem; text-decoration: none; color: var(--text);
  background: var(--surface); border: 1px solid var(--border); border-radius: 10px;
  box-shadow: var(--shadow); transition: transform .12s ease, border-color .12s ease;
}
.class-card:hover { transform: translateY(-2px); border-color: var(--accent); }
.class-card h3 { margin: 0 0 .25rem; color: var(--accent); font-size: 1.2rem; }
.class-card p { margin: 0; font-size: .85rem; color: var(--muted); line-height: 1.5; }
.class-card .meta {
  margin-top: .6rem; font-size: .72rem; text-transform: uppercase;
  letter-spacing: .06em; color: var(--muted);
  font-family: system-ui, sans-serif;
}

footer {
  border-top: 1px solid var(--border); margin-top: 3rem; padding: 1.5rem 1.25rem 3rem;
  color: var(--muted); font-size: .8rem;
}
footer p { max-width: 62rem; margin: 0 auto; }

@media (max-width: 600px) {
  main { padding: 1rem 1rem 3rem; }
  table { font-size: .82rem; }
}
`;
