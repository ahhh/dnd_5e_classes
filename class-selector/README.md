# Which Class Should I Play?

A branching questionnaire for first-time players. Read the first question below, pick whichever
answer feels truest to the character you're picturing, and follow it down through the nested
questions underneath — every path bottoms out at one specific class and subclass, out of all
**120 subclasses** across **13 classes** in this dataset.

Don't overthink it. If two answers both sound like you, pick either one — there's no wrong subclass,
only the one you haven't tried yet. Answers are grouped into six chapters below by first impression,
not by class — classes with a very different range of subclasses (Fighter, Barbarian, Cleric...) are
deliberately scattered across more than one chapter, so don't assume everyone who likes "a sword and
no magic" ends up playing the same character.

A visual version of this same tree — one diagram per chapter — is in
[decision-tree.md](decision-tree.md). Both files are generated from
[decision-tree.json](decision-tree.json) by `scripts/build-class-selector.mjs`; that JSON is the
only place this data is hand-maintained.

## Start here

**What's the fantasy that pulls you to the table? Go with your gut — there's no wrong answer.**

- *"I want to win fights through skill, steel, and nerve — no spellbook required."* → **Steel & Discipline**, below.
- *"My power comes from something greater than me: a god, the land, or the wild things living in it."* → **Faith & Nature**, below.
- *"I want to master magic itself — its theory, its schools, its craft."* → **Arcane Mastery**, below.
- *"I win by knowing more than everyone else at the table: secrets, angles, misdirection."* → **Shadow & Cunning**, below.
- *"My power comes from something vast, alien, or barely tamed — storms, dragons, the stars, dreams."* → **Elemental, Fey & Cosmic**, below.
- *"My power has a price. I made a deal, broke a vow, or simply refuse to stay dead."* → **Pacts, Curses & the Undying**, below.

---

## Steel & Discipline (25 subclasses)

**How do you want to win a fight?**

- *"I plant my feet and out-tough everyone on the field."*
  **When the damage starts piling up, what's your answer?**
  - *"I shrug it off and keep swinging — simple, consistent, effective."* → **[Fighter — Champion](../classes/fighter/subclasses/champion/README.md)** — Raw, simple physical excellence — crits on 19-20, then 18-20, plus a second fighting style.
  - *"I fly into a rage that makes me nearly impossible to put down."* → **[Barbarian — Path of the Berserker](../classes/barbarian/subclasses/path-of-the-berserker/README.md)** — Unrestrained fury traded for exhaustion — the purest expression of rage as a weapon.
  - *"I turn my own armor into a weapon, spikes and all."* → **[Barbarian — Path of the Battlerager](../classes/barbarian/subclasses/path-of-the-battlerager/README.md)** — Dwarven spiked-armor specialist who weaponizes their own body and armor.
  - *"I just keep moving forward, and nothing stops my momentum."* → **[Barbarian — Path of the Juggernaut](../classes/barbarian/subclasses/path-of-the-juggernaut/README.md)** — An unstoppable engine of forward momentum — you shove, trample, and crash through everything.
  - *"I climb inside a suit of magical powered armor."* → **[Artificer — Armorer](../classes/artificer/subclasses/armorer/README.md)** — You build powered armor — a Guardian bruiser suit or an Infiltrator stealth rig.
- *"I make the people around me better at fighting."*
  **How do you make your allies better?**
  - *"I call out precise maneuvers that trip, disarm, and control the fight."* → **[Fighter — Battle Master](../classes/fighter/subclasses/battle-master/README.md)** — A tactical warrior who spends superiority dice on maneuvers that trip, disarm, and command.
  - *"I rally them with inspiring words and a banner worth dying for."* → **[Fighter — Purple Dragon Knight (Banneret)](../classes/fighter/subclasses/purple-dragon-knight/README.md)** — A knightly leader who shares Second Wind, Indomitable, and inspiration with the whole party.
  - *"I plant myself between them and every enemy that gets close."* → **[Fighter — Cavalier](../classes/fighter/subclasses/cavalier/README.md)** — A mounted defender who marks foes, punishes them for looking away, and never falls off a horse.
  - *"I channel a war god's fury directly into their weapon arms."* → **[Cleric — War Domain](../classes/cleric/subclasses/war-domain/README.md)** — A holy warrior with bonus-action attacks, divine accuracy, and heavy armor.
  - *"I bind myself to their protection through a sacred oath to the throne."* → **[Paladin — Oath of the Crown](../classes/paladin/subclasses/oath-of-the-crown/README.md)** — A sworn defender of civilization who taunts foes and takes damage meant for allies.
