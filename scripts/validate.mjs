#!/usr/bin/env node
/**
 * Structural checks over the JSON dataset.
 *   node scripts/validate.mjs
 * Exits non-zero if any error is found. Warnings do not fail the run.
 */
import { readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { CLASSES_DIR, readJSON, spellTables, fightingStyles, ordinal } from "./lib/data.mjs";

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const classDirs = readdirSync(CLASSES_DIR).filter((d) =>
  statSync(join(CLASSES_DIR, d)).isDirectory()
);

let subclassCount = 0;

for (const dir of classDirs) {
  const path = join(CLASSES_DIR, dir, "class.json");
  if (!existsSync(path)) {
    err(`${dir}: missing class.json`);
    continue;
  }
  let cls;
  try {
    cls = readJSON(path);
  } catch (e) {
    err(`${dir}/class.json: invalid JSON — ${e.message}`);
    continue;
  }

  if (cls.id !== dir) err(`${dir}: id "${cls.id}" does not match its folder name`);

  // Progression must cover exactly levels 1-20, in order.
  const levels = cls.progression?.levels || [];
  if (levels.length !== 20) err(`${cls.name}: progression has ${levels.length} levels, expected 20`);
  levels.forEach((lv, i) => {
    if (lv.level !== i + 1) err(`${cls.name}: progression row ${i + 1} has level ${lv.level}`);
    // Every declared column should have a value on every row.
    (cls.progression.columns || []).forEach((c) => {
      if (!lv.values || lv.values[c.key] === undefined)
        warn(`${cls.name} lvl ${lv.level}: missing value for column "${c.key}"`);
    });
  });

  // Spellcasting table must exist.
  if (cls.spellcasting && !spellTables.tables[cls.spellcasting.slotTable])
    err(`${cls.name}: unknown slot table "${cls.spellcasting.slotTable}"`);

  // Fighting styles must resolve.
  (cls.fightingStyles || []).forEach((id) => {
    if (!fightingStyles[id]) err(`${cls.name}: unknown fighting style "${id}"`);
  });

  // Feature levels must be sane.
  (cls.features || []).forEach((f) => {
    if (f.level < 1 || f.level > 20) err(`${cls.name}/${f.name}: level ${f.level} out of range`);
  });

  // Every feature named in the progression table should exist as a described
  // feature, a subclass-feature placeholder, or an ASI.
  const featureNames = new Set((cls.features || []).map((f) => f.name));
  const generic = /feature|Ability Score Improvement|improvement|Archetype|Path|Oath|Domain|Circle|College|Tradition|Origin|Patron|Specialist|Discipline/i;
  levels.forEach((lv) => {
    lv.features.forEach((name) => {
      const base = name.replace(/\s*\(.*\)$/, "").trim();
      if (!featureNames.has(base) && !featureNames.has(name) && !generic.test(name))
        warn(`${cls.name} lvl ${lv.level}: table lists "${name}" with no matching feature entry`);
    });
  });

  // Subclass index vs. folders on disk.
  const subDir = join(CLASSES_DIR, dir, "subclasses");
  const onDisk = existsSync(subDir)
    ? readdirSync(subDir).filter((d) => existsSync(join(subDir, d, "subclass.json")))
    : [];
  const indexed = (cls.subclasses || []).map((s) => s.id);

  indexed.filter((id) => !onDisk.includes(id)).forEach((id) =>
    err(`${cls.name}: "${id}" is listed in class.json but has no subclasses/${id}/subclass.json`)
  );
  onDisk.filter((id) => !indexed.includes(id)).forEach((id) =>
    err(`${cls.name}: subclasses/${id}/ exists but is not listed in class.json`)
  );

  for (const id of onDisk) {
    subclassCount++;
    let sub;
    try {
      sub = readJSON(join(subDir, id, "subclass.json"));
    } catch (e) {
      err(`${dir}/${id}: invalid JSON — ${e.message}`);
      continue;
    }
    if (sub.id !== id) err(`${dir}/${id}: id "${sub.id}" does not match its folder name`);
    if (sub.class !== cls.id) err(`${dir}/${id}: class "${sub.class}" should be "${cls.id}"`);
    if (!sub.features?.length) err(`${dir}/${id}: has no features`);
    (sub.features || []).forEach((f) => {
      if (f.level < 1 || f.level > 20) err(`${dir}/${id}/${f.name}: level ${f.level} out of range`);
    });

    // The first subclass feature should land on the level the class picks a subclass.
    const first = Math.min(...(sub.features || []).map((f) => f.level));
    if (Number.isFinite(first) && first < cls.subclass.level)
      err(
        `${dir}/${id}: has a feature at ${ordinal(first)} level, before the subclass is chosen at ${ordinal(cls.subclass.level)}`
      );
  }
}

console.log(`Checked ${classDirs.length} classes and ${subclassCount} subclasses.`);
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  warnings.forEach((w) => console.log(`  ~ ${w}`));
}
if (errors.length) {
  console.log(`\n${errors.length} error(s):`);
  errors.forEach((e) => console.log(`  ! ${e}`));
  process.exit(1);
}
console.log("\nAll structural checks passed.");
