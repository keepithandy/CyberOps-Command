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
  formations: [],
  equipment: [],
  soldierIdCounter: 0,
  squadIdCounter: 0,
  missionIdCounter: 0,
  equipmentIdCounter: 0,
  formationIdCounter: 0,
  totalMissionsCompleted: 0,
  totalSoldiersRecruited: 0,
  playtime: 0,
  intel: 0,
  supplies: 100,
  lastReadinessRecovery: Date.now(),
  notifications: [],
};

const SAVE_KEY = 'idleArmySave';

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

const FORMATION_DEFINITIONS = {
  platoon: { label: 'Platoon', childLabel: 'squads', requiredSquads: 3, leader: 'Lieutenant', bonus: 0.1 },
  company: { label: 'Company', childLabel: 'squads', requiredSquads: 9, leader: 'Captain', bonus: 0.2 },
  battalion: { label: 'Battalion', childLabel: 'squads', requiredSquads: 27, leader: 'Lieutenant Colonel', bonus: 0.3 },
  brigade: { label: 'Brigade', childLabel: 'squads', requiredSquads: 81, leader: 'Colonel', bonus: 0.4 },
  division: { label: 'Division', childLabel: 'squads', requiredSquads: 243, leader: 'Major General', bonus: 0.5 },
  corps: { label: 'Corps', childLabel: 'squads', requiredSquads: 729, leader: 'Lieutenant General', bonus: 0.6 },
  army: { label: 'Army', childLabel: 'squads', requiredSquads: 2187, leader: 'General', bonus: 0.75 },
};

const COMMAND_OPERATIONS = [
  { id: 'district-lockdown', name: 'District Lockdown', duration: 45, gold: 1200, exp: 260, loot: 'Tactical Cache', minLevel: 3, difficulty: 2, rewards: 4, commandLevel: 'platoon', requiredSquads: 3, supplies: 5 },
  { id: 'corporate-takeover', name: 'Corporate Takeover', duration: 90, gold: 3500, exp: 700, loot: 'Corporate Vault', minLevel: 6, difficulty: 3, rewards: 5, commandLevel: 'company', requiredSquads: 9, supplies: 15 },
  { id: 'national-cyberdefense', name: 'National Cyber Defense', duration: 180, gold: 9000, exp: 1800, loot: 'Strategic Archive', minLevel: 10, difficulty: 4, rewards: 6, commandLevel: 'battalion', requiredSquads: 27, supplies: 35 },
  { id: 'global-network-war', name: 'Global Network War', duration: 360, gold: 24000, exp: 5000, loot: 'Quantum Command Core', minLevel: 15, difficulty: 5, rewards: 6, commandLevel: 'brigade', requiredSquads: 81, supplies: 75 },
];

const ALL_MISSIONS = [...MISSIONS, ...COMMAND_OPERATIONS];

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
    if (equipment && equipment.ownerId === null) {
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
    this.readiness = 100;
    this.formationId = null;
  }

  addMember(soldier) {
    if (this.memberIds.length < 5 && soldier.squadId === null && !this.memberIds.includes(soldier.id)) {
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
    return ALL_MISSIONS.filter(m => !m.requiredSquads || m.requiredSquads === 1)
      .filter(m => m.minLevel <= avgLevel && m.difficulty <= Math.ceil(avgLevel / 2));
  }
}

class Formation {
  constructor(id, type, squadIds = []) {
    const definition = FORMATION_DEFINITIONS[type];
    this.id = id;
    this.type = definition ? type : 'platoon';
    this.name = `${definition ? definition.label : 'Platoon'} ${id}`;
    this.squadIds = squadIds;
    this.leaderId = null;
    this.status = 'ready';
    this.completedMissions = 0;
  }

  get definition() {
    return FORMATION_DEFINITIONS[this.type];
  }

  getSquads() {
    return game.squads.filter(squad => this.squadIds.includes(squad.id));
  }

  getMembers() {
    return this.getSquads().flatMap(squad => squad.getMembers());
  }

  getAverageLevel() {
    const members = this.getMembers();
    return members.length ? Math.floor(members.reduce((sum, member) => sum + member.level, 0) / members.length) : 0;
  }

  getStrength() {
    return this.getMembers().reduce((sum, member) => sum + member.dmg + member.def + member.hp, 0);
  }

