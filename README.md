# ⚡ CyberOps: Command
**Deploy. Infiltrate. Dominate.**

An idle army management game where you recruit, equip, and deploy elite cyber operatives on covert missions. Build your intelligence agency from the ground up—one operative at a time.

> **Current Version:** `0.0.1 Alpha`  
> **Status:** Playable Early Prototype  
> **Built with:** Vanilla JavaScript (no frameworks, no build steps)

---

## 🎮 Quick Start

1. Open `index.html` in any modern web browser
2. You start with 5,000 credits—use them to recruit your first operatives
3. Organize recruits into task forces (squads)
4. Deploy task forces on cyber operations to earn credits and experience
5. Equip fallen enemies' tech to boost your operatives' abilities
6. Unlock harder missions as your operatives level up

**That's it.** No installation, no dependencies, no fuss.

---

## 🎯 Core Gameplay Loop

```
Recruit → Equip → Organize → Deploy → Earn → Upgrade → Repeat
```

### 1. **Recruit** Elite Operatives
Choose from five operative archetypes, each with unique abilities:
- **Operative** (Tactical Strike) — balanced attacker
- **Netrunner** (Code Injection) — hacker specialist
- **Enforcer** (Firewall) — heavy tank
- **Augmented** (System Override) — cyborg damage dealer
- **Commando** (Blitzkrieg) — elite glass cannon

### 2. **Equip** with Cyber Augmentations
Earn loot from missions and outfit operatives with:
- **Offensive Gear:** Neural Processors, Combat Algorithms, AI Combat Suites
- **Defensive Tech:** Reactive Bodysuits, Tactical Exoskeletons, Quantum Shielding
- **Exotic Augments:** Nanotech Armor, Enhanced Reflexes, Regenerative Implants

Each item has a rarity tier—legendary gear provides massive stat boosts.

### 3. **Organize** into Task Forces
Group up to 5 operatives per squad. Squad composition matters:
- Balanced teams for medium ops
- Heavy tanks for dangerous infiltrations
- Speed-focused squads for quick hits

### 4. **Deploy** on Cyber Operations
Seven campaign missions await, from easy perimeter scans to endgame Global Cyberwar ops:

| Mission | Duration | Credits | Exp | Min Level | Loot |
|---------|----------|---------|-----|-----------|------|
| Perimeter Scan | 3s | 100 | 40 | 1 | Scanning Module |
| Firewall Probe | 5s | 200 | 60 | 1 | Encryption Key |
| Data Exfiltration | 8s | 350 | 100 | 2 | Classified Archive |
| Network Infiltration | 10s | 400 | 120 | 2 | Access Protocol |
| Corporate Espionage | 15s | 600 | 180 | 4 | Proprietary Tech |
| Satellite Takeover | 20s | 1,000 | 300 | 5 | Orbital Controller |
| Global Cyberwar | 30s | 2,000 | 600 | 8 | Quantum Processor |

### 5. **Level Up** Your Operatives
Each operative gains experience from successful missions. Leveling increases:
- HP (survivability)
- DMG (mission success rate)
- DEF (armor effectiveness)

Higher-level operatives unlock tougher operations and increase mission success rates.

### 6. **Earn & Repeat**
Completed missions reward credits and loot. Reinvest into recruitment, upgrades, and new gear. Watch your intelligence agency grow.

---

## 📊 Game State & Resources

### **Credits**
Your primary currency. Spend credits to recruit new operatives—costs scale with operative tier.

### **Operatives**
Individual agents tracked with:
- Name, class, and unique ability
- Level and cumulative experience
- Base stats (HP, DMG, DEF)
- Equipped augmentations

### **Task Forces**
Squads hold up to 5 operatives and deploy as a unit. Squad strength is the sum of member stats plus all equipped gear.

### **Active Operations**
Once deployed, a mission continues running. Track progress on a real-time bar. Claim rewards automatically when complete.

### **Equipment**
Loot drops from missions in five rarity tiers:
- **Common** (grey) — Basic augmentations
- **Uncommon** (green) — Solid upgrades
- **Rare** (blue) — Powerful stat boosts
- **Epic** (purple) — Significant power spikes
- **Legendary** (gold) — Endgame gear

---

## 📈 Progression Systems

### **Soldier Leveling**
Operatives gain experience on every mission. Accumulated experience triggers level-ups that permanently improve stats.

### **Equipment Rarity**
Each piece of gear has a rarity that determines its power. Legendary items have the highest impact; common items are plentiful but weak.

### **Mission Difficulty Tiers**
- **Tier 1 (Difficulty 1):** Early-game tutorials
- **Tier 2 (Difficulty 2):** Mid-game challenges
- **Tier 3 (Difficulty 3):** Late-game operations
- **Tier 4 (Difficulty 4):** Endgame supremacy

Each tier requires higher operative levels and better gear.

### **Economy Scaling**
As you progress, mission rewards and recruitment costs both increase. Early operatives are cheap; elite-tier recruits cost significantly more but offer superior stats.

---