- *"I live and die by my own personal code of mastery."*
  **What does personal mastery look like for you?**
  - *"An unbreakable code of resolve that keeps me fighting past death's door."* → **[Fighter — Samurai](../classes/fighter/subclasses/samurai/README.md)** — An indomitable warrior whose fighting spirit grants advantage, temp HP, and a refusal to fall.
  - *"A duelist's charm — one-on-one, blade and wit."* → **[Rogue — Swashbuckler](../classes/rogue/subclasses/swashbuckler/README.md)** — A dashing duelist who sneak attacks in single combat and disengages for free after striking.
  - *"Legendary feats that will be sung about for generations."* → **[Paladin — Oath of Glory](../classes/paladin/subclasses/oath-of-glory/README.md)** — A mythic hero in the making — athletic feats, party-wide speed, and inspiring might.
  - *"A single blade and a song, moving as one."* → **[Wizard — Bladesinging](../classes/wizard/subclasses/bladesinging/README.md)** — An elven war-mage who dances through battle with a blade in hand and magic on their lips.
  - *"A weapon that's become an extension of my body and spirit."* → **[Monk — Way of the Kensei](../classes/monk/subclasses/way-of-the-kensei/README.md)** — A weapon master who treats chosen blades and bows as extensions of the body.
  - *"My own fists and feet — no weapon needed at all."* → **[Monk — Way of the Open Hand](../classes/monk/subclasses/way-of-the-open-hand/README.md)** — The quintessential martial artist — every Flurry of Blows can trip, push, or deny reactions.
- *"I stay light on my feet and read the terrain (or the crowd)."*
  **What's your edge outside a straight fight?**
  - *"I'm fast, light-fingered, and always one step ahead."* → **[Rogue — Thief](../classes/rogue/subclasses/thief/README.md)** — A nimble burglar and climber who acts fast, uses items as a bonus action, and steals anything.
  - *"I adapt my tactics to whatever prey I'm hunting."* → **[Ranger — Hunter](../classes/ranger/subclasses/hunter/README.md)** — A monster-killing specialist who picks combat techniques for hordes, giants, or single foes.
  - *"I hunt the things that hunt people — fiends, undead, aberrations."* → **[Ranger — Monster Slayer](../classes/ranger/subclasses/monster-slayer/README.md)** — A witcher-style hunter who reads a monster's weaknesses and shuts down its magic.
  - *"My footwork looks like a drunk's stumble, but it's a killing art."* → **[Monk — Way of the Drunken Master](../classes/monk/subclasses/way-of-the-drunken-master/README.md)** — A staggering, unpredictable brawler who lurches out of reach and redirects enemy attacks.
  - *"I turn into the beast myself."* → **[Druid — Circle of the Moon](../classes/druid/subclasses/circle-of-the-moon/README.md)** — The shapeshifting combat druid — transform as a bonus action into ever-deadlier beasts.
- *"I want a taste of magic without giving up my weapon."*
  **How does magic show up in your fighting style?**
  - *"It doesn't replace my weapon — it inspires the swings around me."* → **[Bard — College of Valor](../classes/bard/subclasses/college-of-valor/README.md)** — Skalds who sing the deeds of heroes — and fight on the front line themselves.
  - *"I dance through a fight, blade in one hand and a spell in the other."* → **[Bard — College of Swords](../classes/bard/subclasses/college-of-swords/README.md)** — Blade-dancing entertainers who spend inspiration dice on damaging combat flourishes.
  - *"I don't fight with steel at all — I end fights with a fireball."* → **[Wizard — School of Evocation](../classes/wizard/subclasses/school-of-evocation/README.md)** — The blaster wizard — carve allies out of your fireballs and never roll low on damage.
  - *"I use magic like a tactician uses terrain — to control the battlefield."* → **[Wizard — War Magic](../classes/wizard/subclasses/war-magic/README.md)** — A battle mage who balances abjuration and evocation, warding themselves while blasting foes.

---

## Faith & Nature (20 subclasses)

**What's the source of your power, and who — or what — does it serve?**

