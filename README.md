<<<<<<< HEAD
# Idle Army - 0.0.0.1 Alpha

A minimal idle army management game built in vanilla JavaScript.

## Overview

Recruit soldiers, organize them into squads, and send them on missions to earn gold and gain experience. Expand your army and tackle harder challenges as you progress.

## Current Features

- **Recruitment**: Recruit Soldiers, Scouts, or Defenders with different stats
- **Soldiers**: Tracked individually with level, experience, stats (HP, DMG, DEF)
- **Squads**: Group up to 5 soldiers per squad
- **Missions**: Send squads on 3 difficulty tiers with time-based completion
- **Leveling**: Soldiers gain experience from missions and level up with stat increases
- **Gold Economy**: Spend gold to recruit, earn from mission completion

## How to Play

1. **Recruit** your first soldier(s) using starting gold (500)
2. **Create a Squad** and add soldiers to it
3. **Select a Mission** and assign a squad to it
4. **Watch** the mission progress bar fill over time
5. **Collect Rewards** when missions complete (gold + soldier exp)
6. **Level Up** soldiers and unlock harder missions

## File Structure

```
.
├── index.html       # Main HTML file (UI layout & styles)
├── game.js          # Game logic (soldiers, squads, missions, loop)
└── README.md        # This file
```

## Running the Game

1. Clone or copy all files into a directory
2. Open `index.html` in a web browser
3. No build step, no server needed

## Architecture Notes

### Game State
All state stored in the `game` object:
- `gold` - Currency
- `soldiers` - Array of Soldier objects
- `squads` - Array of Squad objects
- `activeMissions` - Array of currently running missions

### Core Classes
- **Soldier**: Individual unit with stats, level, experience
- **Squad**: Container for up to 5 soldiers; tracks membership
- **ActiveMission**: Tracks running mission progress and completion

### Game Loop
Runs every 100ms via `setInterval()`:
1. Update active missions (check completion)
2. Render UI based on current game state

## Roadmap (Future Versions)

- [ ] **Equipment & Loot** - Soldiers equip items from mission drops
- [ ] **Research Tree** - Unlock upgrades for progression
- [ ] **Prestige System** - Reset for permanent bonuses
- [ ] **Passive Offline Earnings** - Earn while away (50% rate)
- [ ] **Weekly Challenges** - Special limited-time missions
- [ ] **Save/Load** - localStorage persistence
- [ ] **Audio & Animations** - Polish and feel
- [ ] **Mobile Optimization** - Touch controls

## Notes for Development

### Adding New Content
- **Recruitment Templates**: Add to `RECRUIT_TEMPLATES` array
- **Missions**: Add to `MISSIONS` array with `id`, `name`, `duration`, `reward`, `minLevel`, `difficulty`
- **Soldiers Stats**: Modify constructor in `Soldier` class

### Saving Game State
Currently, state is volatile (lost on page refresh). To persist:
```javascript
// Save
localStorage.setItem('gameState', JSON.stringify(game));

// Load
const saved = localStorage.getItem('gameState');
if (saved) Object.assign(game, JSON.parse(saved));
```

### Performance
- Rendering updates every 100ms (can be tuned)
- For 50+ soldiers, consider optimizing DOM updates (batch, virtual lists)
- Mission calculations are O(n) where n = active missions (very fast)

## License

Personal project. Feel free to fork and experiment.

---

**Built by**: Northline Studio  
**Version**: 0.0.0.1 Alpha  
**Status**: Early Prototype
=======
# Legion Forge
# ⚔️ Legion Forge

Legion Forge is an idle army management game focused on building, expanding, and commanding a growing military force.

Recruit soldiers, organize them into squads, send forces on missions, collect rewards, and steadily turn a small fighting force into a powerful legion.

> **Current Version:** `0.0.0.1 Alpha`  
> **Development Status:** Early Prototype

---

## 🎮 About the Game

Legion Forge is designed around a simple idle progression loop:

**Recruit → Organize → Deploy → Earn → Upgrade → Expand**

The goal is to build an army that continues making progress while you are away, while giving you meaningful decisions to make when you return.

The current prototype establishes the basic command-center interface and the foundation for the game's core systems.

---

## 🏰 Current Prototype

The current build contains the initial interface for:

- Gold management
- Soldier recruitment
- Army management
- Soldier levels
- Squad organization
- Mission selection
- Mission rewards
- Active missions
- Mission progress tracking
- Responsive desktop/mobile layout