  isComplete() {
    return this.squadIds.length >= this.definition.requiredSquads;
  }
}

// ============================================================================
// MISSION LOGIC
// ============================================================================

class ActiveMission {
  constructor(squadIds, mission, missionId, formationId = null) {
    this.id = missionId;
    this.squadIds = Array.isArray(squadIds) ? squadIds : [squadIds];
    this.squadId = this.squadIds[0];
    this.formationId = formationId;
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
    const squads = game.squads.filter(squad => this.squadIds.includes(squad.id));
    if (squads.length === 0) return;

    const members = squads.flatMap(squad => squad.getMembers());
    const memberCount = Math.max(members.length, 1);

    // Distribute experience to all soldiers
    const expPerSoldier = Math.floor(this.mission.exp / memberCount);
    members.forEach(soldier => {
      soldier.gainExperience(expPerSoldier);
    });

    // Award base gold with squad bonus
    const formation = game.formations.find(item => item.id === this.formationId);
    const commandBonus = formation ? formation.definition.bonus : Math.min(Math.max(squads.length - 1, 0) * 0.05, 0.25);
    const goldReward = Math.floor(this.mission.gold * (1 + commandBonus));
    game.gold += goldReward;
    game.totalEarned += goldReward;
    game.intel += this.mission.requiredSquads && this.mission.requiredSquads > 1 ? 1 : 0;
    game.supplies = Math.min(100, game.supplies + Math.max(1, Math.floor(this.mission.supplies || 1) / 2));

    // Generate equipment rewards (1-3 pieces)
    const numRewards = Math.min(this.mission.rewards, 3);
    for (let i = 0; i < numRewards; i++) {
      const equipment = generateRandomEquipment();
      game.equipment.push(equipment);
    }

    squads.forEach(squad => {
      squad.completedMissions += 1;
      squad.readiness = Math.max(0, squad.readiness - (this.mission.requiredSquads > 1 ? 20 : 8));
      if (!formation) squad.formationId = null;
    });
    if (formation) {
      formation.completedMissions += 1;
      formation.status = 'ready';
    }
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
  if (squad && soldier && soldier.squadId === null && squad.addMember(soldier)) {
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

function isSquadDeployed(squadId) {
  return game.activeMissions.some(mission => mission.squadIds.includes(squadId));
}

function getAvailableSquads() {
  return game.squads.filter(squad => !isSquadDeployed(squad.id) && squad.readiness >= 20);
}

function createFormation(type) {
  const definition = FORMATION_DEFINITIONS[type];
  if (!definition) return;
  const availableSquads = getAvailableSquads().filter(squad => squad.formationId === null);
  if (availableSquads.length < definition.requiredSquads) {
    addNotification(`${definition.label} requires ${definition.requiredSquads} ready squads.`, 'error');
    return;
  }

  const selectedSquads = availableSquads.slice(0, definition.requiredSquads);
  const formation = new Formation(game.formationIdCounter++, type, selectedSquads.map(squad => squad.id));
  const leader = formation.getMembers().sort((a, b) => b.level - a.level)[0];
  formation.leaderId = leader ? leader.id : null;
  game.formations.push(formation);
  selectedSquads.forEach(squad => { squad.formationId = formation.id; });
  addNotification(`🛡️ ${formation.name} organized with ${selectedSquads.length} squads.`, 'success');
  render();
}

function disbandFormation(formationId) {
  const formation = game.formations.find(item => item.id === formationId);
  if (!formation || formation.status === 'deployed') return;
  formation.squadIds.forEach(squadId => {
    const squad = game.squads.find(item => item.id === squadId);
    if (squad) squad.formationId = null;
  });
  game.formations = game.formations.filter(item => item.id !== formationId);
  addNotification(`Formation ${formation.name} disbanded.`, 'info');
  render();
}

function getMissionForce(mission) {
  const requiredSquads = mission.requiredSquads || 1;
  if (requiredSquads === 1) {
    const squad = getAvailableSquads().find(item => item.memberIds.length > 0 && item.canCompleteOfficially(mission));
    return squad ? { squadIds: [squad.id], formationId: null } : null;
  }

  const formation = game.formations.find(item =>
    item.type === mission.commandLevel && item.isComplete() && item.status === 'ready' &&
    item.getAverageLevel() >= mission.minLevel && item.getSquads().every(squad => !isSquadDeployed(squad.id))
  );
  if (formation) return { squadIds: formation.squadIds, formationId: formation.id };

  const squads = getAvailableSquads().filter(item => item.memberIds.length > 0);
  if (squads.length < requiredSquads) return null;
  const selected = squads.slice(0, requiredSquads);
  const members = selected.flatMap(squad => squad.getMembers());
  const averageLevel = members.length ? members.reduce((sum, member) => sum + member.level, 0) / members.length : 0;
  return averageLevel >= mission.minLevel
    ? { squadIds: selected.map(squad => squad.id), formationId: null }
    : null;
}

function startMission(squadId, missionId) {
  startMissionWithSquads([squadId], missionId);
}

function startMissionWithSquads(squadIds, missionId, formationId = null) {
  const mission = ALL_MISSIONS.find(item => item.id === missionId);
  const uniqueSquadIds = [...new Set(squadIds)];
  const squads = game.squads.filter(squad => uniqueSquadIds.includes(squad.id));
  const requiredSquads = mission?.requiredSquads || 1;

  if (!mission || squads.length !== uniqueSquadIds.length) return;
  if (squads.length < requiredSquads) {
    addNotification(`${mission.name} requires ${requiredSquads} squads.`, 'error');
    return;
  }
  if (squads.some(squad => squad.memberIds.length === 0 || isSquadDeployed(squad.id) || squad.readiness < 20)) {
    addNotification('One or more selected squads are unavailable.', 'error');
    return;
  }
  const members = squads.flatMap(squad => squad.getMembers());
  const averageLevel = members.length ? members.reduce((sum, member) => sum + member.level, 0) / members.length : 0;
  if (averageLevel < mission.minLevel) {
    addNotification(`Force level is too low for ${mission.name}.`, 'error');
    return;
  }
  if (game.supplies < (mission.supplies || 0)) {
    addNotification(`Insufficient supplies: ${mission.supplies} required.`, 'error');
    return;
  }

  game.supplies -= mission.supplies || 0;
  const activeMission = new ActiveMission(uniqueSquadIds, mission, game.missionIdCounter++, formationId);
  game.activeMissions.push(activeMission);
  squads.forEach(squad => {
    squad.readiness = Math.max(0, squad.readiness - (requiredSquads > 1 ? 10 : 4));
    if (formationId !== null) {
      const formation = game.formations.find(item => item.id === formationId);
      if (formation) formation.status = 'deployed';
    }
  });
  addNotification(`🎯 ${squads.length} squad${squads.length === 1 ? '' : 's'} executing: ${mission.name}...`, 'info');
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
    game.activeMissions = game.activeMissions.filter(mission => !mission.squadIds.includes(squadId));
    game.formations.forEach(formation => {
      formation.squadIds = formation.squadIds.filter(id => id !== squadId);
    });
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
  if (soldier && equipment && soldier.equipItem(equipmentId)) {
    addNotification(`${soldier.name} equipped ${equipment.name}`, 'success');
    render();
  }
}

function dropEquipment(equipmentId) {
  const equipment = game.equipment.find(e => e.id === equipmentId);
  if (equipment && equipment.ownerId !== null) {
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

function recoverReadiness() {
  const now = Date.now();
  const elapsedSeconds = Math.floor((now - game.lastReadinessRecovery) / 1000);
  if (elapsedSeconds < 1) return;
  game.lastReadinessRecovery = now;
  game.squads.forEach(squad => {
    if (!isSquadDeployed(squad.id)) squad.readiness = Math.min(100, squad.readiness + elapsedSeconds);
  });
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function restoreNumber(value, fallback, minimum = 0) {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.max(value, minimum)
    : fallback;
}

function restoreInstance(prototype, value, keys) {
  const instance = Object.create(prototype);
  keys.forEach(key => {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      instance[key] = value[key];
    }
  });
  return instance;
}

function restoreSoldier(value) {
  if (!isRecord(value)) return null;
  const soldier = restoreInstance(Soldier.prototype, value, [
    'id', 'name', 'class', 'level', 'experience', 'baseHp', 'baseDmg', 'baseDef',
    'equipmentIds', 'ability', 'abilityCooldown', 'squadId',
  ]);
  soldier.id = restoreNumber(value.id, 0);
  soldier.name = typeof value.name === 'string' ? value.name : `Operative #${soldier.id}`;
  soldier.class = typeof value.class === 'string' ? value.class : 'Operative';
  soldier.level = restoreNumber(value.level, 1, 1);
  soldier.experience = restoreNumber(value.experience, 0);
  soldier.baseHp = restoreNumber(value.baseHp, 1);
  soldier.baseDmg = restoreNumber(value.baseDmg, 1);
  soldier.baseDef = restoreNumber(value.baseDef, 0);
  soldier.equipmentIds = Array.isArray(value.equipmentIds)
    ? value.equipmentIds.filter(id => Number.isInteger(id))
    : [];
  soldier.ability = typeof value.ability === 'string' ? value.ability : '';
  soldier.abilityCooldown = restoreNumber(value.abilityCooldown, 0);
  soldier.squadId = Number.isInteger(value.squadId) ? value.squadId : null;
  return soldier;
}

function restoreSquad(value) {
  if (!isRecord(value)) return null;
  const squad = restoreInstance(Squad.prototype, value, ['id', 'name', 'memberIds', 'completedMissions', 'readiness', 'formationId']);
  squad.id = restoreNumber(value.id, 0);
  squad.name = typeof value.name === 'string' ? value.name : `Squad ${squad.id}`;
  squad.memberIds = Array.isArray(value.memberIds)
    ? value.memberIds.filter(id => Number.isInteger(id))
    : [];
  squad.completedMissions = restoreNumber(value.completedMissions, 0);
  squad.readiness = restoreNumber(value.readiness, 100, 0);
  squad.formationId = Number.isInteger(value.formationId) ? value.formationId : null;
  return squad;
}

function restoreFormation(value) {
  if (!isRecord(value) || !FORMATION_DEFINITIONS[value.type]) return null;
  const formation = restoreInstance(Formation.prototype, value, ['id', 'type', 'name', 'squadIds', 'leaderId', 'status', 'completedMissions']);
  formation.id = restoreNumber(value.id, 0);
  formation.type = value.type;
  formation.name = typeof value.name === 'string' ? value.name : `${FORMATION_DEFINITIONS[value.type].label} ${formation.id}`;
  formation.squadIds = Array.isArray(value.squadIds) ? value.squadIds.filter(id => Number.isInteger(id)) : [];
  formation.leaderId = Number.isInteger(value.leaderId) ? value.leaderId : null;
  formation.status = ['ready', 'deployed'].includes(value.status) ? value.status : 'ready';
  formation.completedMissions = restoreNumber(value.completedMissions, 0);
  return formation;
}

function restoreEquipment(value) {
  if (!isRecord(value)) return null;
  return {
    id: restoreNumber(value.id, 0),
    name: typeof value.name === 'string' ? value.name : 'Unknown Equipment',
    rarity: RARITY_COLORS[value.rarity] ? value.rarity : 'common',
    dmg: restoreNumber(value.dmg, 0),
    def: restoreNumber(value.def, 0),
    hp: restoreNumber(value.hp, 0),
    ownerId: Number.isInteger(value.ownerId) ? value.ownerId : null,
  };
}

function restoreActiveMission(value) {
  if (!isRecord(value) || !isRecord(value.mission)) return null;
  const mission = ALL_MISSIONS.find(item => item.id === value.mission.id);
  if (!mission) return null;
  const activeMission = restoreInstance(ActiveMission.prototype, value, ['id', 'squadId', 'squadIds', 'formationId', 'startTime']);
  activeMission.id = restoreNumber(value.id, 0);
  activeMission.squadIds = Array.isArray(value.squadIds)
    ? value.squadIds.filter(id => Number.isInteger(id))
    : [restoreNumber(value.squadId, 0)];
  activeMission.squadId = activeMission.squadIds[0];
  activeMission.formationId = Number.isInteger(value.formationId) ? value.formationId : null;
  activeMission.mission = mission;
  activeMission.startTime = restoreNumber(value.startTime, Date.now());
  activeMission.durationMs = mission.duration * 1000;
  return activeMission;
}

function restoreSavedState(data) {
  game.gold = restoreNumber(data.gold, game.gold);
  game.totalEarned = restoreNumber(data.totalEarned, game.totalEarned);
  game.soldierIdCounter = restoreNumber(data.soldierIdCounter, game.soldierIdCounter);
  game.squadIdCounter = restoreNumber(data.squadIdCounter, game.squadIdCounter);
  game.missionIdCounter = restoreNumber(data.missionIdCounter, game.missionIdCounter);
  game.equipmentIdCounter = restoreNumber(data.equipmentIdCounter, game.equipmentIdCounter);
  game.formationIdCounter = restoreNumber(data.formationIdCounter, game.formationIdCounter);
  game.totalMissionsCompleted = restoreNumber(data.totalMissionsCompleted, game.totalMissionsCompleted);
  game.totalSoldiersRecruited = restoreNumber(data.totalSoldiersRecruited, game.totalSoldiersRecruited);
  game.playtime = restoreNumber(data.playtime, game.playtime);
  game.soldiers = Array.isArray(data.soldiers) ? data.soldiers.map(restoreSoldier).filter(Boolean) : [];
  game.squads = Array.isArray(data.squads) ? data.squads.map(restoreSquad).filter(Boolean) : [];
  game.formations = Array.isArray(data.formations) ? data.formations.map(restoreFormation).filter(Boolean) : [];
  game.formations = game.formations.filter(formation => formation.squadIds.every(squadId => game.squads.some(squad => squad.id === squadId)));
  game.squads.forEach(squad => {
    const formation = game.formations.find(item => item.squadIds.includes(squad.id));
    squad.formationId = formation ? formation.id : null;
  });
  game.activeMissions = Array.isArray(data.activeMissions)
    ? data.activeMissions.map(restoreActiveMission).filter(Boolean)
    : [];
  game.activeMissions = game.activeMissions.filter(activeMission =>
    activeMission.squadIds.length > 0 && activeMission.squadIds.every(squadId => game.squads.some(squad => squad.id === squadId))
  );
  game.intel = restoreNumber(data.intel, game.intel);
  game.supplies = restoreNumber(data.supplies, game.supplies, 0);
  game.lastReadinessRecovery = restoreNumber(data.lastReadinessRecovery, Date.now());
  game.equipment = Array.isArray(data.equipment) ? data.equipment.map(restoreEquipment).filter(Boolean) : [];
  game.notifications = Array.isArray(data.notifications)
    ? data.notifications.filter(isRecord).map(notification => ({
        message: typeof notification.message === 'string' ? notification.message : '',
        type: typeof notification.type === 'string' ? notification.type : 'info',
        timestamp: restoreNumber(notification.timestamp, Date.now()),
        id: restoreNumber(notification.id, 0),
      }))
    : [];
}

function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(game));
  } catch (error) {
    console.warn('Unable to save game state.', error);
  }
}

// Auto-save every 10 seconds
setInterval(saveGame, 10000);

// Load game from localStorage
function loadGame() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return;
    const data = JSON.parse(saved);
    if (!isRecord(data)) throw new Error('Saved game state is not an object.');
    restoreSavedState(data);
  } catch (error) {
    console.warn('Unable to load saved game state. Starting a new game.', error);
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (removeError) {
      console.warn('Unable to clear invalid saved game state.', removeError);
    }
  }
}

