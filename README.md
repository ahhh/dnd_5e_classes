# D&D 5e (2014) Classes — JSON Dataset & Static Site

A complete, machine-readable reference for **every playable class and subclass** in fifth edition
D&D using the **2014 rules** (not the 2024 revision), covering the *Player's Handbook* and all
official expanded content.

**13 classes · 120 subclasses.**

**[Browse the classes →](classes/README.md)** Every class and subclass folder has a README you can
read straight on GitHub: how to build the class step by step, what you choose at each level, the
full progression table, every feature, and links to each subclass.

**[Not sure what to play? →](class-selector/README.md)** A branching questionnaire for first-time
players that ends at one of all 120 subclasses — plus a [diagram version](class-selector/decision-tree.md)
of the same tree.

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
classes/README.md                                   # generated index of all classes
classes/<class>/class.json                          # class definition + subclass index
classes/<class>/README.md                           # generated: browsable class page
classes/<class>/subclasses/<subclass>/subclass.json # one folder per subclass
classes/<class>/subclasses/<subclass>/README.md     # generated: browsable subclass page
data/spellcasting-tables.json                       # shared slot progressions
data/fighting-styles.json                           # shared fighting style options
schema/class.schema.json                            # JSON Schema for class files
schema/subclass.schema.json                         # JSON Schema for subclass files
scripts/build.mjs                                   # JSON -> Markdown + HTML
scripts/validate.mjs                                # structural checks
scripts/build-class-selector.mjs                    # decision-tree.json -> class-selector guide + diagrams
docs/                                               # generated site (GitHub Pages)
class-selector/decision-tree.json                   # source of truth for the class-picker questionnaire
class-selector/README.md                            # generated: the questionnaire, as prose
class-selector/decision-tree.md                     # generated: the questionnaire, as Mermaid diagrams
```

The JSON is the **single source of truth**. Markdown and HTML are both generated, so nothing is
ever written twice: shared data (spell slots per caster type, fighting styles) lives in `data/`
and is referenced by key rather than duplicated across the thirteen classes.

## Usage

```bash
node scripts/validate.mjs   # check the dataset for structural errors
node scripts/build.mjs      # regenerate docs/ from the JSON
```

`build.mjs` writes two things: it wipes and rewrites `docs/` (the static site), and it refreshes
every `README.md` under `classes/` (the GitHub-browsable pages). It only ever creates or overwrites
`README.md` files inside `classes/` — the JSON is never touched. Never hand-edit a generated page;
edit the JSON and rebuild.

The two outputs cover different readers: `docs/` is the styled site for GitHub Pages, while the
`classes/**/README.md` pages are aimed at someone browsing the repo who wants to build a character —
they lead with a build walkthrough and a "decisions by level" table, and their links follow the
repo's folder layout.

Both scripts are dependency-free and need only Node 18+.

## Publishing to GitHub Pages

1. Commit the repo including the generated `docs/` directory.
2. In the repository settings, set **Pages → Source** to *Deploy from a branch*, branch `main`,
   folder `/` (root).

Serving from the root publishes both sites at once: `index.html` (the star chart) at `/`, and the
generated reference site at `/docs/`. The star chart links into `/docs/` for full class and subclass
pages, so the two need to be served together.

The site is plain static HTML with one stylesheet — no build step, no framework, no external
requests. A `.nojekyll` file is emitted so GitHub serves the HTML as-is. Pages are responsive
and follow the reader's light/dark preference, with a manual toggle that persists.

### The star chart (`index.html`)

A single standalone page that turns `class-selector/decision-tree.json` into a navigable sky: every
question is a waypoint star and every one of the 120 subclasses is its own procedurally drawn
constellation at a fixed coordinate. Answering a question flies the camera to the next waypoint,
leaving a glowing route behind; arriving at a destination opens the subclass with its art.

It reads the repository's JSON and PNGs live over `fetch`, so it needs no build step and picks up
new `subclass.json` edits and newly generated `art.png` files the moment they are committed. A
subclass with no art yet falls back to its class portrait, then to the constellation alone.

Because it fetches, it must be served over HTTP rather than opened from the filesystem:

```bash
node --run serve:chart   # http://localhost:8000
```

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
