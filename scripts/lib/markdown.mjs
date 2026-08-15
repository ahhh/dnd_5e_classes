import {
  ordinal,
  profBonus,
  slotsForLevel,
  pactForLevel,
  spellTables,
  sourceName,
  fightingStyles,
} from "./data.mjs";

/** Renders the shared Fighting Style table for classes that list style ids. */
function fightingStyleBlock(cls) {
  if (!cls.fightingStyles || !cls.fightingStyles.length) return "";
  const out = ["## Fighting Styles\n"];
  out.push(
    `You adopt a particular style of fighting as your specialty. Choose one of the following options; you can't take the same Fighting Style option more than once, even if you get to choose again.\n`
  );
  out.push("| Style | Source | Effect |", "| :--- | :--- | :--- |");
  cls.fightingStyles.forEach((id) => {
    const s = fightingStyles[id];
    if (!s) throw new Error(`Unknown fighting style "${id}" on class ${cls.id}`);
    out.push(`| **${s.name}** | ${s.source} | ${s.description} |`);
  });
  out.push("");
  return out.join("\n");
}

const list = (arr) => (arr && arr.length ? arr.join(", ") : "None");

/** The progression table: Level | Prof | Features | class columns | spell slots */
export function progressionTable(cls) {
  const cols = cls.progression.columns || [];
  const sc = cls.spellcasting;
  const header = ["Level", "Prof. Bonus", "Features", ...cols.map((c) => c.label)];
  const align = ["---:", ":---:", ":---", ...cols.map(() => ":---:")];

  let slotHeaders = [];
  if (sc && sc.slotTable === "pact") {
    slotHeaders = ["Spell Slots", "Slot Level"];
  } else if (sc) {
    const max = spellTables.tables[sc.slotTable].maxSpellLevel;
    slotHeaders = Array.from({ length: max }, (_, i) => ordinal(i + 1));
  }
  header.push(...slotHeaders);
  align.push(...slotHeaders.map(() => ":---:"));

  const rows = cls.progression.levels.map((lv) => {
    const cells = [
      ordinal(lv.level),
      `+${profBonus(lv.level)}`,
      lv.features.length ? lv.features.join(", ") : "—",
      ...cols.map((c) => (lv.values && lv.values[c.key] != null ? String(lv.values[c.key]) : "—")),
    ];
    if (sc && sc.slotTable === "pact") {
      const p = pactForLevel(lv.level);
      cells.push(p.slots, p.level);
    } else if (sc) {
      cells.push(...slotsForLevel(sc.slotTable, lv.level));
    }
    return `| ${cells.join(" | ")} |`;
  });

  return [`| ${header.join(" | ")} |`, `| ${align.join(" | ")} |`, ...rows].join("\n");
}

function quickStart(cls) {
  const p = cls.proficiencies || {};
  const eq = cls.startingEquipment || {};
  const out = [];
  out.push("## Creating a " + cls.name + "\n");
  out.push("| | |", "| :--- | :--- |");
  out.push(`| **Hit Dice** | ${cls.hitDice} per ${cls.name.toLowerCase()} level |`);
  if (cls.hitPointsAt1st) out.push(`| **Hit Points at 1st Level** | ${cls.hitPointsAt1st} |`);
  if (cls.hitPointsPerLevel) out.push(`| **Hit Points per Level After 1st** | ${cls.hitPointsPerLevel} |`);
  out.push(`| **Primary Ability** | ${list(cls.primaryAbility)} |`);
  out.push(`| **Saving Throws** | ${list(cls.savingThrows)} |`);
  out.push(`| **Armor** | ${list(p.armor)} |`);
  out.push(`| **Weapons** | ${list(p.weapons)} |`);
  out.push(`| **Tools** | ${list(p.tools)} |`);
  if (p.skills) {
    let s = `Choose ${p.skills.choose} from ${p.skills.from.join(", ")}`;
    if (p.skills.note) s += ` (${p.skills.note})`;
    out.push(`| **Skills** | ${s} |`);
  }
  out.push(`| **Subclass** | ${cls.subclass.label}, chosen at ${ordinal(cls.subclass.level)} level |`);
  out.push("");

  out.push("### Starting Equipment\n");
  out.push("You start with the following equipment, in addition to the equipment granted by your background:\n");
  (eq.choices || []).forEach((c) => out.push(`- ${c.from.join(" **or** ")}`));
  (eq.fixed || []).forEach((f) => out.push(`- ${f}`));
  if (eq.goldAlternative)
    out.push(`\nAlternatively, you may start with **${eq.goldAlternative}** and buy your own gear.`);
  out.push("");

  if (cls.multiclassing) {
    out.push("### Multiclassing\n");
    if (cls.multiclassing.prerequisite)
      out.push(`**Prerequisite:** ${cls.multiclassing.prerequisite}\n`);
    if (cls.multiclassing.proficienciesGained)
      out.push(
        `**Proficiencies gained:** ${list(cls.multiclassing.proficienciesGained)}\n`
      );
    if (cls.multiclassing.spellcastingNote)
      out.push(`**Spellcasting:** ${cls.multiclassing.spellcastingNote}\n`);
  }
  return out.join("\n");
}

