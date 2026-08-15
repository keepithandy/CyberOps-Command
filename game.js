// ============================================================================
// CyberOps:Command - 0.0.0.1 Alpha Prototype
// ============================================================================

// Game State
const game = {
  gold: 5000,
  totalEarned: 5000,
  soldiers: [],
  squads: [],
  activeMissions: [],
  equipment: [],
  soldierIdCounter: 0,
  squadIdCounter: 0,
  missionIdCounter: 0,
  equipmentIdCounter: 0,
  totalMissionsCompleted: 0,
  totalSoldiersRecruited: 0,
  playtime: 0,
  notifications: [],
};

// Equipment Rarity System
const RARITY_COLORS = {
  common: '#888',
  uncommon: '#4ade80',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
};

// Equipment Templates - Cyber Augmentations & Tech
const EQUIPMENT_POOL = [
  { name: 'Neural Processor', rarity: 'common', dmg: 2, def: 0, hp: 0 },
  { name: 'Combat Algorithm', rarity: 'uncommon', dmg: 4, def: 0, hp: 0 },
  { name: 'AI Combat Suite', rarity: 'epic', dmg: 8, def: 0, hp: 0 },
  { name: 'Reactive Bodysuit', rarity: 'common', dmg: 0, def: 1, hp: 2 },
  { name: 'Tactical Exoskeleton', rarity: 'uncommon', dmg: 0, def: 3, hp: 5 },
  { name: 'Quantum Shielding', rarity: 'rare', dmg: 0, def: 6, hp: 12 },
  { name: 'Nanotech Armor', rarity: 'legendary', dmg: 2, def: 10, hp: 20 },
  { name: 'Enhanced Reflexes', rarity: 'uncommon', dmg: 0, def: 0, hp: 10 },
  { name: 'Regenerative Implant', rarity: 'epic', dmg: 0, def: 0, hp: 30 },
];

// Recruitment Templates - Cyber Soldier Operatives
const RECRUIT_TEMPLATES = [
  { name: 'Operative', class: 'Operative', cost: 50, hp: 12, dmg: 4, def: 1, ability: 'Tactical Strike' },
  { name: 'Netrunner', class: 'Hacker', cost: 75, hp: 10, dmg: 3, def: 1, ability: 'Code Injection' },
  { name: 'Enforcer', class: 'Tank', cost: 100, hp: 18, dmg: 2, def: 4, ability: 'Firewall' },
  { name: 'Augmented', class: 'Cyborg', cost: 120, hp: 8, dmg: 6, def: 1, ability: 'System Override' },
  { name: 'Commando', class: 'Elite', cost: 150, hp: 15, dmg: 7, def: 1, ability: 'Blitzkrieg' },
];

const MISSIONS = [
  { id: 'perimeter-scan', name: 'Perimeter Scan', duration: 3, gold: 100, exp: 40, loot: 'Scanning Module', minLevel: 1, difficulty: 1, rewards: 2 },
  { id: 'firewall-probe', name: 'Firewall Probe', duration: 5, gold: 200, exp: 60, loot: 'Encryption Key', minLevel: 1, difficulty: 1, rewards: 2 },
  { id: 'data-breach', name: 'Data Exfiltration', duration: 8, gold: 350, exp: 100, loot: 'Classified Archive', minLevel: 2, difficulty: 2, rewards: 3 },
  { id: 'network-infiltration', name: 'Network Infiltration', duration: 10, gold: 400, exp: 120, loot: 'Access Protocol', minLevel: 2, difficulty: 2, rewards: 3 },
  { id: 'corporate-espionage', name: 'Corporate Espionage', duration: 15, gold: 600, exp: 180, loot: 'Proprietary Tech', minLevel: 4, difficulty: 3, rewards: 4 },
  { id: 'satellite-takeover', name: 'Satellite Takeover', duration: 20, gold: 1000, exp: 300, loot: 'Orbital Controller', minLevel: 5, difficulty: 3, rewards: 5 },
  { id: 'global-cyberwar', name: 'Global Cyberwar', duration: 30, gold: 2000, exp: 600, loot: 'Quantum Processor', minLevel: 8, difficulty: 4, rewards: 6 },
];