function resetGame() {
  if (confirm('Are you sure? This will reset all progress!')) {
    localStorage.removeItem(SAVE_KEY);
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
  renderFormations();
  renderMissions();
  renderActiveMissions();
  if (missionCompleted) updateMissionProgressDisplay();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function renderResources() {
  document.getElementById('goldDisplay').textContent = game.gold.toLocaleString();
  document.getElementById('soldierCountDisplay').textContent = game.soldiers.length;
  const statsEl = document.getElementById('gameStats');
  if (statsEl) {
    statsEl.innerHTML = `
      Ops: ${game.totalMissionsCompleted} |
      Deployed: ${game.totalSoldiersRecruited} |
      Gear: ${game.equipment.length} |
      Intel: ${game.intel} |
      Supplies: ${Math.floor(game.supplies)}%
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
  const filter = document.getElementById('soldierFilter')?.value.trim().toLowerCase() || '';
  const soldiers = game.soldiers.filter(soldier => !filter || `${soldier.name} ${soldier.class}`.toLowerCase().includes(filter));
  if (game.soldiers.length === 0) {
    container.innerHTML = '<div class="empty-state">No operatives deployed yet. Deploy your first!</div>';
    return;
  }
  if (soldiers.length === 0) {
    container.innerHTML = '<div class="empty-state">No operatives match that search.</div>';
    return;
  }

  container.innerHTML = soldiers.map(soldier => {
    const inSquad = soldier.squadId !== null;
    const equipment = game.equipment.filter(e => soldier.equipmentIds.includes(e.id));
    
    return `
      <div class="soldier-item" style="opacity: ${inSquad ? '1' : '0.7'}">
        <div class="soldier-left">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="soldier-name-display">${escapeHtml(soldier.name)}</span>
            <span class="soldier-class-badge">${escapeHtml(soldier.class)}</span>
          </div>
          <div class="soldier-level">
            LVL ${soldier.level} (${soldier.experience}/100 xp) | ❤️ ${soldier.hp.toFixed(1)} | ⚔️ ${soldier.dmg.toFixed(1)} | 🛡️ ${soldier.def.toFixed(1)}
          </div>
          ${equipment.length > 0 ? `<div class="soldier-equipment">${equipment.map(e => `<span class="eq-tag" style="color: ${RARITY_COLORS[e.rarity]}">${escapeHtml(e.name)}</span>`).join('')}</div>` : ''}
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
    container.innerHTML = '<div class="empty-state">No task forces assembled. Create one!</div>';
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
    const deployed = isSquadDeployed(squad.id);
    
    return `
      <div class="squad-item" style="opacity: ${deployed ? '0.65' : '1'}">
        <div class="squad-header">
          <span class="squad-name">${escapeHtml(squad.name)}</span>
          <span class="squad-stats">Lvl ${avgLevel} | ${members.length}/5 | Ready: ${Math.floor(squad.readiness)}% | Ops: ${squad.completedMissions}</span>
        </div>
        <div class="squad-stats" style="font-size: 11px;">
          ⚔️ ${squad.getTotalDamage().toFixed(1)} | 🛡️ ${squad.getTotalDefense().toFixed(1)} | ❤️ ${Math.floor(squad.getTotalHealth())} | Bonus: +${bonus}%
        </div>
        <div class="squad-members">
          ${members.length === 0 ? '<span class="squad-stats">Empty</span>' : members.map(m => `<div class="member-badge">${escapeHtml(m.name)}</div>`).join('')}
        </div>
        <div class="squad-actions">
          <button onclick="deleteSquad(${squad.id})" class="btn-small btn-danger" ${deployed ? 'disabled' : ''}>Disband</button>
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

function renderFormations() {
  const container = document.getElementById('formationsList');
  if (!container) return;
  const formationTypes = Object.keys(FORMATION_DEFINITIONS);
  const controls = formationTypes.map(type => {
    const definition = FORMATION_DEFINITIONS[type];
    const canForm = getAvailableSquads().filter(squad => squad.formationId === null).length >= definition.requiredSquads;
    return `<button class="btn-small" onclick="createFormation('${type}')" ${canForm ? '' : 'disabled'}>+ ${definition.label}</button>`;
  }).join('');
  const formations = game.formations.map(formation => `
    <div class="squad-item">
      <div class="squad-header">
        <span class="squad-name">${escapeHtml(formation.name)}</span>
        <span class="squad-stats">${formation.squadIds.length}/${formation.definition.requiredSquads} squads | ${escapeHtml(formation.status)}</span>
      </div>
      <div class="squad-stats">Leader: ${escapeHtml(formation.definition.leader)}${formation.leaderId !== null ? ` (${escapeHtml(game.soldiers.find(soldier => soldier.id === formation.leaderId)?.name || 'Assigned')})` : ''} | Avg Lvl: ${formation.getAverageLevel()} | Strength: ${Math.floor(formation.getStrength())}</div>
      <div class="squad-actions"><button class="btn-small btn-danger" onclick="disbandFormation(${formation.id})" ${formation.status === 'deployed' ? 'disabled' : ''}>Disband</button></div>
    </div>
  `).join('');
  container.innerHTML = `${formations || '<div class="empty-state">No higher formations organized yet.</div>'}<div class="squad-actions formation-controls">${controls}</div>`;
}

function renderMissions() {
  const container = document.getElementById('missionsList');
  const squadsWithMembers = game.squads.filter(s => s.memberIds.length > 0);
  const filter = document.getElementById('missionFilter')?.value || 'all';

  if (squadsWithMembers.length === 0) {
    container.innerHTML = '<div class="empty-state">Assemble a task force to start operations!</div>';
    return;
  }

  const missions = ALL_MISSIONS.filter(mission => {
    const isCommandOperation = (mission.requiredSquads || 1) > 1;
    if (filter === 'squad') return !isCommandOperation;
    if (filter === 'command') return isCommandOperation;
    if (filter === 'ready') return Boolean(getMissionForce(mission));
    return true;
  });

  container.innerHTML = missions.map(mission => {
    const force = getMissionForce(mission);
    const requiredSquads = mission.requiredSquads || 1;
    const eligibleSquads = squadsWithMembers.filter(s => s.canCompleteOfficially(mission) && !isSquadDeployed(s.id));
    const isCommandOperation = requiredSquads > 1;
    const action = isCommandOperation
      ? (force ? `<button onclick='startMissionWithSquads(${JSON.stringify(force.squadIds)}, "${mission.id}", ${force.formationId === null ? 'null' : force.formationId})' class="btn-mission-small">Deploy ${requiredSquads} Squads</button>` : '<span class="mission-unavailable">FORCE NOT READY</span>')
      : (eligibleSquads.length === 0 ? '<span class="mission-unavailable">CLEARANCE DENIED</span>' : eligibleSquads.map(squad => `
        <button onclick="startMission(${squad.id}, '${mission.id}')" class="btn-mission-small">
          ${escapeHtml(squad.name)}
        </button>
      `).join(''));
    
    return `
      <div class="mission-item" style="border-left: 4px solid ${['#888', '#4ade80', '#3b82f6', '#a855f7', '#f59e0b'][mission.difficulty]}">
        <div class="mission-info">
          <span class="mission-name">${escapeHtml(mission.name)}${isCommandOperation ? ` <small>· ${escapeHtml(FORMATION_DEFINITIONS[mission.commandLevel].label)}</small>` : ''}</span>
          <span class="mission-reward">⏱️ ${mission.duration}s | 💰 ${mission.gold} cr | ✨ ${mission.exp}xp | 🎁 ${mission.rewards} ${escapeHtml(mission.loot)} | Lvl ${mission.minLevel}+${isCommandOperation ? ` | 🛡️ ${requiredSquads} squads | 📦 ${mission.supplies} supplies` : ''}</span>
        </div>
        <div class="mission-actions">
          ${action}
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
    const squads = game.squads.filter(squad => mission.squadIds.includes(squad.id));
    const squadNames = squads.map(squad => squad.name).join(', ');
    const progress = mission.getProgress() * 100;
    const timeRemaining = Math.ceil((1 - mission.getProgress()) * mission.mission.duration);
    
    return `
      <div class="mission-run" data-mission-id="${mission.id}">
        <div class="mission-run-header">
          <span class="mission-run-name">
            ${escapeHtml(squadNames)} — ${escapeHtml(mission.mission.name)}
          </span>
          <span class="mission-run-time" data-mission-time="${mission.id}">${timeRemaining}s</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" data-mission-progress="${mission.id}" style="width: ${progress}%"></div>
        </div>
        <div class="mission-rewards-preview">
          💰 ${mission.mission.gold} | ✨ ${mission.mission.exp} | 🎁 ${mission.mission.rewards}x loot | 🛡️ ${mission.squadIds.length} squad${mission.squadIds.length === 1 ? '' : 's'}
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
    <div class="notification notification-${escapeHtml(n.type)}">
      ${escapeHtml(n.message)}
    </div>
  `).join('');
}

// ============================================================================
// UI HELPERS
// ============================================================================

function createSquadAndAdd(soldierId) {
  const soldier = game.soldiers.find(s => s.id === soldierId);
  if (!soldier || soldier.squadId !== null) return;
  
  const squad = game.squads.find(candidate => candidate.memberIds.length < 5) || (() => {
    const newSquad = new Squad(game.squadIdCounter++);
    game.squads.push(newSquad);
    return newSquad;
  })();

  if (squad.addMember(soldier)) {
    addNotification(`✓ ${soldier.name} assigned to ${squad.name}`, 'success');
  }
  render();
}

// ============================================================================
// GAME LOOP
// ============================================================================

// Fast loop for smooth progress bar animation (updates every 50ms)
setInterval(() => {
  recoverReadiness();
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
