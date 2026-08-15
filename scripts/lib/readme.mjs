/**
 * Browsable README.md pages for the source tree (classes/…), written in the
 * style of a wiki class page: everything you need to build the class on one
 * page, with links out to each subclass folder.
 *
 * These differ from the docs/ pages in that their links follow the *repo*
 * layout (subclasses live in subclasses/<id>/README.md, not <id>.md) and they
 * lead with a build walkthrough rather than reference text.
 */
import { ordinal, sourceName, spellTables, fightingStyles } from "./data.mjs";
import { progressionTable, featureList } from "./markdown.mjs";

const list = (arr) => (arr && arr.length ? arr.join(", ") : "None");

/** Safe for a Markdown table cell: no raw pipes, no hard line breaks. */
const cell = (s) => String(s).replace(/\|/g, "\\|").replace(/\n+/g, "<br>");

/** First sentence, trimmed to something that fits in a table. */
function gist(text, max = 150) {
  const flat = text.replace(/\s+/g, " ").trim();
  const stop = flat.search(/\.\s|\.$/);
  let s = stop > 0 ? flat.slice(0, stop + 1) : flat;
  if (s.length > max) s = s.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
  return s;
}

/** First paragraph of running prose — skips embedded tables and bullet lists. */
const firstProse = (text) =>
  text
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .find((s) => s && !/^[-*|>#]/.test(s)) || "";

/** The first sentence matching `re`, falling back to the whole text. */
function pickSentence(text, re) {
  const flat = text.replace(/\s+/g, " ").trim();
  const hit = flat.split(/(?<=\.)\s+/).find((s) => re.test(s));
  // A bare "Choose one." says nothing on its own; fall back to the paragraph.
  return hit && hit.length > 40 ? hit : flat;
}

const anchor = (heading) =>
  "#" + heading.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

/**
 * GitHub suffixes repeated headings (#spellcasting, #spellcasting-1). Returns a
 * function that mirrors that, given the headings already used on the page.
 */
function anchorer(usedHeadings = []) {
  const seen = new Map();
  const take = (h) => {
    const a = anchor(h);
    const n = seen.get(a) || 0;
    seen.set(a, n + 1);
    return n ? `${a}-${n}` : a;
  };
  usedHeadings.forEach(take);
  return take;
}

export function casterLine(cls) {
  if (!cls.spellcasting) return "Non-caster";
  const t = spellTables.tables[cls.spellcasting.slotTable];
  // "Half Caster (starts at 1st level)" reads badly with an ability appended.
  const [, base, note] = t.name.match(/^([^(]+?)\s*(?:\((.+)\))?$/);
  return `${base}, ${cls.spellcasting.ability}${note ? ` — ${note}` : ""}`;
}

/** Levels at which the class makes the player decide something. */
function decisionRows(cls) {
  const rows = [];
  const push = (level, decision, note) => rows.push({ level, decision, note });

  const p = cls.proficiencies || {};
  if (p.skills) {
    push(
      1,
      "Skill proficiencies",
      `Choose ${p.skills.choose} from ${p.skills.from.join(", ")}${p.skills.note ? ` (${p.skills.note})` : ""}`
    );
  }
  const eq = cls.startingEquipment || {};
  if ((eq.choices || []).length) {
    push(
      1,
      "Starting equipment",
      `${eq.choices.length} either/or pick${eq.choices.length === 1 ? "" : "s"}` +
        (eq.goldAlternative ? `, or take ${eq.goldAlternative} and shop` : "")
    );
  }

  // Features whose text asks the player to pick from a set of options. The
  // pattern deliberately ignores incidental verbs ("choose to end it") by
  // requiring a quantity or "from" after the verb.
  const CHOICE =
    /\bchoos(?:e|ing)\s+(?:one|two|three|four|any|from|a\b|an\b|\d+)|\byou\s+select\s|\bof your choice\b/i;
  const subclassLabel = cls.subclass ? cls.subclass.label.toLowerCase() : null;
  for (const f of cls.features) {
    if (f.name.toLowerCase() === subclassLabel) continue; // covered by the subclass row
    const name = f.optional ? `${f.name} *(optional)*` : f.name;
    // Fighting Style says "see the table" rather than naming its options.
    if (/^Fighting Style/i.test(f.name) && (cls.fightingStyles || []).length) {
      push(f.level, name, `Pick one of the ${cls.fightingStyles.length} styles in [Fighting Styles](${anchor("Fighting Styles")})`);
      continue;
    }
    // Judge the prose, not embedded tables and bullet lists: a choice buried in
    // a list is usually a per-use option, not a build decision. Features that
    // are *only* a table of options (Infusion Options) are the exception.
    const prose = firstProse(f.description);
    if (prose ? !CHOICE.test(prose) : !CHOICE.test(f.description)) continue;
    push(
      f.level,
      name,
      prose ? gist(pickSentence(prose, CHOICE)) : `See ${f.name} under [Class Features](${anchor("Class Features")})`
    );
  }

  // Ability Score Improvements, read off the progression table.
  for (const lv of cls.progression.levels) {
    if (lv.features.some((n) => /Ability Score Improvement/i.test(n))) {
      push(lv.level, "Ability Score Improvement", "+2 to one ability, +1 to two, or a feat");
    }
  }

  // Subclass choice and its feature levels.
  const sc = cls.subclass;
  if (sc) {
    push(sc.level, `**${sc.label}**`, `Pick one of the ${cls.subclassData.length} listed below`);
    for (const l of (sc.featureLevels || []).filter((l) => l !== sc.level)) {
      push(l, `${sc.label} feature`, "Granted by the subclass you already chose");
    }
  }

  const seen = new Set();
  return rows
    .filter((r) => {
      const k = `${r.level}|${r.decision}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .sort((a, b) => a.level - b.level);
}

function buildSection(cls) {
  const p = cls.proficiencies || {};
  const eq = cls.startingEquipment || {};
  const sc = cls.spellcasting;
  const out = [];

  out.push(`## Build a ${cls.name}\n`);
  out.push(
    `Work down this list to make a 1st-level ${cls.name.toLowerCase()}; the decision table at the end covers every later level.\n`
  );

  out.push("**1. Abilities.** ");
  out[out.length - 1] +=
    `Put your highest score in **${list(cls.primaryAbility)}**` +
    (sc ? ` — it also sets your spell save DC and attack bonus` : "") +
    `. Your saving throw proficiencies are **${list(cls.savingThrows)}**.\n`;

  out.push(
    `**2. Hit points.** ${cls.hitDice} hit die per level. ` +
      `${cls.hitPointsAt1st ? `At 1st level you have ${cls.hitPointsAt1st}` : ""}` +
      `${cls.hitPointsPerLevel ? `, and gain ${cls.hitPointsPerLevel} on each level after` : ""}.\n`
  );

  out.push("**3. Proficiencies.**\n");
  out.push("| | |", "| :--- | :--- |");
  out.push(`| Armor | ${cell(list(p.armor))} |`);
  out.push(`| Weapons | ${cell(list(p.weapons))} |`);
  out.push(`| Tools | ${cell(list(p.tools))} |`);
  if (p.skills)
    out.push(
      `| Skills | ${cell(`Choose ${p.skills.choose} from ${p.skills.from.join(", ")}${p.skills.note ? ` — ${p.skills.note}` : ""}`)} |`
    );
  out.push("");

  out.push("**4. Equipment.** You start with the following, plus whatever your background grants:\n");
  (eq.choices || []).forEach((c) => out.push(`- ${c.from.join(" **or** ")}`));
  (eq.fixed || []).forEach((f) => out.push(`- ${f}`));
  if (eq.goldAlternative)
    out.push(`\nOr skip all of it and start with **${eq.goldAlternative}** to buy your own gear.`);
  out.push("");

  let step = 5;
  if (sc) {
    out.push(
      `**${step++}. Spellcasting.** You cast with **${sc.ability}**` +
        (sc.type ? `, and your spells are ${sc.type === "known" ? "**known** — a fixed list you swap on level-up" : "**prepared** — rebuilt after each long rest"}` : "") +
        `. ${sc.preparedFormula ? `You prepare ${sc.preparedFormula}. ` : ""}` +
        `See [Spellcasting](${anchor("Spellcasting")}) for the full block.\n`
    );
  }

  if (cls.subclass) {
    out.push(
      `**${step++}. ${cls.subclass.label}.** Chosen at **${ordinal(cls.subclass.level)} level** — ` +
        `browse the ${cls.subclassData.length} options in [${cls.subclass.label}s](${anchor(cls.subclass.label + "s")}) ` +
        `before you build, since it shapes the character more than anything else here.\n`
    );
  }

  const rows = decisionRows(cls);
  if (rows.length) {
    out.push("### Decisions by level\n");
    out.push("| Level | You choose | Notes |", "| ---: | :--- | :--- |");
    rows.forEach((r) => out.push(`| ${r.level} | ${cell(r.decision)} | ${cell(r.note)} |`));
    out.push("");
  }

  if (cls.multiclassing) {
    out.push("### Multiclassing\n");
    const m = cls.multiclassing;
    if (m.prerequisite) out.push(`- **Prerequisite:** ${m.prerequisite}`);
    if (m.proficienciesGained) out.push(`- **You gain:** ${list(m.proficienciesGained)}`);
    if (m.spellcastingNote) out.push(`- **Spellcasting:** ${m.spellcastingNote}`);
    out.push("");
  }
  return out.join("\n");
}

function spellcastingSection(cls) {
  const sc = cls.spellcasting;
  if (!sc) return "";
  const out = ["## Spellcasting\n", "| | |", "| :--- | :--- |"];
  out.push(`| **Ability** | ${sc.ability} |`);
  out.push(`| **Save DC** | 8 + proficiency bonus + ${sc.ability} modifier |`);
  out.push(`| **Attack bonus** | proficiency bonus + ${sc.ability} modifier |`);
  out.push(`| **Progression** | ${spellTables.tables[sc.slotTable].name} |`);
  if (sc.type) out.push(`| **Spells** | ${sc.type === "known" ? "Known (fixed list)" : "Prepared (swapped on a long rest)"} |`);
  if (sc.preparedFormula) out.push(`| **Spells prepared** | ${cell(sc.preparedFormula)} |`);
  if (sc.spellList) out.push(`| **Spell list** | ${cell(sc.spellList)} |`);
  if (sc.focus) out.push(`| **Focus** | ${cell(sc.focus)} |`);
  if (sc.ritualCasting != null) out.push(`| **Ritual casting** | ${sc.ritualCasting ? "Yes" : "No"} |`);
  out.push("");
  if (sc.notes) out.push(sc.notes + "\n");
  return out.join("\n");
}

function fightingStyleSection(cls) {
  if (!cls.fightingStyles || !cls.fightingStyles.length) return "";
  const out = ["## Fighting Styles\n"];
  out.push("Pick one when you gain the feature; you can never take the same option twice.\n");
  out.push("| Style | Source | Effect |", "| :--- | :--- | :--- |");
  cls.fightingStyles.forEach((id) => {
    const s = fightingStyles[id];
    if (!s) throw new Error(`Unknown fighting style "${id}" on class ${cls.id}`);
    out.push(`| **${s.name}** | ${s.source} | ${cell(s.description)} |`);
  });
  out.push("");
  return out.join("\n");
}

function subclassSection(cls) {
  const label = cls.subclass ? cls.subclass.label : "Subclass";
  const out = [`## ${label}s\n`];
  out.push(
    `Chosen at **${ordinal(cls.subclass.level)} level**; subclass features arrive at ` +
      `${(cls.subclass.featureLevels || []).map(ordinal).join(", ")} level. ` +
      `Each links to its own page with the full feature text.\n`
  );
  out.push(`| ${label} | Source | Levels | What it does |`, "| :--- | :--- | :--- | :--- |");
  cls.subclassData.forEach((s) => {
    const levels = [...new Set(s.features.map((f) => f.level))].sort((a, b) => a - b).join(", ");
    out.push(
      `| [**${s.name}**](subclasses/${s.id}/README.md) | ${s.source.book} | ${levels} | ${cell(s.summary || "")} |`
    );
  });
  out.push("");
  return out.join("\n");
}

function footer(cls) {
  return [
    "---",
    "",
    "### This folder",
    "",
    "| File | What it is |",
    "| :--- | :--- |",
    "| [`class.json`](class.json) | The source of truth — everything on this page is generated from it |",
    `| [\`subclasses/\`](subclasses) | One folder per ${cls.subclass ? cls.subclass.label.toLowerCase() : "subclass"}, each with a \`subclass.json\` and a page like this one |`,
    "",
    `[← All classes](../README.md) · [Repo home](../../README.md) · [Site version](../../docs/classes/${cls.id}/index.md)`,
    "",
    "<sub>Generated by `scripts/build.mjs` from `class.json` — edit the JSON, not this file.</sub>",
    "",
  ].join("\n");
}

export function classReadme(cls) {
  const out = [];
  out.push(`# ${cls.name}\n`);
  if (cls.summary) out.push(`> ${cls.summary}\n`);
  out.push(
    `**${cls.hitDice} hit die** · **${list(cls.primaryAbility)}** · ${casterLine(cls)} · ` +
      `${cls.subclassData.length} ${cls.subclass ? cls.subclass.label.toLowerCase() + "s" : "subclasses"} · ` +
      `*${sourceName(cls.source.book)}${cls.source.page ? `, p. ${cls.source.page}` : ""}*\n`
  );
  if (cls.flavor) out.push(cls.flavor + "\n");

  const nav = [
    `[Build a ${cls.name}](${anchor("Build a " + cls.name)})`,
    `[The ${cls.name}](${anchor("The " + cls.name)})`,
  ];
  if (cls.spellcasting) nav.push(`[Spellcasting](${anchor("Spellcasting")})`);
  if (cls.fightingStyles && cls.fightingStyles.length)
    nav.push(`[Fighting Styles](${anchor("Fighting Styles")})`);
  nav.push(`[Class Features](${anchor("Class Features")})`);
  if (cls.subclass) nav.push(`[${cls.subclass.label}s](${anchor(cls.subclass.label + "s")})`);
  out.push("**On this page:** " + nav.join(" · ") + "\n");
  out.push("---\n");

  out.push(buildSection(cls));
  out.push(`## The ${cls.name}\n`);
  out.push(progressionTable(cls) + "\n");
  out.push(spellcastingSection(cls));
  out.push(fightingStyleSection(cls));
  out.push("## Class Features\n");
  out.push(featureList(cls.features));
  if (cls.subclass) out.push(subclassSection(cls));
  out.push(footer(cls));
  return out.join("\n");
}

export function subclassReadme(sub, cls) {
  const out = [];
  out.push(`# ${sub.name}\n`);
  const src = `${sourceName(sub.source.book)}${sub.source.page ? `, p. ${sub.source.page}` : ""}${sub.source.setting ? ` · ${sub.source.setting}` : ""}`;
  out.push(`**[${cls.name}](../../README.md) ${sub.label || "subclass"}** · *${src}*\n`);
  if (sub.summary) out.push(`> ${sub.summary}\n`);
  if (sub.flavor) out.push(sub.flavor + "\n");
  if (sub.playstyle) out.push(`**How it plays.** ${sub.playstyle}\n`);

  const levels = [...new Set(sub.features.map((f) => f.level))].sort((a, b) => a - b);
  out.push(
    `Taken at **${ordinal(cls.subclass.level)} level** as your ${cls.subclass.label}. ` +
      `It gives you features at **${levels.map(ordinal).join(", ")} level**:\n`
  );
  // Headings that precede the feature list, so repeated names anchor correctly.
  const before = [sub.name];
  if (sub.expandedSpells && Object.keys(sub.expandedSpells).length) before.push("Expanded Spell List");
  if (sub.spellcasting) before.push("Spellcasting");
  before.push("Features");
  const anchorFor = anchorer(before);

  out.push("| Level | Feature | In short |", "| ---: | :--- | :--- |");
  sub.features
    .slice()
    .sort((a, b) => a.level - b.level)
    .forEach((f) =>
      out.push(`| ${f.level} | [${f.name}](${anchorFor(f.name)}) | ${cell(gist(firstProse(f.description) || f.description))} |`)
    );
  out.push("");

  if (sub.expandedSpells && Object.keys(sub.expandedSpells).length) {
    out.push("## Expanded Spell List\n");
    const sc = cls.spellcasting || {};
    out.push(
      (sc.slotTable === "pact"
        ? `These count as ${cls.name.toLowerCase()} spells for you and are added to the list you choose from.`
        : sc.type === "known"
          ? `These count as ${cls.name.toLowerCase()} spells for you and don't count against the number you know.`
          : `These are always prepared for you and don't count against the number you can prepare.`) + "\n"
    );
    out.push("| Level | Spells |", "| :--- | :--- |");
    for (const [lvl, spells] of Object.entries(sub.expandedSpells)) {
      out.push(`| ${lvl} | ${cell(spells.join(", "))} |`);
    }
    out.push("");
  }

  if (sub.spellcasting) {
    out.push("## Spellcasting\n");
    const s = sub.spellcasting;
    const bits = [];
    if (s.ability) bits.push(`**Ability:** ${s.ability}`);
    if (s.slotTable) bits.push(`**Progression:** ${spellTables.tables[s.slotTable].name}`);
    if (s.school) bits.push(`**School focus:** ${s.school}`);
    if (bits.length) out.push(bits.join(" · ") + "\n");
    if (s.notes) out.push(s.notes + "\n");
  }

  out.push("## Features\n");
  out.push(featureList(sub.features));

  out.push("---\n");
  out.push("### This folder\n");
  out.push(
    `[\`subclass.json\`](subclass.json) is the source of truth for this page.\n`
  );
  out.push(
    `[← Back to ${cls.name}](../../README.md) · ` +
      `[${cls.name} class table](../../README.md${anchor("The " + cls.name)}) · ` +
      `[All classes](../../../README.md)\n`
  );
  out.push("<sub>Generated by `scripts/build.mjs` from `subclass.json` — edit the JSON, not this file.</sub>\n");
  return out.join("\n");
}

export function classesIndexReadme(classes) {
  const totalSubs = classes.reduce((n, c) => n + c.subclassData.length, 0);
  const out = [];
  out.push("# Classes\n");
  out.push(
    `Every playable class in fifth edition using the **2014 rules** — ` +
      `**${classes.length} classes · ${totalSubs} subclasses**. ` +
      `Each class folder holds its \`class.json\` plus a page with the full class: build steps, ` +
      `level table, every feature, and links to each subclass.\n`
  );

  out.push("| Class | Hit Die | Primary | Saves | Caster | Subclass chosen at | Options |");
  out.push("| :--- | :---: | :--- | :--- | :--- | :---: | ---: |");
  classes.forEach((c) => {
    out.push(
      `| [**${c.name}**](${c.id}/README.md) | ${c.hitDice} | ${c.primaryAbility.join(", ")} | ` +
        `${c.savingThrows.join(", ")} | ${casterLine(c)} | ${ordinal(c.subclass.level)} | ${c.subclassData.length} |`
    );
  });
  out.push("");

  out.push("## Picking a class\n");
  out.push("| Class | In one line |", "| :--- | :--- |");
  classes.forEach((c) => out.push(`| [${c.name}](${c.id}/README.md) | ${cell(c.summary || "")} |`));
  out.push("");

  out.push("## Building a character from this repo\n");
  out.push(
    "1. Skim the one-liners above and open a class page.\n" +
      "2. Follow its **Build a &lt;class&gt;** section top to bottom — abilities, hit points, proficiencies, equipment.\n" +
      "3. Read the **Decisions by level** table so you know what is coming; the biggest one is your subclass.\n" +
      "4. Open the subclass pages linked at the bottom of the class page and pick one.\n" +
      "5. Use the class level table for what you gain each level as you play.\n"
  );
  out.push(
    "Want the data instead of the prose? Every page is generated from `class.json` / `subclass.json` " +
      "in the same folder — read those directly, or see the [repo README](../README.md) for the schema.\n"
  );

  out.push("## Subclasses by class\n");
  classes.forEach((c) => {
    out.push(`<details>\n<summary><strong>${c.name}</strong> — ${c.subclassData.length} ${c.subclass.label.toLowerCase()}s</summary>\n`);
    c.subclassData.forEach((s) =>
      out.push(`- [${s.name}](${c.id}/subclasses/${s.id}/README.md) — ${s.summary || ""} <sub>${s.source.book}</sub>`)
    );
    out.push("\n</details>\n");
  });

  out.push("<sub>Generated by `scripts/build.mjs` — edit the JSON, not this file.</sub>\n");
  return out.join("\n");
}
