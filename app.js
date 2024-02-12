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
}

function updateHTML() {
  document.getElementById("power").innerHTML = power;
  document.getElementById("armor").innerHTML = armor;
  document.getElementById("layer").innerHTML = layer;
  document.getElementById("zone").innerHTML = zone;
  document.getElementById("num_foes").innerHTML = foes.length;
  document.getElementById("coins").innerHTML = coins;
  document.getElementsByClassName("wild-strike-cd")[0].style.width = "calc(" + wildStrikeCooldown * 100/ WILD_STRIKE_BASE_CD + "% - 2px)";
  document.getElementsByClassName("assassinate-cd")[0].style.width = "calc(" + assassinateCooldown * 100/ ASSASSINATE_BASE_CD + "% - 2px)";
  updateFoeHTML();
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

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function attack_power(power, foe_armor) {
  final_power = power * (getRandomInt(10) + 10);
  final_power *= 1 - (foe_armor / 100);
  return Math.floor(final_power);
}

function attack_random(foes) {
  wildStrikeCooldown = WILD_STRIKE_BASE_CD;
  let foe_i = getRandomInt(foes.length);
  let foe = foes[foe_i]
  let damage = attack_power(power, foe.armor);
  foe.hp -= damage;
  if(foe.hp <= 0) {
    coins += 1;
    foes.splice(foe_i, 1);
  }
}

function assassinate(foes) {
  assassinateCooldown = ASSASSINATE_BASE_CD;
  let foe_i = 0;
  for(let i = 1; i < foes.length; i++) {
    if(foes[i].hp < foes[foe_i].hp) {
      foe_i = i;
    }
  }
  let foe = foes[foe_i];
  let damage = attack_power(power, foe.armor);
  foe.hp -= damage;
  if(foe.hp <= 0) {
    coins += 1;
    foes.splice(foe_i, 1);
    assassinateCooldown = 0;
  }
}

setInterval(() => {
  updateHTML();
  updateState();
}, 1);

const WILD_STRIKE_BASE_CD = 500;
const ASSASSINATE_BASE_CD = 500;

let layer = 1;
let zone = 'A';
let coins = 0;
let armor = 0;
let power = 1;

let wildStrikeCooldown = 0;
let assassinateCooldown = 0;

let foes = []
let layer_1_foes = []
let layer_2_foes = []
let layer_3_foes = []

function setUpLayer1Foes() {
  for(let i = 0; i < 5; i++) {
    layer_1_foes.push({
      name: "Goblin",
      hp: 100,
      armor: 0
    })
  }
}

function setUpLayer2Foes() {
  for(let i = 0; i < 8; i++) {
    layer_2_foes.push({
      name: "Goblin",
      hp: 100,
      armor: 0
    })
  }
  for(let i = 0; i < 2; i++) {
    layer_2_foes.push({
      name: "Supergoblin",
      hp: 500,
      armor: 5
    })
  }
}

function setUpLayer3Foes() {
  for(let i = 0; i < 10; i++) {
    layer_3_foes.push({
      name: "Goblin",
      hp: 100,
      armor: 0
    })
  }
  for(let i = 0; i < 3; i++) {
    layer_3_foes.push({
      name: "Supergoblin",
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
    attack_random(foes);
  }
})

assassinate_button = document.getElementById("assassinate");
assassinate_button.addEventListener('click', ()=> {
  if(assassinateCooldown <= 0) {
    assassinate(foes);
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