- *"Keeping the people around me alive and whole."*
  **How do you keep your allies standing?**
  - *"Overflowing divine healing, straight from the source."* → **[Cleric — Life Domain](../classes/cleric/subclasses/life-domain/README.md)** — The definitive healer — every cure you cast is worth substantially more.
  - *"I bind the party together so we protect and inspire each other."* → **[Cleric — Peace Domain](../classes/cleric/subclasses/peace-domain/README.md)** — A bond-weaver who links allies together so they share protection and mobility.
  - *"A touch that heals or harms, and fists that flow like water."* → **[Monk — Way of Mercy](../classes/monk/subclasses/way-of-mercy/README.md)** — A masked physician-monk whose hands both heal the dying and hasten death.
  - *"Alchemical formulas and a healer's flask — no god required."* → **[Artificer — Alchemist](../classes/artificer/subclasses/alchemist/README.md)** — A master of potions and reagents who heals, buffs, and hurls experimental elixirs.
  - *"A pact with a being of pure light, healing woven into every spell."* → **[Warlock — The Celestial](../classes/warlock/subclasses/the-celestial/README.md)** — An empyrean patron makes you the rare warlock who heals — radiant light and healing dice.
  - *"Divine power that was simply born into my blood."* → **[Sorcerer — Divine Soul](../classes/sorcerer/subclasses/divine-soul/README.md)** — Celestial heritage grants you the entire cleric spell list alongside sorcerer flexibility.
- *"A bond with the wild places and things of the world."*
  **What's your bond with the wild?**
  - *"A god of the wild speaks through me."* → **[Cleric — Nature Domain](../classes/cleric/subclasses/nature-domain/README.md)** — A druidic priest with heavy armor, druid cantrips, and command over beasts and plants.
  - *"The land itself lends me its magic, wherever I stand."* → **[Druid — Circle of the Land](../classes/druid/subclasses/circle-of-the-land/README.md)** — A mystic keeper of old lore whose chosen terrain grants extra spells and recovered slots.
  - *"Spirits of beasts answer my call to guard the weak."* → **[Druid — Circle of the Shepherd](../classes/druid/subclasses/circle-of-the-shepherd/README.md)** — A summoner who calls totem spirits that buff every ally and every summoned creature.
  - *"An ancient oath sworn to the light that keeps the wild green."* → **[Paladin — Oath of the Ancients](../classes/paladin/subclasses/oath-of-the-ancients/README.md)** — A fey-touched green knight who halves all spell damage to the party and never truly dies.
  - *"An animal companion fights at my side, always."* → **[Ranger — Beast Master](../classes/ranger/subclasses/beast-master/README.md)** — A ranger bonded to an animal companion that fights at their side.
  - *"I read the land and move through it like I was born there."* → **[Rogue — Scout](../classes/rogue/subclasses/scout/README.md)** — A skirmisher and wilderness survivor who slips away whenever an enemy closes in.
- *"A spirit, ancestor, or creature that fights beside me."*
  **What fights alongside you?**
  - *"The spirit of a totem animal empowers my rage."* → **[Barbarian — Path of the Totem Warrior](../classes/barbarian/subclasses/path-of-the-totem-warrior/README.md)** — A spirit animal grants you its gifts — bear toughness, eagle mobility, wolf pack tactics, and more.
  - *"The ghosts of my ancestors guard my back."* → **[Barbarian — Path of the Ancestral Guardian](../classes/barbarian/subclasses/path-of-the-ancestral-guardian/README.md)** — Spirits of your ancestors shield your allies and punish those who ignore you.
  - *"My rage literally reshapes my body into a natural weapon."* → **[Barbarian — Path of the Beast](../classes/barbarian/subclasses/path-of-the-beast/README.md)** — Your rage grows claws, a bite, or a lashing tail — a beast wearing your skin.
  - *"A steel companion I built with my own two hands."* → **[Artificer — Battle Smith](../classes/artificer/subclasses/battle-smith/README.md)** — A combat medic and defender who fights beside a Steel Defender and attacks with Intelligence.