// ============================================================================
// SOLDIER CLASS
// ============================================================================

class Soldier {
  constructor(template, id) {
    this.id = id;
    this.name = `${template.name} #${id}`;
    this.class = template.class;
    this.level = 1;
    this.experience = 0;
    this.baseHp = template.hp;
    this.baseDmg = template.dmg;
    this.baseDef = template.def;
    this.equipmentIds = [];
    this.ability = template.ability;
    this.abilityCooldown = 0;
    this.squadId = null;
  }

  get hp() {
    let total = this.baseHp;
    game.equipment.filter(e => this.equipmentIds.includes(e.id)).forEach(eq => {
      total += eq.hp;
    });
    return total;
  }

  get dmg() {
    let total = this.baseDmg;
    game.equipment.filter(e => this.equipmentIds.includes(e.id)).forEach(eq => {
      total += eq.dmg;
    });
    return total;
  }

  get def() {
    let total = this.baseDef;
    game.equipment.filter(e => this.equipmentIds.includes(e.id)).forEach(eq => {
      total += eq.def;
    });
    return total;
  }

  gainExperience(amount) {
    this.experience += amount;
    const expToLevel = 100;
    while (this.experience >= expToLevel) {
      this.level += 1;
      this.experience -= expToLevel;
      this.baseHp += 3;
      this.baseDmg += 1.5;
      this.baseDef += 0.8;
    }
  }

  equipItem(equipmentId) {
    const equipment = game.equipment.find(e => e.id === equipmentId);
    if (equipment && !equipment.ownerId) {
      equipment.ownerId = this.id;
      this.equipmentIds.push(equipmentId);
      return true;
    }
    return false;
  }

  unequipItem(equipmentId) {
    const idx = this.equipmentIds.indexOf(equipmentId);
    if (idx >= 0) {
      this.equipmentIds.splice(idx, 1);
      const equipment = game.equipment.find(e => e.id === equipmentId);
      if (equipment) equipment.ownerId = null;
      return true;
    }
    return false;
  }
}

// ============================================================================
// SQUAD CLASS
// ============================================================================

class Squad {
  constructor(id) {
    this.id = id;
    this.name = `Squad ${id}`;
    this.memberIds = [];
    this.completedMissions = 0;
  }

  addMember(soldier) {
    if (this.memberIds.length < 5) {
      this.memberIds.push(soldier.id);
      soldier.squadId = this.id;
      return true;
    }
    return false;
  }

  removeMember(soldierId) {
    const idx = this.memberIds.indexOf(soldierId);
    if (idx >= 0) {
      this.memberIds.splice(idx, 1);
      const soldier = game.soldiers.find(s => s.id === soldierId);
      if (soldier) soldier.squadId = null;
      return true;
    }
    return false;
  }

  getMembers() {
    return game.soldiers.filter(s => this.memberIds.includes(s.id));
  }

  getAverageLevel() {
    if (this.memberIds.length === 0) return 0;
    const members = this.getMembers();
    const total = members.reduce((sum, s) => sum + s.level, 0);
    return Math.floor(total / members.length);
  }

  getTotalDamage() {
    return this.getMembers().reduce((sum, s) => sum + s.dmg, 0);
  }

  getTotalDefense() {
    return this.getMembers().reduce((sum, s) => sum + s.def, 0);
  }

  getTotalHealth() {
    return this.getMembers().reduce((sum, s) => sum + s.hp, 0);
  }

  getSquadBonus() {
    // Squad size bonus: 5% per member, up to 25%
    return Math.min(this.memberIds.length * 0.05, 0.25);
  }

  canCompleteOfficially(mission) {
    return this.getAverageLevel() >= mission.minLevel && this.memberIds.length > 0;
  }

  getRecommendedMissions() {
    const avgLevel = this.getAverageLevel();
    return MISSIONS.filter(m => m.minLevel <= avgLevel && m.difficulty <= Math.ceil(avgLevel / 2));
  }
}

// ============================================================================
// MISSION LOGIC
// ============================================================================

