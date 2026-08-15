import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const CLASSES_DIR = join(ROOT, "classes");
export const DOCS_DIR = join(ROOT, "docs");

export const readJSON = (p) => JSON.parse(readFileSync(p, "utf8"));

export const spellTables = readJSON(join(ROOT, "data", "spellcasting-tables.json"));
export const fightingStyles = readJSON(join(ROOT, "data", "fighting-styles.json")).styles;

/** Ordinal suffix: 1 -> 1st, 2 -> 2nd, 13 -> 13th */
export function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/** Load every class plus its subclasses, sorted by name. */
export function loadClasses() {
  if (!existsSync(CLASSES_DIR)) return [];
  return readdirSync(CLASSES_DIR)
    .filter((d) => statSync(join(CLASSES_DIR, d)).isDirectory())
    .map((dir) => {
      const cls = readJSON(join(CLASSES_DIR, dir, "class.json"));
      const subDir = join(CLASSES_DIR, dir, "subclasses");
      const subclasses = existsSync(subDir)
        ? readdirSync(subDir)
            .filter((d) => existsSync(join(subDir, d, "subclass.json")))
            .map((d) => readJSON(join(subDir, d, "subclass.json")))
        : [];
      // Order subclasses to match the index in class.json, then any extras.
      const order = new Map((cls.subclasses || []).map((s, i) => [s.id, i]));
      subclasses.sort(
        (a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999) || a.name.localeCompare(b.name)
      );
      return { ...cls, subclassData: subclasses, _dir: dir };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Slots for a given class level from a shared table, as display strings. */
export function slotsForLevel(tableKey, level) {
  const table = spellTables.tables[tableKey];
  if (!table || !table.slots) return null;
  const row = table.slots[level - 1] || [];
  const out = [];
  for (let i = 0; i < table.maxSpellLevel; i++) out.push(row[i] ? String(row[i]) : "—");
  return out;
}

export function pactForLevel(level) {
  const p = spellTables.tables.pact.pactSlots[level - 1];
  return p ? { slots: String(p.slots), level: ordinal(p.level) } : { slots: "—", level: "—" };
}

export const profBonus = (level) => spellTables.proficiencyBonus[level - 1];

export const SOURCE_NAMES = {
  PHB: "Player's Handbook",
  DMG: "Dungeon Master's Guide",
  SCAG: "Sword Coast Adventurer's Guide",
  XGE: "Xanathar's Guide to Everything",
  TCE: "Tasha's Cauldron of Everything",
  MTF: "Mordenkainen's Tome of Foes",
  ERLW: "Eberron: Rising from the Last War",
  EGW: "Explorer's Guide to Wildemount",
  MOT: "Mythic Odysseys of Theros",
  GGR: "Guildmasters' Guide to Ravnica",
  AI: "Acquisitions Incorporated",
  FTD: "Fizban's Treasury of Dragons",
  VRGR: "Van Richten's Guide to Ravenloft",
  SCC: "Strixhaven: A Curriculum of Chaos",
  AAG: "Astral Adventurer's Guide (Spelljammer)",
  DSOTDQ: "Dragonlance: Shadow of the Dragon Queen",
  BGG: "Bigby Presents: Glory of the Giants",
  PSK: "Planescape: Adventures in the Multiverse",
  BMT: "The Book of Many Things",
  UA: "Unearthed Arcana",
};

export const sourceName = (abbr) => SOURCE_NAMES[abbr] || abbr;
