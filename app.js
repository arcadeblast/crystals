function updateState() {
  if(layer == 1) {
    foes = layer_1_foes;
  }
  else if(layer == 2) {
    foes = layer_2_foes;
  }
  else {
    foes = layer_3_foes;
  }

  if(wildStrikeCooldown > 0) {
    wildStrikeCooldown -= 1;
  }
  if(assassinateCooldown > 0) {
    assassinateCooldown -= 1;
  }
  if(reprisalCooldown > 0) {
    reprisalCooldown -= 1;
  }
  attack_power = weapon.attack_power;
  armor_piercing = weapon.armor_piercing;
}

function updateHTML() {
  document.getElementById("attack-power").innerHTML = attack_power;
  document.getElementById("armor-piercing").innerHTML = armor_piercing;
  document.getElementById("layer").innerHTML = layer;
  document.getElementById("zone").innerHTML = zone;
  document.getElementById("num_foes").innerHTML = foes.length;
  document.getElementById("coins").innerHTML = coins;
  document.getElementsByClassName("wild-strike-cd")[0].style.width = "calc(" + wildStrikeCooldown * 100/ WILD_STRIKE_BASE_CD + "% - 2px)";
  document.getElementsByClassName("assassinate-cd")[0].style.width = "calc(" + assassinateCooldown * 100/ ASSASSINATE_BASE_CD + "% - 2px)";
  document.getElementsByClassName("reprisal-cd")[0].style.width = "calc(" + reprisalCooldown * 100/ REPRISAL_BASE_CD + "% - 2px)";
  updateEquipmentHTML(weapon);
  updateFoeHTML();
  updateLootHTML();
}

function updateFoeHTML() {
  let foes_div = document.createElement("div");
  for(let i = 0; i < foes.length; i++) {
    let foe_div = document.createElement("div");
    foe_div.classList.add("foe");
    foe_div.innerHTML = "[" + i + "] " + foes[i].name + " " + foes[i].hp + "hp " + foes[i].armor + "%armor";
    foes_div.appendChild(foe_div);
  }
  document.getElementById("foes").replaceWith(foes_div);
  foes_div.id = "foes";
}

function updateLootHTML() {
  let loot_div = document.createElement("div");
  for(let i = 0; i < loot.length; i++) {
    let loot_item_div = document.createElement("div");
    loot_item_div.classList.add("loot_item");
    loot_item_div.innerHTML = "[" + i + "] " + loot[i].weapon + ", " + loot[i].attack_power + " attack power, " + loot[i].armor_piercing + " armor piercing";
    loot_div.appendChild(loot_item_div);
  }
  document.getElementById("loot").replaceWith(loot_div);
  loot_div.id = "loot";
}

function updateEquipmentHTML(weapon) {
  weapon_div = document.getElementById("weapon");
  weapon_div.classList.add(weapon.weapon);
  weapon_div.innerHTML = "Current: " + weapon.weapon + ", " + weapon.attack_power + " attack power, " + weapon.armor_piercing + " armor piercing";

}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function calculateDamage(attack_power, foe_armor) {
  final_power = attack_power + getRandomInt(attack_power) / 2;
  final_power *= 1 - (foe_armor / 100);
  return Math.floor(final_power);
}

function attack_random(foes, attack_power) {
  wildStrikeCooldown = WILD_STRIKE_BASE_CD;
  let foe_i = getRandomInt(foes.length);
  let foe = foes[foe_i]
  let damage = calculateDamage(attack_power, foe.armor);
  foe.hp -= damage;
  recent_foe = foe;
  if(foe.hp <= 0) {
    coins += 1;
    foes.splice(foe_i, 1);
  }
}

function assassinate(foes, attack_power) {
  assassinateCooldown = ASSASSINATE_BASE_CD;
  let foe_i = 0;
  for(let i = 1; i < foes.length; i++) {
    if(foes[i].hp < foes[foe_i].hp) {
      foe_i = i;
    }
  }
  let foe = foes[foe_i];
  let damage = calculateDamage(attack_power, foe.armor);
  foe.hp -= damage;
  recent_foe = foe;
  if(foe.hp <= 0) {
    coins += 1;
    foes.splice(foe_i, 1);
    assassinateCooldown = 0;
  }
}

function reprisal(foe, attack_power) {
  reprisalCooldown = REPRISAL_BASE_CD;
  let damage = calculateDamage(attack_power, foe.armor);
  foe.hp -= damage;
  recent_foe = foe;
  if(foe.hp <= 0) {
    foe.hp = 1;
  }
}

setInterval(() => {
  updateHTML();
  updateState();
}, 1);

const WILD_STRIKE_BASE_CD = 200;
const ASSASSINATE_BASE_CD = 500;
const REPRISAL_BASE_CD = 350;

let layer = 1;
let zone = 'A';
let coins = 0;
let armor_piercing = 0;
let attack_power = 1;

let wildStrikeCooldown = 0;
let assassinateCooldown = 0;
let reprisalCooldown = 0;

let foes = [];
let layer_1_foes = [];
let layer_2_foes = [];
let layer_3_foes = [];

let weapon = {
  weapon: 'dagger',
  attack_power: 9,
  armor_piercing: 1
}

let loot = [];
loot.push (
  {
    weapon: 'dagger',
    attack_power: 9,
    armor_piercing: 1
  },
  {
    weapon: 'battleaxe',
    attack_power: 5,
    armor_piercing: 5
  }
)

function setUpLayer1Foes() {
  for(let i = 0; i < 5; i++) {
    layer_1_foes.push({
      name: "Drake",
      hp: 100,
      armor: 0
    })
  }
}

function setUpLayer2Foes() {
  for(let i = 0; i < 8; i++) {
    layer_2_foes.push({
      name: "Drake",
      hp: 100,
      armor: 0
    })
  }
  for(let i = 0; i < 2; i++) {
    layer_2_foes.push({
      name: "Serpent",
      hp: 500,
      armor: 5
    })
  }
}

function setUpLayer3Foes() {
  for(let i = 0; i < 10; i++) {
    layer_3_foes.push({
      name: "Drake",
      hp: 100,
      armor: 0
    })
  }
  for(let i = 0; i < 3; i++) {
    layer_3_foes.push({
      name: "Serpent",
      hp: 500,
      armor: 5
    })
  }
  layer_3_foes.push({
    name: "Void Wyrm Zephyr",
    hp: 1000,
    armor: 10
  })
}

setUpLayer1Foes();
setUpLayer2Foes();
setUpLayer3Foes();
foes = layer_1_foes;

attack_button = document.getElementById("attack");
attack_button.addEventListener('click', ()=> {
  if(wildStrikeCooldown <= 0) {
    attack_random(foes, attack_power);
  }
})

assassinate_button = document.getElementById("assassinate");
assassinate_button.addEventListener('click', ()=> {
  if(assassinateCooldown <= 0) {
    assassinate(foes, attack_power);
  }
})

reprisal_button = document.getElementById("reprisal");
reprisal_button.addEventListener('click', ()=> {
  if(reprisalCooldown <= 0) {
    reprisal(recent_foe, attack_power);
  }
})

go_layer_1_button = document.getElementById("go_layer_1");
go_layer_1_button.addEventListener('click', ()=> {
  layer = 1;
})

go_layer_2_button = document.getElementById("go_layer_2");
go_layer_2_button.addEventListener('click', ()=> {
  layer = 2;
})

go_layer_3_button = document.getElementById("go_layer_3");
go_layer_3_button.addEventListener('click', ()=> {
  layer = 3;
})