class ActiveMission {
  constructor(squadId, mission, missionId) {
    this.id = missionId;
    this.squadId = squadId;
    this.mission = mission;
    this.startTime = Date.now();
    this.durationMs = mission.duration * 1000;
  }

  getProgress() {
    const elapsed = Date.now() - this.startTime;
    return Math.min(elapsed / this.durationMs, 1);
  }

  isComplete() {
    return this.getProgress() >= 1;
  }

  complete() {
    const squad = game.squads.find(s => s.id === this.squadId);
    if (!squad) return;

    const members = squad.getMembers();
    const memberCount = Math.max(members.length, 1);

    // Distribute experience to all soldiers
    const expPerSoldier = Math.floor(this.mission.exp / memberCount);
    members.forEach(soldier => {
      soldier.gainExperience(expPerSoldier);
    });

    // Award base gold with squad bonus
    const squadBonus = 1 + squad.getSquadBonus();
    const goldReward = Math.floor(this.mission.gold * squadBonus);
    game.gold += goldReward;
    game.totalEarned += goldReward;

    // Generate equipment rewards (1-3 pieces)
    const numRewards = Math.min(this.mission.rewards, 3);
    for (let i = 0; i < numRewards; i++) {
      const equipment = generateRandomEquipment();
      game.equipment.push(equipment);
    }

    squad.completedMissions += 1;
    game.totalMissionsCompleted += 1;

    // Notification
    addNotification(`✅ ${this.mission.name} complete! +${goldReward} credits`, 'success');
  }
}

function generateRandomEquipment() {
  const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  const weights = [50, 35, 12, 2, 1];
  const rand = Math.random() * 100;
  let cumulative = 0;
  let selectedRarity = 'common';
  
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (rand <= cumulative) {
      selectedRarity = rarities[i];
      break;
    }
  }

  const candidates = EQUIPMENT_POOL.filter(e => e.rarity === selectedRarity);
  const template = candidates[Math.floor(Math.random() * candidates.length)];
  
  return {
    id: game.equipmentIdCounter++,
    name: template.name,
    rarity: template.rarity,
    dmg: template.dmg,
    def: template.def,
    hp: template.hp,
    ownerId: null,
  };
}

function addNotification(message, type = 'info') {
  game.notifications.push({
    message,
    type,
    timestamp: Date.now(),
    id: Math.random(),
  });
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    game.notifications = game.notifications.filter(n => n.message !== message);
    updateNotifications();
  }, 3000);
  
  updateNotifications();
}

// ============================================================================
// GAME LOGIC
// ============================================================================

function recruitSoldier(template) {
  if (game.gold < template.cost) {
    addNotification('Insufficient credits!', 'error');
    return;
  }

  game.gold -= template.cost;
  game.totalSoldiersRecruited += 1;
  const soldier = new Soldier(template, game.soldierIdCounter++);
  game.soldiers.push(soldier);
  addNotification(`⚡ ${soldier.name} deployed!`, 'success');
  render();
}

function createSquad() {
  const squad = new Squad(game.squadIdCounter++);
  game.squads.push(squad);
  addNotification(`🚀 ${squad.name} assembled!`, 'success');
  render();
}

function addToSquad(squadId, soldierId) {
  const squad = game.squads.find(s => s.id === squadId);
  const soldier = game.soldiers.find(s => s.id === soldierId);
  if (squad && soldier && !soldier.squadId) {
    squad.addMember(soldier);
    addNotification(`✓ ${soldier.name} added to ${squad.name}`, 'success');
    render();
  }
}

function removeFromSquad(soldierId) {
  const soldier = game.soldiers.find(s => s.id === soldierId);
  if (soldier && soldier.squadId !== null) {
    const squad = game.squads.find(s => s.id === soldier.squadId);
    if (squad) {
      squad.removeMember(soldierId);
      addNotification(`↩️ ${soldier.name} removed from ${squad.name}`, 'info');
      render();
    }
  }
}

function startMission(squadId, missionId) {
  const squad = game.squads.find(s => s.id === squadId);
  const mission = MISSIONS.find(m => m.id === missionId);

  if (!squad || !mission) return;
  if (!squad.canCompleteOfficially(mission)) {
    addNotification(`Squad clearance insufficient for ${mission.name}`, 'error');
    return;
  }

  const activeMission = new ActiveMission(squadId, mission, game.missionIdCounter++);
  game.activeMissions.push(activeMission);
  addNotification(`🎯 ${squad.name} executing: ${mission.name}...`, 'info');
  render();
}