function spellcastingBlock(cls) {
  const sc = cls.spellcasting;
  if (!sc) return "";
  const out = ["## Spellcasting\n", "| | |", "| :--- | :--- |"];
  out.push(`| **Spellcasting Ability** | ${sc.ability} |`);
  out.push(`| **Spell Save DC** | 8 + proficiency bonus + ${sc.ability} modifier |`);
  out.push(`| **Spell Attack Bonus** | proficiency bonus + ${sc.ability} modifier |`);
  if (sc.type) out.push(`| **Spells** | ${sc.type === "known" ? "Known (fixed list)" : "Prepared (swapped on a long rest)"} |`);
  if (sc.preparedFormula) out.push(`| **Spells Prepared** | ${sc.preparedFormula} |`);
  if (sc.spellList) out.push(`| **Spell List** | ${sc.spellList} |`);
  if (sc.focus) out.push(`| **Focus** | ${sc.focus} |`);
  if (sc.ritualCasting != null) out.push(`| **Ritual Casting** | ${sc.ritualCasting ? "Yes" : "No"} |`);
  out.push("");
  if (sc.notes) out.push(sc.notes + "\n");
  return out.join("\n");
}

export function featureList(features, heading = "###") {
  return features
    .slice()
    .sort((a, b) => a.level - b.level)
    .map((f) => {
      const tags = [];
      if (f.optional) tags.push("*Optional class feature*");
      if (f.source) tags.push(`*${sourceName(f.source)}*`);
      const tag = tags.length ? ` <sub>${tags.join(" · ")}</sub>` : "";
      return `${heading} ${f.name}\n\n*${ordinal(f.level)} level*${tag}\n\n${f.description}\n`;
    })
    .join("\n");
}

export function classMarkdown(cls) {
  const out = [];
  out.push(`# ${cls.name}\n`);
  if (cls.summary) out.push(`> ${cls.summary}\n`);
  out.push(`*Source: ${sourceName(cls.source.book)}${cls.source.page ? `, p. ${cls.source.page}` : ""}*\n`);
  if (cls.flavor) out.push(cls.flavor + "\n");
  out.push(quickStart(cls));
  out.push(`## The ${cls.name}\n`);
  out.push(progressionTable(cls) + "\n");
  out.push(spellcastingBlock(cls));
  out.push(fightingStyleBlock(cls));
  out.push("## Class Features\n");
  out.push(featureList(cls.features));
  out.push(`## ${cls.subclass.label}s\n`);
  out.push(
    `Choose at ${ordinal(cls.subclass.level)} level. Subclass features are gained at ${cls.subclass.featureLevels
      .map(ordinal)
      .join(", ")} level.\n`
  );
  out.push("| Subclass | Source | Summary |", "| :--- | :--- | :--- |");
  cls.subclassData.forEach((s) => {
    out.push(`| [${s.name}](${s.id}.md) | ${s.source.book} | ${s.summary || ""} |`);
  });
  out.push("");
  return out.join("\n");
}

export function subclassMarkdown(sub, cls) {
  const out = [];
  out.push(`# ${sub.name}\n`);
  out.push(`*${cls.name} ${sub.label || "subclass"} — ${sourceName(sub.source.book)}${sub.source.page ? `, p. ${sub.source.page}` : ""}*\n`);
  if (sub.summary) out.push(`> ${sub.summary}\n`);
  if (sub.flavor) out.push(sub.flavor + "\n");
  if (sub.playstyle) out.push(`**How it plays.** ${sub.playstyle}\n`);

  if (sub.expandedSpells && Object.keys(sub.expandedSpells).length) {
    out.push("## Expanded Spell List\n");
    out.push("| Level | Spells |", "| :--- | :--- |");
    for (const [lvl, spells] of Object.entries(sub.expandedSpells)) {
      out.push(`| ${lvl} | ${spells.join(", ")} |`);
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
    out.push(bits.join(" · ") + "\n");
    if (s.notes) out.push(s.notes + "\n");
  }

  out.push("## Features\n");
  out.push(featureList(sub.features));
  out.push(`\n[← Back to ${cls.name}](index.md)\n`);
  return out.join("\n");
}

export function indexMarkdown(classes) {
  const out = [];
  out.push("# D&D 5e (2014) Classes\n");
  out.push(
    "A complete, machine-readable reference for every playable class and subclass in fifth edition using the **2014 rules** (not the 2024 revision), covering the *Player's Handbook* and all official expanded content.\n"
  );
  const totalSubs = classes.reduce((n, c) => n + c.subclassData.length, 0);
  out.push(`**${classes.length} classes · ${totalSubs} subclasses**\n`);
  out.push("| Class | Hit Die | Primary | Saves | Caster | Subclasses |", "| :--- | :---: | :--- | :--- | :--- | ---: |");
  classes.forEach((c) => {
    const caster = c.spellcasting ? spellTables.tables[c.spellcasting.slotTable].name : "—";
    out.push(
      `| [${c.name}](classes/${c.id}/index.md) | ${c.hitDice} | ${c.primaryAbility.join(", ")} | ${c.savingThrows.join(", ")} | ${caster} | ${c.subclassData.length} |`
    );
  });
  out.push("");
  return out.join("\n");
}
