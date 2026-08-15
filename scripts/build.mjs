#!/usr/bin/env node
/**
 * Builds docs/ from the JSON in classes/.
 *   node scripts/build.mjs
 * Emits, for every class: a Markdown page and a matching HTML page, plus one of
 * each per subclass, plus a site index and stylesheet.
 */
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { loadClasses, DOCS_DIR, CLASSES_DIR, spellTables, sourceName } from "./lib/data.mjs";
import { classMarkdown, subclassMarkdown, indexMarkdown } from "./lib/markdown.mjs";
import { classReadme, subclassReadme, classesIndexReadme } from "./lib/readme.mjs";
import { markdownToHtml, page, STYLESHEET } from "./lib/html.mjs";

const classes = loadClasses();
if (!classes.length) {
  console.error("No classes found in classes/. Nothing to build.");
  process.exit(1);
}

rmSync(DOCS_DIR, { recursive: true, force: true });
mkdirSync(DOCS_DIR, { recursive: true });

const write = (path, content) => {
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, content);
};

// ---- Stylesheet + Pages config -------------------------------------------
write(join(DOCS_DIR, "style.css"), STYLESHEET);
write(join(DOCS_DIR, ".nojekyll"), "");

// ---- Index ----------------------------------------------------------------
const indexMd = indexMarkdown(classes);
write(join(DOCS_DIR, "index.md"), indexMd);

const cards = classes
  .map((c) => {
    const caster = c.spellcasting ? spellTables.tables[c.spellcasting.slotTable].name : "Non-caster";
    return `<a class="class-card" href="classes/${c.id}/index.html">
  <h3>${c.name}</h3>
  <p>${c.summary || ""}</p>
  <div class="meta">${c.hitDice} · ${caster} · ${c.subclassData.length} subclasses</div>
</a>`;
  })
  .join("\n");

const totalSubs = classes.reduce((n, c) => n + c.subclassData.length, 0);
const indexBody = `<h1>D&amp;D 5e Classes</h1>
<p>A complete reference for every playable class and subclass in fifth edition using the
<strong>2014 rules</strong> — the <em>Player's Handbook</em> plus all official expanded content.</p>
<p><strong>${classes.length} classes · ${totalSubs} subclasses</strong></p>
<div class="class-grid">
${cards}
</div>
${markdownToHtml(
  indexMd
    .split("| Class | Hit Die")
    .slice(1)
    .map((s) => "| Class | Hit Die" + s)
    .join("")
)}`;

write(join(DOCS_DIR, "index.html"), page({ title: "D&D 5e Classes (2014)", body: indexBody, depth: 0 }));

// ---- Class + subclass pages ----------------------------------------------
let pageCount = 2;
for (const cls of classes) {
  const dir = join(DOCS_DIR, "classes", cls.id);
  const md = classMarkdown(cls);
  write(join(dir, "index.md"), md);
  write(
    join(dir, "index.html"),
    page({
      title: `${cls.name} — D&D 5e (2014)`,
      subtitle: cls.summary,
      body: markdownToHtml(md),
      depth: 2,
      nav: `<a href="../../index.html">All Classes</a> / <strong>${cls.name}</strong>`,
    })
  );
  pageCount += 2;

  for (const sub of cls.subclassData) {
    const smd = subclassMarkdown(sub, cls);
    write(join(dir, `${sub.id}.md`), smd);
    write(
      join(dir, `${sub.id}.html`),
      page({
        title: `${sub.name} — ${cls.name}`,
        subtitle: sub.summary,
        body: markdownToHtml(smd),
        depth: 2,
        nav: `<a href="../../index.html">All Classes</a> / <a href="index.html">${cls.name}</a> / <strong>${sub.name}</strong>`,
      })
    );
    pageCount += 2;
  }
}

// ---- Browsable READMEs in the source tree ---------------------------------
// Unlike docs/, classes/ holds the JSON source, so only README.md files are
// touched here — never a blind rmSync.
let readmeCount = 1;
write(join(CLASSES_DIR, "README.md"), classesIndexReadme(classes));
for (const cls of classes) {
  write(join(CLASSES_DIR, cls._dir, "README.md"), classReadme(cls));
  readmeCount++;
  for (const sub of cls.subclassData) {
    write(join(CLASSES_DIR, cls._dir, "subclasses", sub.id, "README.md"), subclassReadme(sub, cls));
    readmeCount++;
  }
}

console.log(
  `Built ${classes.length} classes and ${totalSubs} subclasses → ${pageCount} files in docs/, ` +
    `${readmeCount} README.md files in classes/`
);
for (const c of classes) {
  const expected = (c.subclasses || []).length;
  const actual = c.subclassData.length;
  const flag = expected === actual ? "  " : "!!";
  console.log(`${flag} ${c.name.padEnd(12)} ${String(actual).padStart(2)} subclasses` +
    (expected === actual ? "" : ` (index lists ${expected})`));
}