The prototype is intentionally small. It is being used to establish the game's core structure before larger progression systems are added.

---

## ⚔️ Core Systems

### Recruitment

Recruit soldiers using Gold and begin building your army.

Different soldier types are planned to have different characteristics, costs, and roles.

### Army

Your army is made up of individual soldiers.

Soldiers are intended to develop over time through levels, upgrades, and future specialization.

### Squads

Organize individual soldiers into squads.

Squads will eventually become an important part of determining how efficiently your army performs missions.

### Missions

Deploy squads on missions to generate rewards.

Missions are intended to provide the primary idle progression loop, with different durations, requirements, risks, and rewards planned for future versions.

### Active Missions

Once a mission begins, it can continue running while you manage the rest of your army.

The long-term goal is to allow players to maintain multiple operations simultaneously and build an increasingly automated military economy.

---

## 💰 Resources

Gold is the primary resource in the current prototype.

Future versions may introduce additional resources connected to:

- Army upkeep
- Equipment
- Training
- Construction
- Territory
- Research
- Advanced military operations

Resources will be introduced gradually as the underlying progression systems are developed.

---

## 📈 Progression

Legion Forge is intended to have long-term incremental progression.

Possible progression layers include:

- Soldier levels
- Soldier classes
- Squad upgrades
- Better equipment
- Stronger missions
- New regions
- Military facilities
- Command upgrades
- Specialized units
- Prestige/rebirth systems
- Permanent bonuses
- Large-scale campaigns

The progression system will be developed around the idea that every session should leave the army stronger than before.

---

## 🗺️ Planned Game Loop

The intended long-term loop is:

1. Recruit soldiers
2. Build squads
3. Select missions
4. Deploy your forces
5. Wait for missions to complete
6. Collect rewards
7. Improve the army
8. Unlock stronger operations
9. Expand your military infrastructure
10. Repeat

As the game develops, the player's army should gradually move from a small group of recruits into a large automated military organization.

---

## 🛠️ Development Roadmap

### Phase 1 — Prototype
- [x] Initial command-center interface
- [x] Recruitment interface
- [x] Army interface
- [x] Squad interface
- [x] Mission interface
- [x] Active mission interface
- [x] Responsive layout
- [ ] Functional gameplay logic
- [ ] Persistent save system

### Phase 2 — Core Gameplay
- [ ] Implement soldier recruitment
- [ ] Implement Gold economy
- [ ] Implement soldier progression
- [ ] Implement squad creation
- [ ] Implement squad management
- [ ] Implement mission deployment
- [ ] Implement mission completion
- [ ] Implement reward collection
- [ ] Implement idle/offline progression

### Phase 3 — Army Progression
- [ ] Soldier classes
- [ ] Equipment
- [ ] Squad upgrades
- [ ] Training
- [ ] Command upgrades
- [ ] More mission types
- [ ] Increasing difficulty
- [ ] New military units

### Phase 4 — World & Expansion
- [ ] Regions
- [ ] Territories
- [ ] Campaign progression
- [ ] Military facilities
- [ ] World events
- [ ] Advanced missions
- [ ] Larger army management

### Phase 5 — Long-Term Progression
- [ ] Prestige system
- [ ] Permanent bonuses
- [ ] Endgame progression
- [ ] Advanced automation
- [ ] Additional strategic systems

---

## 🧪 Current Development Status

Legion Forge is **not a finished game**.

The project is currently in the earliest prototype stage. The primary focus is establishing the interface, gameplay architecture, and core idle loop before expanding into larger systems.

Features listed under the roadmap are planned concepts and should not be considered implemented unless marked as completed.

---

## 🎨 Design Direction

Legion Forge is being developed around a dark military command-center aesthetic.

The intended presentation combines:

- Dark interfaces
- Military organization
- Clear resource management
- Squad-based progression
- Tactical mission selection
- Incremental numbers
- Long-term army growth

The interface should remain readable and functional as the player's army becomes substantially larger.

---

## 💻 Technology

The current prototype is built as a lightweight browser-based game using:

- HTML
- CSS
- JavaScript

The project is intentionally kept lightweight during early development.

---

## 📦 Project Structure

```text
legion-forge/
├── index.html
├── game.js
└── README.md
>>>>>>> 4b774b4cdb253f3e6fbfd9602bd5afcbcb2c62a0