function deleteSoldier(soldierId) {
  const soldier = game.soldiers.find(s => s.id === soldierId);
  if (soldier) {
    if (soldier.squadId !== null) {
      removeFromSquad(soldierId);
    }
    // Drop equipment
    soldier.equipmentIds.forEach(eqId => {
      const eq = game.equipment.find(e => e.id === eqId);
      if (eq) eq.ownerId = null;
    });
    game.soldiers = game.soldiers.filter(s => s.id !== soldierId);
    addNotification(`⛔ ${soldier.name} decommissioned`, 'info');
    render();
  }
}

function deleteSquad(squadId) {
  const squad = game.squads.find(s => s.id === squadId);
  if (squad) {
    // Remove all members
    [...squad.memberIds].forEach(soldierId => {
      removeFromSquad(soldierId);
    });
    game.squads = game.squads.filter(s => s.id !== squadId);
    addNotification(`🔌 ${squad.name} disbanded`, 'info');
    render();
  }
}

function equipItemToSoldier(soldierId, equipmentId) {
  const soldier = game.soldiers.find(s => s.id === soldierId);
  const equipment = game.equipment.find(e => e.id === equipmentId);
  if (soldier && equipment) {
    soldier.equipItem(equipmentId);
    addNotification(`${soldier.name} equipped ${equipment.name}`, 'success');
    render();
  }
}

function dropEquipment(equipmentId) {
  const equipment = game.equipment.find(e => e.id === equipmentId);
  if (equipment && equipment.ownerId) {
    const soldier = game.soldiers.find(s => s.id === equipment.ownerId);
    if (soldier) {
      soldier.unequipItem(equipmentId);
    }
    game.equipment = game.equipment.filter(e => e.id !== equipmentId);
    render();
  }
}

function updateActiveMissions() {
  let missionCompleted = false;
  game.activeMissions = game.activeMissions.filter(m => {
    if (m.isComplete()) {
      m.complete();
      missionCompleted = true;
      return false;
    }
    return true;
  });
  return missionCompleted;
}

// Auto-save every 10 seconds
setInterval(() => {
  localStorage.setItem('idleArmySave', JSON.stringify(game));
}, 10000);

// Load game from localStorage
function loadGame() {
  const saved = localStorage.getItem('idleArmySave');
  if (saved) {
    const data = JSON.parse(saved);
    Object.assign(game, data);
  }
}

function resetGame() {
  if (confirm('Are you sure? This will reset all progress!')) {
    localStorage.removeItem('idleArmySave');
    location.reload();
  }
}

// ============================================================================
// RENDER
// ============================================================================

function render() {
  const missionCompleted = updateActiveMissions();
  renderResources();
  renderRecruitment();
  renderSoldiers();
  renderSquads();
  renderMissions();
  renderActiveMissions();
  if (missionCompleted) updateMissionProgressDisplay();
}

function renderResources() {
  document.getElementById('goldDisplay').textContent = game.gold.toLocaleString();
  document.getElementById('soldierCountDisplay').textContent = game.soldiers.length;
  const statsEl = document.getElementById('gameStats');
  if (statsEl) {
    statsEl.innerHTML = `
      Ops: ${game.totalMissionsCompleted} | 
      Deployed: ${game.totalSoldiersRecruited} | 
      Gear: ${game.equipment.length}
    `;
  }
}