- *"A devotion so total it burns away everything else."*
  **How far does your devotion go?**
  - *"I fight like death itself has no hold on me, in a god's name."* → **[Barbarian — Path of the Zealot](../classes/barbarian/subclasses/path-of-the-zealot/README.md)** — A divine warrior whose rage is holy fury — and who simply refuses to stay dead.
  - *"An unbending, shining code of honor."* → **[Paladin — Oath of Devotion](../classes/paladin/subclasses/oath-of-devotion/README.md)** — The classic knight in shining armor — honesty, courage, and a blade of sacred weapon light.
  - *"I'd rather turn an enemy from violence than strike them down."* → **[Paladin — Oath of Redemption](../classes/paladin/subclasses/oath-of-redemption/README.md)** — A pacifist knight who seeks peace first and punishes violence by absorbing it.
  - *"I channel pure radiant fire against the dark."* → **[Cleric — Light Domain](../classes/cleric/subclasses/light-domain/README.md)** — A blaster cleric armed with fire, radiance, and a reaction that blinds attackers.

---

## Arcane Mastery (14 subclasses)

**What kind of arcane practitioner are you?**

- *"Magic sharpens a weapon I'm already carrying."*
  **How does magic sharpen your weapon?**
  - *"I weave spells between my sword strikes — a battle-mage through and through."* → **[Fighter — Eldritch Knight](../classes/fighter/subclasses/eldritch-knight/README.md)** — A warrior-mage who binds weapons to their soul and casts wizard spells between sword strokes.
  - *"Every arrow I loose carries a spell with it."* → **[Fighter — Arcane Archer](../classes/fighter/subclasses/arcane-archer/README.md)** — An elven-trained bowman who infuses arrows with magical effects — banishing, seeking, or shadowing.
  - *"I pick pockets with one hand and cast spells with the other."* → **[Rogue — Arcane Trickster](../classes/rogue/subclasses/arcane-trickster/README.md)** — A spell-thief who enchants, deceives, and pickpockets from across the room with a spectral hand.
- *"My god and my spellbook agree on more than you'd think."*
  **What does your god know about magic?**
  - *"Magic itself is my domain, arcane and divine intertwined."* → **[Cleric — Arcana Domain](../classes/cleric/subclasses/arcana-domain/README.md)** — A cleric who studies the Weave itself, learning wizard cantrips and true resurrection.
  - *"I've dedicated myself to knowing everything that can be known."* → **[Cleric — Knowledge Domain](../classes/cleric/subclasses/knowledge-domain/README.md)** — A scholar-priest who reads minds, borrows skills, and glimpses the history of any object.
  - *"I forge magic items the way a smith forges steel."* → **[Cleric — Forge Domain](../classes/cleric/subclasses/forge-domain/README.md)** — A divine smith who crafts magic items overnight and wears armor blessed to turn blades.
- *"I want to specialize deep in one school of magic."*
  **Which school of magic calls to you?**
  - *"Wards, shields, and turning aside every hostile spell."* → **[Wizard — School of Abjuration](../classes/wizard/subclasses/school-of-abjuration/README.md)** — A protective specialist wrapped in a self-recharging Arcane Ward that absorbs damage.
  - *"Summoning allies and objects out of thin air."* → **[Wizard — School of Conjuration](../classes/wizard/subclasses/school-of-conjuration/README.md)** — A summoner and teleporter who conjures objects from thin air and blinks out of danger.
  - *"Glimpsing fate before it happens."* → **[Wizard — School of Divination](../classes/wizard/subclasses/school-of-divination/README.md)** — A seer who rolls dice in advance and substitutes them for any roll made later.
  - *"Reshaping matter itself."* → **[Wizard — School of Transmutation](../classes/wizard/subclasses/school-of-transmutation/README.md)** — An alchemist of reality who reshapes matter and carries a stone of ever-shifting power.
  - *"I bind my magic into a living, sentient book."* → **[Wizard — Order of Scribes](../classes/wizard/subclasses/order-of-scribes/README.md)** — Your spellbook wakes up, talks to you, and lets you swap damage types and copy spells free.
- *"I build or create things that shouldn't be possible."*
  **What do you build with your magic?**
  - *"Impossible objects, even life itself — sung or spoken into being."* → **[Bard — College of Creation](../classes/bard/subclasses/college-of-creation/README.md)** — You sing the Song of Creation, conjuring dancing objects and animate helpers out of nothing.
  - *"My own body, plated and gearworked like clockwork."* → **[Sorcerer — Clockwork Soul](../classes/sorcerer/subclasses/clockwork-soul/README.md)** — Mechanus order flows through you, cancelling advantage and disadvantage and warding allies.
  - *"Magical cannons and turrets that do my fighting for me."* → **[Artificer — Artillerist](../classes/artificer/subclasses/artillerist/README.md)** — A siege engineer who summons an Eldritch Cannon to blast, heal, or shield the party.

