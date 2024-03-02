function updateState() {
  attack_power = weapon.attack_power;
  if(queueCooldown > 0) {
    queueCooldown -= 1;
  } else {
    executeQueuedAbility(queue, foe, attack_power);
    processConditions(foe, attack_power);
    queuedAbility += 1;
    if(queuedAbility >= queue.length) {
      queuedAbility = 0;
      venomActive = false;
      recentlyFeinted = false;
    }
    num_actions += 1;
    if(num_actions >= foe.action_limit) {
      num_actions = 0;
      foe.hp = foe.max_hp;
    }
    resetQueueCooldown();
    updateFoeHTML();
    updateQueueHTML();
  }
  
}

function updateHTML() {
  document.getElementById('role').innerHTML = role;
  document.getElementById('attack-power').innerHTML = attack_power;
  updateEquippedHTML(weapon);
}

function updateAbilitiesHTML() {
  let abilitiesDiv = document.getElementById('abilities-list');
  abilitiesDiv.replaceChildren();
  for(let i = 0; i < abilities.length; i++) {
    let ability_div = createAbility(abilities[i].name, abilities[i].description, abilities[i].icon);
    abilitiesDiv.appendChild(ability_div);
  }
}

function createHint(text) {
  hintDiv = document.createElement('div');
  hintDiv.classList.add('hint');
  hintDiv.innerHTML = '⚠️' + text;
  return hintDiv;
}

function updateHintHTML() {
  hintsDiv = document.getElementById('hints');
  hintsDiv.replaceChildren();

  if(emptySlotHint) {
    hintsDiv.appendChild(createHint('Add some abilities to the queue!'));
  }
  if(!emptySlotHint && vraxisNeverDied) {
    hintsDiv.appendChild(createHint('Try to defeat Vraxis in under 10 moves!'));
  }
}

function createAbility(name, description, icon) {
  let ability_div = document.createElement('div');
  ability_div.classList.add('ability');

  let img = document.createElement('img');
  img.src = icon;
  img.classList.add('ability-icon');
  img.classList.add('add');
  img.setAttribute('ability', name);
  ability_div.appendChild(img);

  let descriptionDiv = document.createElement('div');
  descriptionDiv.innerHTML = description;
  ability_div.appendChild(descriptionDiv);


  return ability_div;
}

function updateQueueHTML() {
  let queue_div = document.getElementById('attack-queue');
  queue_div.replaceChildren();
  for(let i = 0; i < queue.length; i++) {
    let enabled = queuedAbility == i;
    let ability_div = createQueueAbility(queue[i], enabled, i);
    queue_div.appendChild(ability_div);
  }
}

function createQueueAbility(ability, enabled, index) {
  let ability_div = document.createElement('div');
  ability_div.classList.add('queue-ability');
  if(enabled) {
    ability_div.classList.add('enabled');
  }
  if(ability) {
    let img = document.createElement('img');
    img.src = ability.icon;
    img.classList.add('ability-icon');
    img.classList.add('delete');
    img.setAttribute('index', index);
    ability_div.appendChild(img);
  } else {
    ability_div.innerHTML = "EMPTY";
  }

  return ability_div;
}

function updateFoeHTML() {
  let foes_div = document.getElementById('foes-list');
  foes_div.replaceChildren();
  let foe_div = createFoe(foe.name, foe.hp, foe.max_hp, foe.action_limit);
  foes_div.appendChild(foe_div);
}

function createFoe(name, hp, max_hp, action_limit) {
  let foe_div = document.createElement('div');
  foe_div.classList.add('foe');
  foe_div.innerHTML = '👺 ' + name + ' (' + num_actions + '/' + action_limit + ')';
  let hp_bar = createBar(hp, max_hp);
  foe_div.appendChild(hp_bar);
  return foe_div;
}

function createBar(actual, max) {
  bar = document.createElement('div');
  bar.classList.add('bar');
  innerBar = document.createElement('div');
  innerBar.classList.add('bar-inner');
  innerBar.style.width = 'calc(' + actual * 100 / max + '% - 2px)';
  bar.appendChild(innerBar);
  return bar;
}

function updateLootHTML() {
  let loot_div = document.getElementById('loot-list');
  loot_div.replaceChildren();
  for(let i = 0; i < loot.length; i++) {
    let loot_item_div = createLootElement(loot[i]);
    loot_div.appendChild(loot_item_div);
  }
}

function createPlayerCard() {
  let player_card_div = document.getElementById('div');
  player_card_div.id = 'player-card';
  return player_card_div;
}

