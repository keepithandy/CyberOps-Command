# Legion Forge

Legion Forge is an idle army management game built in vanilla JavaScript.

## Overview

Recruit soldiers, organize them into squads, send them on missions, collect rewards, and grow a persistent legion over time.

## Current Features

- Recruit multiple soldier types with different stats, costs, and abilities
- Track soldiers individually with levels, experience, and equipment
- Create squads and manage squad membership
- Start missions with time-based completion and rewards
- Earn gold, experience, and equipment from completed missions
- Persist game state in `localStorage`

## How to Play

1. Recruit your first soldiers using starting gold
2. Create a squad and add soldiers to it
3. Select an available mission and assign a squad
4. Wait for the mission to complete
5. Collect rewards and improve your army

## File Structure

```text
.
├── index.html
├── game.js
└── README.md
```

## Running the Game

1. Clone or copy all files into a directory
2. Open `index.html` in a web browser
3. No build step or server is required

## Architecture Notes

### Game State

All state is stored in the `game` object:

- `gold` - Currency
- `soldiers` - Array of soldier objects
- `squads` - Array of squad objects
- `activeMissions` - Array of currently running missions
- `equipment` - Array of generated equipment items

### Core Classes

- `Soldier` - Individual unit with stats, level, experience, and equipment
- `Squad` - Container for up to 5 soldiers with mission readiness checks
- `ActiveMission` - Tracks running mission progress and completion rewards

### Game Loop

The game updates mission progress continuously and re-renders the UI when state changes.

## Save System

The game currently saves automatically to `localStorage` every 10 seconds using the `idleArmySave` key.

Load behavior restores the saved game state on page load. This means progress is preserved across refreshes in the same browser.

## License

MIT