---

## Shadow & Cunning (14 subclasses)

**How do you get the upper hand?**

- *"Words. I can talk my way into or out of anything."*
  **How do you bend a room to your will?**
  - *"I can talk anyone into anything, on stage or off."* → **[Bard — College of Eloquence](../classes/bard/subclasses/college-of-eloquence/README.md)** — Master orators whose inspiration never misses and whose arguments are literally irresistible.
  - *"Lies are just another tool of the trade — my god doesn't mind."* → **[Cleric — Trickery Domain](../classes/cleric/subclasses/trickery-domain/README.md)** — A divine trickster who blesses allies with stealth and fights beside an illusory duplicate.
  - *"One word from me, and allies act instantly, no questions asked."* → **[Cleric — Order Domain](../classes/cleric/subclasses/order-domain/README.md)** — A priest of law and obedience whose spells provoke allies into free attacks.
  - *"I don't ask — I make you agree with me."* → **[Wizard — School of Enchantment](../classes/wizard/subclasses/school-of-enchantment/README.md)** — A charmer who bends minds, redirects attacks, and can split an enchantment across two targets.
- *"Knowing things nobody else knows yet."*
  **What's your relationship with secrets?**
  - *"I collect knowledge like treasure, with a cutting remark for every occasion."* → **[Bard — College of Lore](../classes/bard/subclasses/college-of-lore/README.md)** — Scholar-bards who collect secrets, cut enemies down with a word, and steal spells from every class.
  - *"I trade in fear, blackmail, and the things people don't want said aloud."* → **[Bard — College of Whispers](../classes/bard/subclasses/college-of-whispers/README.md)** — Spies and blackmailers who feed on fear and wear the faces of the dead.
  - *"I hunt down dangerous magic and burn what shouldn't exist."* → **[Monk — Way of the Cobalt Soul](../classes/monk/subclasses/way-of-the-cobalt-soul/README.md)** — A scholar-spy of the Cobalt Reserve who beats an enemy's weaknesses out of them, literally.
  - *"I notice the one detail everyone else missed."* → **[Rogue — Inquisitive](../classes/rogue/subclasses/inquisitive/README.md)** — A detective who reads a foe's tells to enable Sneak Attack and spots any lie or disguise.
- *"The fight is already over before anyone sees me."*
  **How does the fight end before it starts?**
  - *"I vanish into literal darkness and strike from it."* → **[Monk — Way of Shadow](../classes/monk/subclasses/way-of-shadow/README.md)** — A ninja who teleports between shadows and vanishes in plain sight.
  - *"One perfect strike from hiding, and it's already over."* → **[Rogue — Assassin](../classes/rogue/subclasses/assassin/README.md)** — A killer who turns surprise into an automatic critical hit and wears any face to get close.
  - *"I hunt from the tree line, where the light doesn't reach."* → **[Ranger — Gloom Stalker](../classes/ranger/subclasses/gloom-stalker/README.md)** — A shadow-hunter who strikes devastatingly in the first round and is invisible in darkness.
  - *"I've sworn to end one target, whatever it costs me."* → **[Paladin — Oath of Vengeance](../classes/paladin/subclasses/oath-of-vengeance/README.md)** — A relentless avenger who marks a single foe and hunts it down with haste and free attacks.
- *"I run the whole game from the shadows."*
  **How do you control the battlefield without being seen?**
  - *"I direct my allies from thirty feet back and let them take the credit."* → **[Rogue — Mastermind](../classes/rogue/subclasses/mastermind/README.md)** — A manipulator and spymaster who Helps as a bonus action from 30 feet away.
  - *"Nothing you see around me is entirely real."* → **[Wizard — School of Illusion](../classes/wizard/subclasses/school-of-illusion/README.md)** — A master of deception whose illusions become partly real and can be reshaped at will.

---

## Elemental, Fey & Cosmic (32 subclasses)

**What kind of vast, untamed power calls to you?**