function createItemIcon(item) {
  item_div = document.createElement('div');
  item_div.classList.add('loot-item');
  item_div.classList.add('has-tip');
  item_div.classList.add(item.forge);
  if(item.weapon == 'dagger')
  {
    item_div.innerHTML = '🗡️';
  } else if(item.weapon == 'longsword') {
    item_div.innerHTML = '⚔️';
  } else if(item.weapon == 'battleaxe') {
    item_div.innerHTML = '🪓';
  } else if(item.weapon == 'stick') {
    item_div.innerHTML = '🧹';
  }
  let tip_title = '';
  if(item.forge) {
    tip_title += item.forge + ' ';
  }
  tip_title += item.weapon;
  let tip_description = item.attack_power + ' attack power, ';
  item_div.appendChild(createTip(tip_title, tip_description));
  return item_div;
}

function createLootElement(item) {
  let item_div = document.createElement('div');
  let item_icon = createItemIcon(item);
  let equip_button = document.createElement('button');
  equip_button.innerHTML = 'Equip';
  equip_button.classList.add('equip');
  equip_button.setAttribute('guid', item.guid);
  item_div.appendChild(item_icon);
  item_div.appendChild(equip_button);
  return item_div;
}

function removeFromLoot(item_guid) {
  for(let i = 0; i < loot.length; i++) {
    if(loot[i].guid == item_guid) {
      loot.splice(i, 1);
      break;
    }
  }
}

function executeAbility(ability, foe, attack_power, queueIndex) {
  if(!ability) {
    return;
  }
  if(ability.name == 'Heartstrike') {
    heartstrike(foe, attack_power, queueIndex);
  } else if(ability.name == "Feint") {
    feint();
  } else if(ability.name == "Ambush") {
    ambush(foe, attack_power, queueIndex);
  } else if(ability.name == "Reprisal") {
    reprisal(foe, queueIndex);
  } else if(ability.name == "Gore") {
    gore(foe, attack_power);
  } else if(ability.name == "Venom Slash") {
    venomSlash(attack_power);
  }
}

function executeQueuedAbility(queue, foe, attack_power) {
  executeAbility(queue[queuedAbility], foe, attack_power, queuedAbility);
}

function processConditions(foe, attack_power) {
  if(venomActive) {
    applyIndirectDamage(foe, attack_power / 3);
  }
}

function equip(item_guid) {
  let item_to_equip = null;
  for(let i = 0; i < loot.length; i++) {
    if(loot[i].guid == item_guid) {
      item_to_equip = loot[i];
      break;
    }
  }
  loot.push(weapon);
  weapon = item_to_equip;
  removeFromLoot(item_to_equip.guid);
  updateLootHTML();
}

function createEquippedItemElement(item) {
  let item_div = document.createElement('div');
  let item_icon = createItemIcon(item);
  item_div.appendChild(item_icon);
  return item_div;
}

function createTip(header, description) {
  tip_div = document.createElement('div');
  tip_div.classList.add('tooltip');
  tip_header_div = document.createElement('div');
  tip_header_div.classList.add('tooltip-header');
  tip_header_div.innerHTML = header;
  tip_description_div = document.createElement('div');
  tip_description_div.classList.add('tooltip-description');
  tip_description_div.innerHTML = description;

  tip_div.appendChild(tip_header_div);
  tip_div.appendChild(tip_description_div);

  return tip_div;
}

