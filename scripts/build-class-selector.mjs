#!/usr/bin/env node
/**
 * Builds class-selector/README.md and class-selector/decision-tree.md from
 * class-selector/decision-tree.json.
 *   node scripts/build-class-selector.mjs
 *
 * The JSON only stores the questions, answer text, and which {class, subclass}
 * each path ends at. Every subclass's display name and one-line summary are
 * read live from classes/<class>/subclasses/<subclass>/subclass.json, so
 * nothing about a subclass is ever duplicated by hand.
 *
 * Validates while walking the tree: every question reference resolves, every
 * subclass in the dataset is reachable as exactly one leaf, and no leaf is
 * reused.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { ROOT, loadClasses } from "./lib/data.mjs";

const SELECTOR_DIR = join(ROOT, "class-selector");
const TREE_PATH = join(SELECTOR_DIR, "decision-tree.json");

const tree = JSON.parse(readFileSync(TREE_PATH, "utf8"));
const classes = loadClasses();

// class id -> { name, subclasses: Map<subclassId, subclass.json> }
const classIndex = new Map(
  classes.map((c) => [c._dir, { name: c.name, subclasses: new Map(c.subclassData.map((s) => [s.id, s])) }])
);

const allSubclassKeys = new Set();
for (const c of classes) for (const s of c.subclassData) allSubclassKeys.add(`${c._dir}/${s.id}`);

// ---- Walk + validate --------------------------------------------------
const seenLeaves = new Map(); // "class/subclass" -> question id that used it
const visitedQuestions = new Set();

function resolveLeaf(result, atQuestion) {
  const key = `${result.class}/${result.subclass}`;
  if (!allSubclassKeys.has(key)) {
    throw new Error(`Unknown subclass "${key}" referenced from question "${atQuestion}".`);
  }
  if (seenLeaves.has(key)) {
    throw new Error(`Subclass "${key}" is reachable from both "${seenLeaves.get(key)}" and "${atQuestion}".`);
  }
  seenLeaves.set(key, atQuestion);
  const cls = classIndex.get(result.class);
  const sub = cls.subclasses.get(result.subclass);
  return {
    classId: result.class,
    className: cls.name,
    subclassId: result.subclass,
    subclassName: sub.name,
    summary: sub.summary || "",
    path: `../classes/${result.class}/subclasses/${result.subclass}/README.md`,
  };
}

function walk(id) {
  if (visitedQuestions.has(id)) return; // diamonds are fine, cycles are not (guarded by JS call stack + this flag)
  visitedQuestions.add(id);
  const q = tree.questions[id];
  if (!q) throw new Error(`Question "${id}" is referenced but not defined.`);
  for (const opt of q.options) {
    if (opt.next) {
      if (!tree.questions[opt.next]) throw new Error(`Question "${id}" points to undefined question "${opt.next}".`);
      walk(opt.next);
    } else if (opt.result) {
      resolveLeaf(opt.result, id);
    } else {
      throw new Error(`Option "${opt.label}" under "${id}" has neither "next" nor "result".`);
    }
  }
}

walk(tree.start);

for (const id of Object.keys(tree.questions)) {
  if (!visitedQuestions.has(id)) throw new Error(`Question "${id}" is defined but unreachable from "${tree.start}".`);
}
const missing = [...allSubclassKeys].filter((k) => !seenLeaves.has(k));
if (missing.length) {
  throw new Error(`${missing.length} subclass(es) are missing from the decision tree: ${missing.join(", ")}`);
}

console.log(
  `Validated: ${visitedQuestions.size} questions, ${seenLeaves.size} leaves, covering all ${allSubclassKeys.size} subclasses.`
);

// ---- Render: README.md (prose guide) -----------------------------------
//
// GitHub-flavored Markdown does not support custom heading-anchor syntax
// (`{#id}`) — headings only get auto-generated anchors from their own text,
// and replicating that slugger reliably isn't worth the risk. So instead of
// jump-links this renders as a fully nested outline: every branch is a chapter
// with its own heading, and everything under it — every follow-up question
// down to the leaf — is one continuously-indented list. No links to break.

// Re-resolve for rendering only (validation pass above already proved these are all valid & unique).
function resolveLeafForRender(result) {
  const cls = classIndex.get(result.class);
  const sub = cls.subclasses.get(result.subclass);
  return {
    className: cls.name,
    subclassName: sub.name,
    summary: sub.summary || "",
    path: `../classes/${result.class}/subclasses/${result.subclass}/README.md`,
  };
}

// Renders the *options* of question `id` as a nested list at the given indent
// depth (0 = top level). Each option that leads to another question restates
// that question inline and recurses one level deeper; each option that leads
// to a leaf ends the branch with the class/subclass result.
function renderOptions(id, depth) {
  const pad = "  ".repeat(depth);
  const q = tree.questions[id];
  return q.options
    .map((opt) => {
      if (opt.next) {
        const target = tree.questions[opt.next];
        return `${pad}- *"${opt.label}"*\n${pad}  **${target.text}**\n${renderOptions(opt.next, depth + 1)}`;
      }
      const leaf = resolveLeafForRender(opt.result);
      const summary = leaf.summary ? ` — ${leaf.summary}` : "";
      return `${pad}- *"${opt.label}"* → **[${leaf.className} — ${leaf.subclassName}](${leaf.path})**${summary}`;
    })
    .join("\n");
}

function renderBranch(rootId) {
  const q = tree.questions[rootId];
  const count = countLeaves(rootId);
  return `## ${q.short} (${count} subclass${count === 1 ? "" : "es"})\n\n**${q.text}**\n\n${renderOptions(
    rootId,
    0
  )}`;
}

function countLeaves(id) {
  let n = 0;
  for (const opt of tree.questions[id].options) n += opt.next ? countLeaves(opt.next) : 1;
  return n;
}

const totalSubclasses = allSubclassKeys.size;
const totalClasses = classes.length;
const startQuestion = tree.questions[tree.start];
const branches = startQuestion.options.map((opt) => renderBranch(opt.next));

const readmeBody = `# Which Class Should I Play?

A branching questionnaire for first-time players. Read the first question below, pick whichever
answer feels truest to the character you're picturing, and follow it down through the nested
questions underneath — every path bottoms out at one specific class and subclass, out of all
**${totalSubclasses} subclasses** across **${totalClasses} classes** in this dataset.

Don't overthink it. If two answers both sound like you, pick either one — there's no wrong subclass,
only the one you haven't tried yet. Answers are grouped into six chapters below by first impression,
not by class — classes with a very different range of subclasses (Fighter, Barbarian, Cleric...) are
deliberately scattered across more than one chapter, so don't assume everyone who likes "a sword and
no magic" ends up playing the same character.

A visual version of this same tree — one diagram per chapter — is in
[decision-tree.md](decision-tree.md). Both files are generated from
[decision-tree.json](decision-tree.json) by \`scripts/build-class-selector.mjs\`; that JSON is the
only place this data is hand-maintained.

## ${startQuestion.short}

**${startQuestion.text}**

${startQuestion.options.map((opt) => `- *"${opt.label}"* → **${tree.questions[opt.next].short}**, below.`).join("\n")}

---

${branches.join("\n\n---\n\n")}
`;

// ---- Render: decision-tree.md (Mermaid diagrams) -----------------------
function mermaidId(id) {
  return id.replace(/[^a-zA-Z0-9]/g, "_");
}

function truncate(s, n) {
  return s.length <= n ? s : s.slice(0, n - 1).trimEnd() + "…";
}

function escapeLabel(s) {
  return s.replace(/"/g, "'");
}

// Render one flowchart starting at `rootId`, walking only forward (the tree
// is a DAG by construction — validated above), stopping at leaves.
function renderDiagram(rootId) {
  const lines = ["```mermaid", "flowchart TD"];
  const emittedNodes = new Set();
  const emittedEdges = new Set();

  function emitQuestionNode(id) {
    if (emittedNodes.has(id)) return;
    emittedNodes.add(id);
    const q = tree.questions[id];
    lines.push(`  ${mermaidId(id)}["${escapeLabel(q.short)}"]`);
  }

  function emitLeafNode(result, fromId, edgeLabel) {
    const leafKey = mermaidId(`leaf_${result.class}_${result.subclass}`);
    if (!emittedNodes.has(leafKey)) {
      emittedNodes.add(leafKey);
      const leaf = resolveLeafForRender(result);
      lines.push(`  ${leafKey}(["${escapeLabel(leaf.className)}: ${escapeLabel(leaf.subclassName)}"])`);
    }
    const edgeKey = `${fromId}->${leafKey}`;
    if (!emittedEdges.has(edgeKey)) {
      emittedEdges.add(edgeKey);
      lines.push(`  ${mermaidId(fromId)} -->|"${escapeLabel(truncate(edgeLabel, 42))}"| ${leafKey}`);
    }
  }

  function visit(id) {
    emitQuestionNode(id);
    const q = tree.questions[id];
    for (const opt of q.options) {
      if (opt.next) {
        emitQuestionNode(opt.next);
        const edgeKey = `${id}->${opt.next}`;
        if (!emittedEdges.has(edgeKey)) {
          emittedEdges.add(edgeKey);
          lines.push(
            `  ${mermaidId(id)} -->|"${escapeLabel(truncate(opt.label, 42))}"| ${mermaidId(opt.next)}`
          );
        }
        visit(opt.next);
      } else {
        emitLeafNode(opt.result, id, opt.label);
      }
    }
  }

  visit(rootId);
  lines.push("```");
  return lines.join("\n");
}

// The overview only shows the start question and the six branch roots it
// leads to (not the full expansion — that would just be every other diagram
// glued together). Each branch root is annotated with its leaf count.
function renderOverview() {
  const lines = ["```mermaid", "flowchart TD", `  ${mermaidId(tree.start)}["${escapeLabel(tree.questions[tree.start].short)}"]`];
  for (const opt of tree.questions[tree.start].options) {
    const target = tree.questions[opt.next];
    const count = countLeaves(opt.next);
    lines.push(`  ${mermaidId(opt.next)}["${escapeLabel(target.short)} (${count})"]`);
    lines.push(`  ${mermaidId(tree.start)} -->|"${escapeLabel(truncate(opt.label, 42))}"| ${mermaidId(opt.next)}`);
  }
  lines.push("```");
  return lines.join("\n");
}

const overviewDiagram = renderOverview();
const branchSections = tree.questions[tree.start].options.map((opt) => {
  const target = tree.questions[opt.next];
  const count = countLeaves(opt.next);
  return `## ${target.short} (${count} subclasses)\n\n${renderDiagram(opt.next)}`;
});

const diagramBody = `# Class Selector — Diagrams

The same questionnaire as [README.md](README.md), as Mermaid flowcharts (renders natively on
GitHub). The first diagram is the whole tree collapsed to its six top-level branches; the rest
break each branch out in full, down to every subclass leaf.

Generated from [decision-tree.json](decision-tree.json) — do not hand-edit.

## Overview

${overviewDiagram}

---

${branchSections.join("\n\n---\n\n")}
`;

mkdirSync(SELECTOR_DIR, { recursive: true });
writeFileSync(join(SELECTOR_DIR, "README.md"), readmeBody);
writeFileSync(join(SELECTOR_DIR, "decision-tree.md"), diagramBody);
console.log("Wrote class-selector/README.md and class-selector/decision-tree.md");