- *"Raw elemental force — storm, fire, and fury."*
  **Which element speaks loudest to you?**
  - *"My aura shifts with the seasons — desert sun, arctic frost, storm-wracked sea."* → **[Barbarian — Path of the Storm Herald](../classes/barbarian/subclasses/path-of-the-storm-herald/README.md)** — Your rage projects an aura of desert heat, arctic cold, or crackling sea-storm.
  - *"I command thunder and lightning like a god's own storm."* → **[Cleric — Tempest Domain](../classes/cleric/subclasses/tempest-domain/README.md)** — Storm-caller with heavy armor, martial weapons, and guaranteed maximum lightning damage.
  - *"I bend the four elements into martial arts techniques."* → **[Monk — Way of the Four Elements](../classes/monk/subclasses/way-of-the-four-elements/README.md)** — An elemental bender who spends ki to hurl fire, ride the wind, and shape stone.
  - *"My magic and lightning are one — I can even ride the storm through the sky."* → **[Sorcerer — Storm Sorcery](../classes/sorcerer/subclasses/storm-sorcery/README.md)** — Elemental air magic granting flight, in-combat teleport-steps, and thunderous rebukes.
  - *"Fire itself answers me, and a fire spirit walks at my side."* → **[Druid — Circle of Wildfire](../classes/druid/subclasses/circle-of-wildfire/README.md)** — A druid of cleansing flame bonded to a wildfire spirit that burns and teleports allies.
- *"The power of the mind itself."*
  **How does your mind become a weapon?**
  - *"I shape psychic energy into armor and weapons around my body."* → **[Fighter — Psi Warrior](../classes/fighter/subclasses/psi-warrior/README.md)** — A psionic duelist who shields allies, hurls foes telekinetically, and eventually flies.
  - *"I materialize a blade made of pure psychic force."* → **[Rogue — Soulknife](../classes/rogue/subclasses/soulknife/README.md)** — A psionic assassin who manifests blades of pure mind-energy and speaks telepathically.
  - *"Alien knowledge lives in my head, and it grants me telepathy and psychic power."* → **[Sorcerer — Aberrant Mind](../classes/sorcerer/subclasses/aberrant-mind/README.md)** — An alien influence grants telepathy, free psionic spells, and Subtle Spell for nothing.
  - *"I project spectral fists and a spirit-body of pure astral energy."* → **[Monk — Way of the Astral Self](../classes/monk/subclasses/way-of-the-astral-self/README.md)** — You summon spectral arms, a visage, and finally a full astral body of pure ki.
- *"Something whimsical, beautiful, and a little dangerous."*
  **How does the Feywild touch your magic?**
  - *"My performances captivate a room like fey enchantment."* → **[Bard — College of Glamour](../classes/bard/subclasses/college-of-glamour/README.md)** — Fey-touched charmers who enthrall crowds and command obedience with a word.
  - *"I walk the border of the Feywild, equal parts charming and deadly."* → **[Ranger — Fey Wanderer](../classes/ranger/subclasses/fey-wanderer/README.md)** — A ranger touched by the Feywild — psychic damage on every hit and a mind full of charm.
  - *"I made a pact with a fey lord or lady of the First World."* → **[Warlock — The Archfey](../classes/warlock/subclasses/the-archfey/README.md)** — A bargain with a fey lord granting charms, frights, and escapes into the Feywild.
  - *"I bring healing dreams and starlight into a weary camp."* → **[Druid — Circle of Dreams](../classes/druid/subclasses/circle-of-dreams/README.md)** — A Feywild-touched healer who mends the party on rests and hides them in the twilight.
