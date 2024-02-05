function updateState() {
}

function updateHTML() {
  document.getElementById("curr_layer").innerHTML = curr_layer;
  document.getElementById("curr_zone").innerHTML = curr_zone;
  document.getElementById("num_foes").innerHTML = num_foes;
  let foe_divs = document.getElementsByClassName("foe");
  for(let i = 0; i < foe_divs.length; i++) {
    foe_divs[i].innerHTML = "foe" + i + " " + foes[i]
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

setInterval(() => {
  updateHTML();
  updateState();
}, 1);

let curr_layer = 1;
let curr_zone = 1;
let num_foes = 5;

var foes = new Array(num_foes).fill(100);

foes_div = document.getElementById("foes")
for(let i = 0; i < foes.length; i++) {
  const foe_div = document.createElement("div");
  foe_div.classList.add("foe")
  foes_div.appendChild(foe_div);
}

attack_button = document.getElementById("attack");
attack_button.addEventListener('click', ()=> {
  foes[getRandomInt(foes.length)] -= 20;
})