## 🛠️ Development Roadmap

### Phase 1 ✅ **UI & Architecture**
- [x] Dark command-center interface
- [x] Responsive desktop/mobile layout
- [x] Real-time mission tracking
- [x] Notification system

### Phase 2 🔄 **Core Systems** (Current)
- [x] Soldier recruitment & leveling
- [x] Squad organization
- [x] Equipment system with rarity tiers
- [x] Mission deployment & completion
- [x] Reward collection and stat scaling
- [ ] **localStorage persistence** (coming soon)

### Phase 3 🚀 **Progression & Polish**
- [ ] Offline progression (earn credits while closed)
- [ ] Research tree / tech upgrades
- [ ] Squad ability combos (synergy bonuses)
- [ ] Better visual feedback on stat changes

### Phase 4 🌍 **Expansion Content**
- [ ] 10+ additional operative classes
- [ ] 20+ new cyber operations
- [ ] Prestige/rebirth system
- [ ] Weekly challenges & leaderboards

### Phase 5 ∞ **Long-Term Systems**
- [ ] Territory control mechanics
- [ ] Rival agency AI
- [ ] Endgame meta-progression
- [ ] Audio & particle effects

---

## 💾 Save Your Progress

**Currently, game state is lost on page refresh.** To enable auto-save, this coming soon:

```javascript
// Manual save (paste into browser console)
localStorage.setItem('cyberopsState', JSON.stringify(game));

// Manual load (paste into browser console)
const saved = localStorage.getItem('cyberopsState');
if (saved) Object.assign(game, JSON.parse(saved));
```

---

## 🏗️ Architecture

### **File Structure**
```
.
├── index.html       # UI layout & dark military styling
├── game.js          # Core game logic & systems
├── README.md        # This file
├── LICENSE          # MIT License
└── .gitignore       # Git config
```

### **Core Classes**

**Soldier**
```javascript
{
  id, name, class, level, experience,
  baseHp, baseDmg, baseDef,
  equipmentIds[], ability, squadId
}
```

**Squad**
```javascript
{
  id, name, members[],
  combatPower  // sum of member stats
}
```

**ActiveMission**
```javascript
{
  id, missionId, squadId,
  startTime, elapsed, rewards
}
```

### **Game Loop**
Runs every 100ms:
1. Update active mission timers
2. Check for mission completion
3. Apply rewards to operatives
4. Re-render all UI panels

This lightweight loop keeps the game responsive even with 100+ operatives and multiple simultaneous missions.

---

## 🎨 Design Philosophy

**CyberOps: Command** embraces a cyberpunk military aesthetic:
- Dark blue command-center interface with glowing accents
- Uppercase labels and technical terminology
- Real-time progress bars and stat displays
- Notification system for mission events
- Responsive on desktop and mobile

The UI remains clean and readable as your army grows from a handful of recruits to a full intelligence agency.

---

## 🤖 Operative Abilities Reference

Each operative class has a unique special ability (flavor text for now; combat effects incoming):

| Class | Ability | Playstyle |
|-------|---------|-----------|
| Operative | Tactical Strike | All-rounder damage |
| Netrunner | Code Injection | Hacker infiltration |
| Enforcer | Firewall | Damage mitigation |
| Augmented | System Override | Peak damage output |
| Commando | Blitzkrieg | Speed-focused assault |

---

## ⚙️ Technical Notes

### **Browser Support**
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### **Performance**
- Zero external dependencies—pure vanilla JS
- Game loop runs at 10Hz (100ms ticks) for optimal performance
- Mission calculations are O(n) where n = active missions (negligible load)
- Tested with 50+ operatives without lag

### **Extending the Game**

**Add a New Operative Class:**
```javascript
RECRUIT_TEMPLATES.push({
  name: 'Specialist',
  class: 'Infiltrator',
  cost: 200,
  hp: 14,
  dmg: 5,
  def: 2,
  ability: 'Stealth Protocol'
});
```

**Add a New Mission:**
```javascript
MISSIONS.push({
  id: 'blacksite-raid',
  name: 'Blacksite Raid',
  duration: 25,
  gold: 1500,
  exp: 400,
  loot: 'Experimental Weapon',
  minLevel: 6,
  difficulty: 3,
  rewards: 5
});
```

**Add Equipment:**
```javascript
EQUIPMENT_POOL.push({
  name: 'Plasma Augment',
  rarity: 'legendary',
  dmg: 15,
  def: 0,
  hp: 0
});
```

---

## 📝 License

Built by **Northline Studio**.  
Released under the MIT License—fork, experiment, and build on this foundation.

---

## 🎯 What's Next?

- **Save System:** Persistent progress via localStorage (next priority)
- **Offline Earnings:** Missions continue while you're away (50% reduced rate)
- **Squad Synergies:** Bonuses for matching operative classes
- **Event System:** Weekly limited-time operations with unique rewards

Join the command center. Deploy your operatives. Dominate the digital battlefield.

**CyberOps: Command** — Version 0.0.1 Alpha