- *"Something far bigger than this world."*
  **Is your connection to the cosmic something that hunts, or something you study?**
  - *"Something vast is out there, and dangerous — I stand watch against it."*
    **What's your relationship with the thing beyond?**
    - *"I made a pact with an alien intelligence I'll never fully understand."* → **[Warlock — The Great Old One](../classes/warlock/subclasses/the-great-old-one/README.md)** — An alien intelligence grants telepathy, psychic power, and the ability to enslave minds.
    - *"Something ancient sleeps in the deep ocean, and it speaks to me."* → **[Warlock — The Fathomless](../classes/warlock/subclasses/the-fathomless/README.md)** — A kraken or deep entity grants you spectral tentacles and the crushing pressure of the abyss.
    - *"I hunt the aberrations and horrors that slip through from other planes."* → **[Paladin — Oath of the Watchers](../classes/paladin/subclasses/oath-of-the-watchers/README.md)** — A sentinel against extraplanar threats — initiative bonuses, spell defense, and banishment.
    - *"A spectral echo of myself fights beside me, a half-step removed from time."* → **[Fighter — Echo Knight](../classes/fighter/subclasses/echo-knight/README.md)** — A dunamancy warrior who fights alongside an echo of themselves pulled from another timeline.
  - *"The cosmos bends slightly around me — time, space, starlight, dusk."*
    **What cosmic thread runs through your magic?**
    - *"I tell stories that call spirits from beyond the grave to fight for me."* → **[Bard — College of Spirits](../classes/bard/subclasses/college-of-spirits/README.md)** — A medium who channels the tales of the dead through a spectral focus, with randomly drawn effects.
    - *"I read fate in the stars, and become a living constellation."* → **[Druid — Circle of Stars](../classes/druid/subclasses/circle-of-stars/README.md)** — An astronomer-druid who takes on constellation forms for archery, healing, or spell power.
    - *"I bend time itself — slow it, rewind it, glimpse what's to come."* → **[Wizard — Chronurgy Magic](../classes/wizard/subclasses/chronurgy-magic/README.md)** — A dunamancer of time who manipulates initiative, forces reroll results, and stores spells in a pearl.
    - *"I bend gravity and space around my enemies."* → **[Wizard — Graviturgy Magic](../classes/wizard/subclasses/graviturgy-magic/README.md)** — A dunamancer of gravity who crushes, slows, pulls, and eventually creates a singularity.
    - *"I walk the line between day and night, guarding the space between."* → **[Cleric — Twilight Domain](../classes/cleric/subclasses/twilight-domain/README.md)** — A guardian of the night who grants 300-foot darkvision and a temp-HP aura every round.
    - *"I've walked every plane there is, and none of them scare me anymore."* → **[Ranger — Horizon Walker](../classes/ranger/subclasses/horizon-walker/README.md)** — A planar sentinel who steps through space, deals force damage, and closes rifts between worlds.
- *"Something ancient, huge, or wildly unpredictable."*
  **Is your power something you were born with, or something wild and barely tamed?**
  - *"Dragon's blood runs in me, and fire answers when I call."*
    **How does dragon-blood show in you?**
    - *"Scales, breath weapon, and a bloodline going back to actual dragons."* → **[Sorcerer — Draconic Bloodline](../classes/sorcerer/subclasses/draconic-bloodline/README.md)** — Dragon blood grants you extra hit points, natural armor, elemental damage, and finally wings.
    - *"I channel the essence of a dragon spirit into my own fists and aura."* → **[Monk — Way of the Ascendant Dragon](../classes/monk/subclasses/way-of-the-ascendant-dragon/README.md)** — A monk who channels draconic might — breath weapons, a frightful presence, and wings of ki.
    - *"A drake hatched bonded to me, and we grow together."* → **[Ranger — Drakewarden](../classes/ranger/subclasses/drakewarden/README.md)** — A ranger bonded to a growing draconic companion you can eventually ride into battle.
    - *"Solar fire fills me and erupts from my fists."* → **[Monk — Way of the Sun Soul](../classes/monk/subclasses/way-of-the-sun-soul/README.md)** — A radiant warrior who fires bolts of searing light and detonates in a burst of flame.
  - *"My power is huge, chaotic, or barely leashed."*
    **Just how much bigger and wilder does this get?**
    - *"I grow into an actual giant, hurling boulders and knocking down walls."* → **[Barbarian — Path of the Giant](../classes/barbarian/subclasses/path-of-the-giant/README.md)** — You grow to giant size and wield elemental weapons drawn from the Ordning.
    - *"Giant runes carved into my armor let me grow and command elemental forces."* → **[Fighter — Rune Knight](../classes/fighter/subclasses/rune-knight/README.md)** — A giant-taught warrior who carves magical runes into gear and grows to enormous size.
    - *"A swarm of tiny fey spirits follows me everywhere I go."* → **[Ranger — Swarmkeeper](../classes/ranger/subclasses/swarmkeeper/README.md)** — A ranger accompanied by a magical swarm of insects, spirits, or tiny beasts.
    - *"My rage sets off unpredictable bursts of wild magic."* → **[Barbarian — Path of Wild Magic](../classes/barbarian/subclasses/path-of-wild-magic/README.md)** — Raw magic leaks out of you when you rage, producing an unpredictable surge every time.
    - *"My spells are a gamble — glorious, chaotic surges, every time."* → **[Sorcerer — Wild Magic](../classes/sorcerer/subclasses/wild-magic/README.md)** — Chaos incarnate — your spells can trigger a wild surge with wildly unpredictable results.

