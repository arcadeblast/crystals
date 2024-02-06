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
}

function updateHTML() {
  document.getElementById("layer").innerHTML = layer;
  document.getElementById("zone").innerHTML = zone;
  document.getElementById("num_foes").innerHTML = foes.length;
  document.getElementById("coins").innerHTML = coins;
  updateFoeHTML();
}

function updateFoeHTML() {
  let foes_div = document.createElement("div");
  for(let i = 0; i < foes.length; i++) {
    let foe_div = document.createElement("div");
    foe_div.classList.add("foe");
    foe_div.innerHTML = "[" + i + "] " + foes[i].name + " " + foes[i].hp + "hp";
    foes_div.appendChild(foe_div);
  }
  document.getElementById("foes").replaceWith(foes_div);
  foes_div.id = "foes";
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function attack_random(foes) {
  let attack_strength = getRandomInt(10) + 10;
  let foe_i = getRandomInt(foes.length);
  let foe = foes[foe_i]
  foe.hp -= attack_strength;
  if(foe.hp <= 0) {
    coins += 1;
    foes.splice(foe_i, 1);
  }
}

setInterval(() => {
  updateHTML();
  updateState();
}, 1);

let layer = 1;
let zone = 'A';
let coins = 0;

let foes = []
let layer_1_foes = []
let layer_2_foes = []
let layer_3_foes = []

function setUpLayer1Foes() {
  for(let i = 0; i < 5; i++) {
    layer_1_foes.push({
      name: "Goblin",
      hp: 100
    })
  }
}

function setUpLayer2Foes() {
  for(let i = 0; i < 8; i++) {
    layer_2_foes.push({
      name: "Goblin",
      hp: 100
    })
  }
  for(let i = 0; i < 2; i++) {
    layer_2_foes.push({
      name: "Supergoblin",
      hp: 500
    })
  }
}

function setUpLayer3Foes() {
  for(let i = 0; i < 10; i++) {
    layer_3_foes.push({
      name: "Goblin",
      hp: 100
    })
  }
  for(let i = 0; i < 3; i++) {
    layer_3_foes.push({
      name: "Supergoblin",
      hp: 500
    })
  }
  layer_3_foes.push({
    name: "Void Wyrm Zephyr",
    hp: 1_000_000
  })
}

setUpLayer1Foes();
setUpLayer2Foes();
setUpLayer3Foes();
foes = layer_1_foes;

attack_button = document.getElementById("attack");
attack_button.addEventListener('click', ()=> {
  attack_random(foes);
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