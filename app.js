function updateState() {
}

function updateHTML() {
  document.getElementById("curr_layer").innerHTML = curr_layer;
  document.getElementById("curr_zone").innerHTML = curr_zone;
  document.getElementById("num_foes").innerHTML = foes.length;
  document.getElementById("coins").innerHTML = coins;
  let foes_div = document.createElement("div");
  for(let i = 0; i < foes.length; i++) {
    let foe_div = document.createElement("div");
    foe_div.classList.add("foe");
    foe_div.innerHTML = foes[i].name + i + " " + foes[i].hp;
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

let curr_layer = 1;
let curr_zone = 1;
let num_foes = 5;
let coins = 0;

let foes = []

for(let i = 0; i < num_foes; i++) {
  foes.push({
    name: "Goblin",
    hp: 100
  })
}

foes.push({
  name: "Supergoblin",
  hp: 500
})

attack_button = document.getElementById("attack");
attack_button.addEventListener('click', ()=> {
  attack_random(foes);
})