function renderRecruitment() {
  const container = document.getElementById('recruitOptions');
  container.innerHTML = RECRUIT_TEMPLATES.map((template, idx) => {
    const canAfford = game.gold >= template.cost;
    return `
      <div class="recruit-option">
        <div class="recruit-info">
          <span class="soldier-name">${template.name} — ${template.class}</span>
          <span class="soldier-stats">❤️ ${template.hp} HP | ⚔️ ${template.dmg} Power | 🛡️ ${template.def} Defense | 🔧 ${template.ability}</span>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span class="cost">${template.cost}</span>
          <button onclick="recruitSoldier(RECRUIT_TEMPLATES[${idx}])" ${!canAfford ? 'disabled' : ''} class="btn-recruit">
            Deploy
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function renderSoldiers() {
  const container = document.getElementById('soldiersList');
  if (game.soldiers.length === 0) {
    container.innerHTML = '<div class="empty-state">� No operatives deployed yet. Deploy your first!</div>';
    return;
  }

  container.innerHTML = game.soldiers.map(soldier => {
    const inSquad = soldier.squadId !== null;
    const equipment = game.equipment.filter(e => soldier.equipmentIds.includes(e.id));
    
    return `
      <div class="soldier-item" style="opacity: ${inSquad ? '1' : '0.7'}">
        <div class="soldier-left">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="soldier-name-display">${soldier.name}</span>
            <span class="soldier-class-badge">${soldier.class}</span>
          </div>
          <div class="soldier-level">
            LVL ${soldier.level} (${soldier.experience}/100 xp) | ❤️ ${soldier.hp.toFixed(1)} | ⚔️ ${soldier.dmg.toFixed(1)} | 🛡️ ${soldier.def.toFixed(1)}
          </div>
          ${equipment.length > 0 ? `<div class="soldier-equipment">${equipment.map(e => `<span class="eq-tag" style="color: ${RARITY_COLORS[e.rarity]}">${e.name}</span>`).join('')}</div>` : ''}
        </div>
        <div class="soldier-actions">
          ${!inSquad ? `
            <button onclick="createSquadAndAdd(${soldier.id})" class="btn-small">+ Task</button>
          ` : `
            <button onclick="removeFromSquad(${soldier.id})" class="btn-small">Remove</button>
          `}
          <button onclick="deleteSoldier(${soldier.id})" class="btn-small btn-danger">✕</button>
        </div>
      </div>
    `;
  }).join('');
}

function renderSquads() {
  const container = document.getElementById('squadsList');
  if (game.squads.length === 0) {
    container.innerHTML = '<div class="empty-state">� No task forces assembled. Create one!</div>';
    const btn = document.createElement('button');
    btn.textContent = '+ Assemble Task Force';
    btn.onclick = createSquad;
    btn.style.marginTop = '12px';
    btn.style.width = '100%';
    container.appendChild(btn);
    return;
  }

  container.innerHTML = game.squads.map(squad => {
    const members = squad.getMembers();
    const avgLevel = squad.getAverageLevel();
    const bonus = Math.floor(squad.getSquadBonus() * 100);
    
    return `
      <div class="squad-item">
        <div class="squad-header">
          <span class="squad-name">${squad.name}</span>
          <span class="squad-stats">Lvl ${avgLevel} | ${members.length}/5 | Ops: ${squad.completedMissions}</span>
        </div>
        <div class="squad-stats" style="font-size: 11px;">
          ⚔️ ${squad.getTotalDamage().toFixed(1)} | 🛡️ ${squad.getTotalDefense().toFixed(1)} | ❤️ ${Math.floor(squad.getTotalHealth())} | Bonus: +${bonus}%
        </div>
        <div class="squad-members">
          ${members.length === 0 ? '<span class="squad-stats">Empty</span>' : members.map(m => `<div class="member-badge">${m.name}</div>`).join('')}
        </div>
        <div class="squad-actions">
          <button onclick="deleteSquad(${squad.id})" class="btn-small btn-danger">Disband</button>
        </div>
      </div>
    `;
  }).join('');

  const btn = document.createElement('button');
  btn.textContent = '+ Assemble Task Force';
  btn.onclick = createSquad;
  btn.style.marginTop = '12px';
  btn.style.width = '100%';
  container.appendChild(btn);
}

function renderMissions() {
  const container = document.getElementById('missionsList');
  const squadsWithMembers = game.squads.filter(s => s.memberIds.length > 0);

  if (squadsWithMembers.length === 0) {
    container.innerHTML = '<div class="empty-state">� Assemble a task force to start operations!</div>';
    return;
  }

  container.innerHTML = MISSIONS.map(mission => {
    const eligibleSquads = squadsWithMembers.filter(s => s.canCompleteOfficially(mission));
    const canStart = eligibleSquads.length > 0;
    
    return `
      <div class="mission-item" style="border-left: 4px solid ${['#888', '#4ade80', '#3b82f6', '#a855f7', '#f59e0b'][mission.difficulty]}">
        <div class="mission-info">
          <span class="mission-name">${mission.name}</span>
          <span class="mission-reward">⏱️ ${mission.duration}s | 💰 ${mission.gold} cr | ✨ ${mission.exp}xp | 🎁 ${mission.rewards} ${mission.loot} | Lvl ${mission.minLevel}+</span>
        </div>
        <div class="mission-actions">
          ${eligibleSquads.length === 0 ? '<span class="mission-unavailable">CLEARANCE DENIED</span>' : eligibleSquads.map(squad => `
            <button onclick="startMission(${squad.id}, '${mission.id}')" class="btn-mission-small">
              ${squad.name}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function renderActiveMissions() {
  const container = document.getElementById('activeMissions');
  if (game.activeMissions.length === 0) {
    container.innerHTML = '<div class="empty-state">⚔️ No active missions.</div>';
    return;
  }

  container.innerHTML = game.activeMissions.map(mission => {
    const squad = game.squads.find(s => s.id === mission.squadId);
    const progress = mission.getProgress() * 100;
    const timeRemaining = Math.ceil((1 - mission.getProgress()) * mission.mission.duration);
    
    return `
      <div class="mission-run" data-mission-id="${mission.id}">
        <div class="mission-run-header">
          <span class="mission-run-name">
            ${squad.name} — ${mission.mission.name}
          </span>
          <span class="mission-run-time" data-mission-time="${mission.id}">${timeRemaining}s</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" data-mission-progress="${mission.id}" style="width: ${progress}%"></div>
        </div>
        <div class="mission-rewards-preview">
          💰 ${mission.mission.gold} | ✨ ${mission.mission.exp} | 🎁 ${mission.mission.rewards}x loot
        </div>
      </div>
    `;
  }).join('');
}

// Update mission progress bars and timers (called frequently for smooth animation)
function updateMissionProgressDisplay() {
  game.activeMissions.forEach(mission => {
    const progressEl = document.querySelector(`[data-mission-progress="${mission.id}"]`);
    const timeEl = document.querySelector(`[data-mission-time="${mission.id}"]`);
    
    if (progressEl) {
      const progress = mission.getProgress() * 100;
      progressEl.style.width = progress + '%';
    }
    
    if (timeEl) {
      const timeRemaining = Math.ceil((1 - mission.getProgress()) * mission.mission.duration);
      timeEl.textContent = timeRemaining + 's';
    }
  });
}

function updateNotifications() {
  const container = document.getElementById('notifications');
  if (!container) return;
  
  container.innerHTML = game.notifications.map(n => `
    <div class="notification notification-${n.type}">
      ${n.message}
    </div>
  `).join('');
}

// ============================================================================
// UI HELPERS
// ============================================================================

function createSquadAndAdd(soldierId) {
  const soldier = game.soldiers.find(s => s.id === soldierId);
  if (!soldier) return;
  
  // Add to the first (oldest) squad if one exists
  if (game.squads.length > 0) {
    game.squads[0].addMember(soldier);
    addNotification(`✓ ${soldier.name} assigned to ${game.squads[0].name}`, 'success');
  } else {
    // Create a new squad if none exist
    const squad = new Squad(game.squadIdCounter++);
    game.squads.push(squad);
    squad.addMember(soldier);
    addNotification(`🚀 ${squad.name} formed with ${soldier.name}`, 'success');
  }
  render();
}

// ============================================================================
// GAME LOOP
// ============================================================================

// Fast loop for smooth progress bar animation (updates every 50ms)
setInterval(() => {
  const missionCompleted = updateActiveMissions();
  updateMissionProgressDisplay();
  // Re-render UI if a mission just completed to show rewards
  if (missionCompleted) {
    render();
  }
}, 50);

// Initial render
window.addEventListener('load', () => {
  loadGame();
  render();
});
render();