function updateEquippedHTML(weapon) {
  let weapon_div = document.getElementById('weapon');
  weapon_div.replaceChildren(createEquippedItemElement(weapon));
  weapon_div.classList.add(weapon.weapon);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function calculateDamage(attack_power) {
  return attack_power;
}

function randomForge() {
  let r = Math.random();
  if(r < 0.9) {
    return null;
  } else if(r < 0.99) {
    return 'gilded';
  } else if(r < 0.999) {
    return 'diamond';
  } else {
    return 'cosmic';
  }
}

function lootSomethingMaybe() {
  if(Math.random() < 1) {
    loot.push({
      weapon: 'dagger',
      attack_power: 9,
      forge: randomForge(),
      guid: crypto.randomUUID()
    });
    updateLootHTML();
  }
}

function removeFoe(index) {
  foes.splice(index, 1);
  lootSomethingMaybe();
}

function applyDirectDamage(target, amount) {
  if(recentlyFeinted) {
    amount *= 2;
    recentlyFeinted = false;
  }
  applyDamage(target, amount);
  lastDirectDamage = amount;
}

function applyIndirectDamage(target, amount) {
  applyDamage(target, amount);
}

function applyDamage(target, amount) {
  target.hp -= amount;
  if(target.hp <= 0) {
    layer = 2;
    foe = layer_2_foe;
  }
}

function heartstrike(target, attack_power, queue_index) {
  let damage = calculateDamage(attack_power);
  if(queue_index == queue.length - 1) {
    damage *= 2;
  }
  applyDirectDamage(target, damage);
}

function feint() {
  recentlyFeinted = true;
}

function venomSlash() {
  venomActive = true;
}

function gore(target, attack_power) {
  let damage = calculateDamage(attack_power);
  damage *= 3;
  applyDirectDamage(target, damage);
}

function ambush(target, attack_power, queue_index) {
  let damage = calculateDamage(attack_power);
  if(queue_index == 0) {
    damage *= 2;
  }
  applyDirectDamage(target, damage);
}

function reprisal(target, queue_index) {
  let damage = lastDirectDamage;
  applyDirectDamage(target, damage);
}

function resetQueueCooldown() {
  queueCooldown = 500;
}

setInterval(() => {
  updateHTML();
  updateState();
}, 1);

let layer = 1;
let attack_power = 1;
let role = 'Shadowblade';

let recentlyFeinted = false;
let venomActive = false;
let lastDirectDamage = 0;

let num_actions = 0;


let layer_1_foe = {
  name: 'Prison Guard Vraxis',
  hp: 100,
  max_hp: 100,
  action_limit: 10
};
let layer_2_foe = {
  name: 'Ironscale',
  hp: 1_000,
  max_hp: 1_000,
  action_limit: 20
};
let layer_3_foe = {
  name: 'Zephyr, Wyrm of the Void',
  hp: 10_000,
  max_hp: 10_000
};

let queue = [];
let queue_max = 3;
queue.push(null);
queue.push(null);
queue.push(null);

let queuedAbility = 0;

let queueCooldown = 1_000_000;
resetQueueCooldown();

let emptySlotHint = queue.includes(null);
let vraxisNeverDied = true;

let weapon = {
  weapon: 'stick',
  attack_power: 3,
  forge: null,
  guid: '042563f7-24bb-4998-851d-019499b0f06b'
}

let loot = [];

let abilities = [];
abilities.push({
  name: 'Heartstrike',
  description: 'Attack the enemy in their vitals. Damage is doubled when in the final queue slot.',
  icon: 'assets/heartstrike.jpg'
});
abilities.push({
  name: 'Feint',
  description: 'Disorient the enemy with a mock blow. The next ability has its damage doubled.',
  icon: 'assets/feint.jpg'
});
abilities.push({
  name: 'Ambush',
  description: 'Engage the enemy with a surprise attack. Damage is doubled when in the first queue slot.',
  icon: 'assets/ambush.jpg'
});
abilities.push({
  name: 'Reprisal',
  description: 'Strike the enemy for the same damage done on the previous attack.',
  icon: 'assets/reprisal.jpg'
});
abilities.push({
  name: 'Gore',
  description: 'Deal a massive blow for triple damage. Can only be used once in the queue.',
  icon: 'assets/gore.jpg'
});
abilities.push({
  name: 'Venom Slash',
  description: 'Envenomate the enemy, dealing passive damage for the rest of the queue.',
  icon: 'assets/venom_strike.jpg'
});

foe = layer_1_foe;

updateLootHTML();
updateFoeHTML();
updateQueueHTML();
updateAbilitiesHTML();
updateHintHTML();

ability_div = document.getElementById('abilities');
ability_div.addEventListener('click', ()=> {
  updateFoeHTML();
});

attack_button = document.getElementById('attack');
attack_button.addEventListener('click', ()=> {
  if(wildStrikeCooldown <= 0) {
    attack_random(foes, attack_power);
  }
});


go_layer_1_button = document.getElementById('go_layer_1');
go_layer_1_button.addEventListener('click', ()=> {
  layer = 1;
  foe = layer_1_foe;
  updateFoeHTML();
});

go_layer_2_button = document.getElementById('go_layer_2');
go_layer_2_button.addEventListener('click', ()=> {
  layer = 2;
  foe = layer_2_foe;
  updateFoeHTML();
});

go_layer_3_button = document.getElementById('go_layer_3');
go_layer_3_button.addEventListener('click', ()=> {
  layer = 3;
  foe = layer_3_foe;
  updateFoeHTML();
});

loot_div = document.getElementById('loot');
loot_div.addEventListener('click', function(e) {
  if(e.target.classList.contains('equip')) {
    equip(e.target.getAttribute('guid'));
  }
});

queue_div = document.getElementById('attack-queue');
queue_div.addEventListener('click', function(e) {
  if(e.target.classList.contains('delete')) {
    queue[e.target.getAttribute('index')] = null;
    updateQueueHTML();
  }
});

function addToQueue(ability) {
  if(ability.name == "Gore") {
    for(let i = 0; i < queue.length; i++) {
      if(queue[i] && queue[i].name == "Gore") {
        return;
      }
    }
  }
  for(let i = 0; i < queue.length; i++) {
    if(!queue[i]) {
      queue[i] = ability;
      break;
    }
  }
  emptySlotHint = queue.includes(null);
  updateHintHTML();
}

queue_div = document.getElementById('abilities-list');
queue_div.addEventListener('click', function(e) {
  if(e.target.classList.contains('add')) {
    addToQueue(getAbilityFromName(e.target.getAttribute("ability")));
    updateQueueHTML();
  }
});

function getAbilityFromName(name) {
  return abilities.find(ability => ability.name == name);
}