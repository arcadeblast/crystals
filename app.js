function updateState() {
  attack_power = weapon.attack_power;
  armor_piercing = weapon.armor_piercing;
  if(queueCooldown > 0) {
    queueCooldown -= 1;
  } else {
    executeQueuedAbility(foe, attack_power);
    queuedAbility += 1;
    if(queuedAbility >= queue.length) {
      queuedAbility = 0;
    }
    resetQueueCooldown();
    updateFoeHTML();
    updateQueueHTML();
  }
  
}

function updateHTML() {
  document.getElementById('role').innerHTML = role;
  document.getElementById('attack-power').innerHTML = attack_power;
  document.getElementById('spellbreak').innerHTML = spellbreak;
  document.getElementById('armor-piercing').innerHTML = armor_piercing;
  updateEquippedHTML(weapon);
}

function updateAbilitiesHTML() {
  let abilitiesDiv = document.getElementById('abilities-list');
  abilitiesDiv.replaceChildren();
  for(let i = 0; i < abilities.length; i++) {
    let ability_div = createAbility(abilities[i].name);
    abilitiesDiv.appendChild(ability_div);
  }
}

function createAbility(name) {
  let ability_div = document.createElement('div');
  ability_div.classList.add('ability');
  ability_div.innerHTML = name;

  let add_button = document.createElement('button');
  add_button.classList.add('add');
  add_button.innerHTML = '+';
  add_button.setAttribute('ability', name);

  ability_div.appendChild(add_button);
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

function createQueueAbility(name, enabled, index) {
  let ability_div = document.createElement('div');
  ability_div.classList.add('ability');
  if(enabled) {
    ability_div.classList.add('enabled');
  }
  if(name) {
    ability_div.innerHTML = name;
  } else {
    ability_div.innerHTML = "-- EMPTY -- ";
  }

  let remove_button = document.createElement('button');
  remove_button.classList.add('delete');
  remove_button.innerHTML = 'X';
  remove_button.setAttribute('index', index);

  ability_div.appendChild(remove_button);
  return ability_div;
}

function updateFoeHTML() {
  let foes_div = document.getElementById('foes-list');
  foes_div.replaceChildren();
  let foe_div = createFoe(foe.name, foe.hp, foe.max_hp);
  foes_div.appendChild(foe_div);
}

function createFoe(name, hp, max_hp) {
  let foe_div = document.createElement('div');
  foe_div.classList.add('foe');
  foe_div.innerHTML = '👺 ' + name;
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
  tip_description += item.armor_piercing + ' armor piercing, ';
  tip_description += item.spellbreak + ' spellbreak';
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

function executeAbility(name, foe, attack_power) {
  if(name == 'Heartstrike') {
    heartstrike(foe, attack_power);
  }
}

function executeQueuedAbility(foe, attack_power) {
  executeAbility(queue[queuedAbility], foe, attack_power);
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

function calculateDamage(attack_power, foe_armor) {
  final_power = attack_power + getRandomInt(attack_power) / 2;
  final_power *= 1 - (foe_armor / 100);
  return Math.floor(final_power);
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
      armor_piercing: 1,
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



function heartstrike(target, attack_power) {
  let damage = calculateDamage(attack_power, target.armor);
  target.hp -= damage;
}

function resetQueueCooldown() {
  queueCooldown = 500;
}

setInterval(() => {
  updateHTML();
  updateState();
}, 1);

let layer = 1;
let armor_piercing = 0;
let attack_power = 1;
let spellbreak = 0;
let role = 'Shadowblade';



let layer_1_foe = {
  name: 'Blazing Drake',
  hp: 100,
  max_hp: 100,
  armor: 0
};
let layer_2_foe = {
  name: 'Ironscale',
  hp: 500,
  max_hp: 500,
  armor: 5
};
let layer_3_foe = {
  name: 'Zephyr, Wyrm of the Void',
  hp: 1000,
  max_hp: 1000,
  armor: 10
};

let queue = [];
let queue_max = 3;
queue.push('Heartstrike');
queue.push('Heartstrike');
queue.push('Heartstrike');

let queuedAbility = 0;

let queueCooldown = 1_000_000;
resetQueueCooldown();

let weapon = {
  weapon: 'stick',
  attack_power: 3,
  armor_piercing: 0,
  spellbreak: 0,
  forge: null,
  guid: '042563f7-24bb-4998-851d-019499b0f06b'
}

let loot = [];

let abilities = [];
abilities.push({
  name: 'Heartstrike',
  description: 'Attack the boss. Damage is doubled if this is the final queue slot.'
});
abilities.push({
  name: 'Teleport',
  description: 'Appear behind the enemy, catching them off guard. The next ability has its damage doubled.'
});

foe = layer_1_foe;

updateLootHTML();
updateFoeHTML();
updateQueueHTML();
updateAbilitiesHTML();

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

queue_div = document.getElementById('abilities-list');
queue_div.addEventListener('click', function(e) {
  if(e.target.classList.contains('add')) {
    for(let i = 0; i < queue.length; i++) {
      if(!queue[i]) {
        queue[i] = e.target.getAttribute("ability");
        break;
      }
    }
    updateQueueHTML();
  }
});