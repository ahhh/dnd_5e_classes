# D&D 5e (2014) Classes — JSON Dataset & Static Site

A complete, machine-readable reference for **every playable class and subclass** in fifth edition
D&D using the **2014 rules** (not the 2024 revision), covering the *Player's Handbook* and all
official expanded content.

**13 classes · 120 subclasses.**

| Class | Hit Die | Caster | Subclasses |
| :--- | :---: | :--- | ---: |
| Artificer | d8 | Half (from 1st) | 4 |
| Barbarian | d12 | — | 10 |
| Bard | d8 | Full | 8 |
| Cleric | d8 | Full | 15 |
| Druid | d8 | Full | 7 |
| Fighter | d10 | — (third for Eldritch Knight) | 10 |
| Monk | d8 | — | 11 |
| Paladin | d10 | Half | 9 |
| Ranger | d10 | Half | 8 |
| Rogue | d8 | — (third for Arcane Trickster) | 9 |
| Sorcerer | d6 | Full | 7 |
| Warlock | d8 | Pact Magic | 9 |
| Wizard | d6 | Full | 13 |

## Layout

```
classes/<class>/class.json                          # class definition + subclass index
classes/<class>/subclasses/<subclass>/subclass.json # one folder per subclass
data/spellcasting-tables.json                       # shared slot progressions
data/fighting-styles.json                           # shared fighting style options
schema/class.schema.json                            # JSON Schema for class files
schema/subclass.schema.json                         # JSON Schema for subclass files
scripts/build.mjs                                   # JSON -> Markdown + HTML
scripts/validate.mjs                                # structural checks
docs/                                               # generated site (GitHub Pages)
```

The JSON is the **single source of truth**. Markdown and HTML are both generated, so nothing is
ever written twice: shared data (spell slots per caster type, fighting styles) lives in `data/`
and is referenced by key rather than duplicated across the thirteen classes.

## Usage

```bash
node scripts/validate.mjs   # check the dataset for structural errors
node scripts/build.mjs      # regenerate docs/ from the JSON
```

`build.mjs` wipes and rewrites `docs/`. Never hand-edit files in `docs/` — edit the JSON and rebuild.

Both scripts are dependency-free and need only Node 18+.

## Publishing to GitHub Pages

1. Commit the repo including the generated `docs/` directory.
2. In the repository settings, set **Pages → Source** to *Deploy from a branch*, branch `main`,
   folder `/docs`.

The site is plain static HTML with one stylesheet — no build step, no framework, no external
requests. A `.nojekyll` file is emitted so GitHub serves the HTML as-is. Pages are responsive
and follow the reader's light/dark preference, with a manual toggle that persists.

Both `.md` and `.html` versions of every page are generated, so the dataset also browses nicely
directly on GitHub without Pages enabled.

## Data model notes

- **`progression.columns`** declares the class-specific table columns (Rages, Ki Points, Sneak
  Attack…). Spell slot columns are appended automatically from the shared tables based on
  `spellcasting.slotTable`, so no class file contains a slot table.
- **Optional features** from *Tasha's Cauldron of Everything* are marked `"optional": true`, and
  those that supersede an existing feature carry a `replaces` field. They render with a tag rather
  than being silently mixed into the base class.
- **Subclass spell lists** (domain, oath, patron, circle spells) live in `expandedSpells`, keyed by
  the level or slot level at which they are gained.
- **Third-caster subclasses** (Eldritch Knight, Arcane Trickster) carry their own `spellcasting`
  block referencing the shared `third` table.

## Sources covered

PHB, DMG, SCAG, XGE, TCE, MTF, ERLW, EGW, MOT, GGR, VRGR, FTD, BGG. Unearthed Arcana material is
deliberately excluded, as it is playtest content rather than published rules.

## Licensing and attribution

This is an unofficial fan reference and is not affiliated with or endorsed by Wizards of the Coast.

Rules content drawn from the **SRD 5.1** is used under
[CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/). Content outside the SRD — which is most
of the subclasses here — is **summarised in original wording** with a source citation for each
entry rather than reproduced verbatim. Names, mechanics, and setting material remain the property
of Wizards of the Coast. Use this as an index and quick reference; buy the books for the full text.