---

## Pacts, Curses & the Undying (15 subclasses)

**What did your power cost you?**

- *"Nothing yet — but death and I have an understanding."*
  **What's your relationship with death itself?**
  - *"My god governs death as a natural, sacred end."* → **[Cleric — Death Domain](../classes/cleric/subclasses/death-domain/README.md)** — A necrotic specialist whose cantrips strike two targets and whose spells bypass resistance.
  - *"I guard the border between life and death, and undeath offends me personally."* → **[Cleric — Grave Domain](../classes/cleric/subclasses/grave-domain/README.md)** — A shepherd of the boundary between life and death who marks foes and snatches allies from death.
  - *"I command the dead to fight for me."* → **[Wizard — School of Necromancy](../classes/wizard/subclasses/school-of-necromancy/README.md)** — A commander of the dead who drains life to heal and raises an army of undead thralls.
  - *"Fungal spores and decay flow through my magic — death feeds new life."* → **[Druid — Circle of Spores](../classes/druid/subclasses/circle-of-spores/README.md)** — A fungal druid who wreathes themselves in necrotic spores and animates the dead.
- *"I refuse to let death be the end of my story."*
  **How do you cheat death?**
  - *"I've touched death so many times it no longer scares me — and I can spread that fear."* → **[Monk — Way of the Long Death](../classes/monk/subclasses/way-of-the-long-death/README.md)** — A scholar of mortality who feeds on nearby deaths and cheats his own.
  - *"My patron has conquered death itself, and plague and undeath are its gifts to me."* → **[Warlock — The Undying](../classes/warlock/subclasses/the-undying/README.md)** — A pact with a deathless being who has cheated the grave and shares that endurance with you.
  - *"My patron is literally undead, and its unnatural resilience has become mine."* → **[Warlock — The Undead](../classes/warlock/subclasses/the-undead/README.md)** — A lich or vampire lord patron who lets you assume a terrifying, damage-shrugging Form of Dread.
  - *"A piece of the Shadowfell's death magic clings to my soul."* → **[Rogue — Phantom](../classes/rogue/subclasses/phantom/README.md)** — A death-touched rogue who harvests soul trinkets, borrows skills from the dead, and deals necrotic damage.
- *"A vow, broken, or a throne, terrified into submission."*
  **What did you have to break to get this power?**
  - *"I broke my sacred oath, and dark power filled the void it left."* → **[Paladin — Oathbreaker](../classes/paladin/subclasses/oathbreaker/README.md)** — A fallen paladin who commands undead and turns their aura into a weapon of dread.
  - *"I terrify my enemies into submission, and I like it."* → **[Paladin — Oath of Conquest](../classes/paladin/subclasses/oath-of-conquest/README.md)** — A tyrant knight who freezes foes in terror and grinds them down with an aura of dread.
  - *"I sold a piece of myself to an infernal patron."* → **[Warlock — The Fiend](../classes/warlock/subclasses/the-fiend/README.md)** — A devil's bargain — temporary hit points on every kill and fire-laced destruction.
  - *"A sentient, cursed weapon chose me as its wielder."* → **[Warlock — The Hexblade](../classes/warlock/subclasses/the-hexblade/README.md)** — A sentient weapon patron that lets you attack with Charisma — the definitive warlock gish.
- *"My freedom, or my very blood."*
  **What binds your power to something else?**
  - *"Blood itself is the source and the price of my magic."* → **[Cleric — Blood Domain](../classes/cleric/subclasses/blood-domain/README.md)** — A hemocraft priest who manipulates the blood of the living to wound, sicken, and control.
  - *"I'm bound in service to a genie, trapped in their vessel between wishes."* → **[Warlock — The Genie](../classes/warlock/subclasses/the-genie/README.md)** — A noble genie grants elemental damage, a private demiplane vessel, and eventually a wish.
  - *"The Shadowfell seeped into my magic and never left."* → **[Sorcerer — Shadow Magic](../classes/sorcerer/subclasses/shadow-magic/README.md)** — A creature of the Shadowfell who refuses to die and summons a hound of ill omen.
