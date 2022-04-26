import 'bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/styles.css";
import Character from "./js/Character.js";
import Enemy from "./js/Enemy.js";
import { attack } from "./js/combatEngine.js";
import {shopkeep} from "./js/shopKeep.js";

let dude = new Character();
let otherDude = new Character();
dude.class("Fighter");
otherDude.class("Rogue");
let rat = new Enemy();
rat.npcGen("Boss' Kid");
updateHealthBars(dude, rat);

export const displayWinModal = () => {
  let canvas = document.querySelector(`.canvas`);
  let p = document.createElement("p");
  let goBack = document.getElementById("goBack");
  let bossFight = document.getElementById("bossFight");
  let dice = document.getElementById("button");
  canvas.append(p);
  p.textContent = `You win.`;

  dice.setAttribute("disabled", true);
  shopKeep.style.display = "block";
  goBack.style.display = "block";
  bossFight.style.display = "block";

  backToWork();

};

const backToWork = () => {
  let goBack = document.getElementById("goBack");
  let bossFight = document.getElementById("bossFight");
  let dice = document.getElementById("button");
  
  goBack.addEventListener("click", () => {
    dice.setAttribute("disabled", false);
    shopKeep.style.display = "none";
    goBack.style.display = "none";
    bossFight.style.display = "none";
  });
};

function updateHealthBars (character, enemy){
  let hp1 = document.getElementById(`hp1`);
  let hp2 = document.getElementById(`hp2`);
  const percentage1 = (character.hp /character.maxHp) * 100;
  const percentage2 = (enemy.hp/enemy.maxHp) * 100;
  hp1.style.cssText = `
    background: lightblue;
    width: ${percentage1}%;
    height: 100%;
  `;
  hp2.style.cssText = `
    background: rgb(218, 83, 83);
    width: ${percentage2}%;
    height: 100%;
  `;
}

const button = document.getElementById("button");
button.addEventListener("click", () => {
  attack(dude, rat);
  updateHealthBars(dude, rat);
  attack(rat, dude);
  updateHealthBars(dude, rat);
});

export const buy = (character, item) => {
  character.money -= item.price;
  character.getItem(item);
  /*
  shopkeep.items.indexOf checks "espresso" or "union card" === [{},{},{}]
  {name: "espresso"}
  */
  let index = shopkeep.items.findIndex(obj => {
    return obj.name === item;
  });
  console.log(index);
  shopkeep.items.splice(index, 1);
  console.log(dude, shopkeep);
};

const shopKeep = document.getElementById("shopKeep");
shopKeep.addEventListener("click", function(){
  // buy(dude, shopkeep.items[1])
  console.log("clicked");
  populate();
  shopKeep.setAttribute(`disabled`, true);
  let shop = document.querySelector(".shop");
  shop.style.display = "block";
});

//UI shopkeep
const shopMenu = document.querySelector(".shopMenu");

export const populate = () => {
  let items = shopkeep.items;
  items.forEach((item) => {
    const index = shopkeep.items.indexOf(item);
    const shopItem = shopkeep.items[index].name;
    const div = document.createElement("div");
    div.classList.add(`itemBox`);
    shopMenu.appendChild(div);
    div.innerHTML = `
      <div class="itemGrid">
        <p>${items[index].name}</p>
        <p>$${items[index].price}</p>
        <div class="footer"><button class="btn btn-primary buyBtn" id="shopIndex${index}" value=${shopItem}>Buy</button></div>
      </div>
    `;
    const buyBtn = document.getElementById(`shopIndex${index}`);
    buyBtn.addEventListener("click",  function(){
      let itemIndex = buyBtn.value;
      console.log("clicked", itemIndex);
      buy(dude, itemIndex);
      buyBtn.setAttribute(`disabled`, true);
    });

  });
  exitButton();
};

const exitButton = () => {
  let exit = document.createElement("button");
  exit.setAttribute("id", "exit");
  exit.textContent = "Exit Shop";
  let shop = document.querySelector(".shop");
  shop.appendChild(exit);
  let doneShopping = document.getElementById("exit");
  doneShopping.addEventListener("click", function(){
    let shopMenu = document.querySelector(".shopMenu");
    let itemBoxes = document.querySelectorAll(".itemBox");
    if (shopMenu.hasChildNodes()){
      itemBoxes.forEach(function(e){
        e.remove();
      });
      exit.remove();
    }
    shop.style.display = "none";
  
    let shopKeep = document.getElementById("shopKeep");
    shopKeep.removeAttribute("disabled");
  });
};

