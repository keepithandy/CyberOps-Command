# Legion Forge

Legion Forge is an idle army management game built in vanilla JavaScript.

Recruit soldiers, organize them into squads, send them on missions, collect rewards, and grow a persistent legion over time.

> **Current Version:** `0.0.1 Alpha`
> **Status:** Playable Early Prototype
> **Built with:** Vanilla JavaScript, no build step

## Quick Start

1. Open `index.html` in a web browser
2. Use starting gold to recruit soldiers
3. Organize soldiers into squads
4. Deploy squads on missions
5. Collect rewards and improve your army

## Core Gameplay Loop

Recruit -> Organize -> Deploy -> Earn -> Upgrade -> Repeat

### Recruitment

Choose from multiple soldier archetypes with different stats, costs, and abilities.

### Squads

Group soldiers into squads of up to 5 members.

### Missions

Send squads on missions with time-based completion and rewards.

### Equipment

Missions can generate equipment that improves soldier stats.

## Game State

The current build stores game state in the `game` object:

- `gold`
- `soldiers`
- `squads`
- `activeMissions`
- `equipment`

## Save System

The game auto-saves to `localStorage` every 10 seconds using the `idleArmySave` key.

Progress is restored on page load in the same browser.

## File Structure

```text
.
├── index.html
├── game.js
└── README.md
```

## License

MIT
