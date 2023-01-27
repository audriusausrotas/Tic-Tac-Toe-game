const items = document.querySelectorAll(".a");
const info = document.querySelector(".error");
document.querySelector(".btn").addEventListener("click", restart);

items.forEach((item) =>
  item.addEventListener("click", () => clickHandler(item.id))
);

const possibleValues = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let currentPlayer = "p1";
let gameOn = true;
let steps = 0;
let p1 = [];
let p2 = [];
let whoStarts = 1;
let canPlayerMove = true;

function clickHandler(id) {
  info.innerHTML = "";
  if (!gameOn) return;
  if (!canPlayerMove) return;

  if (p2.includes(id) || p1.includes(id)) {
    info.innerHTML = "Can't pick already picked field";
    return;
  }

  steps++;
  color(id, "p1");
  canPlayerMove = false;
  setTimeout(pc, 500);
}

function pc() {
  if (!gameOn) return;

  ///////////////////////////////////////////////////////////////////
  // picks random move

  let step = Math.round(Math.random() * 8).toString();

  //////////////////////////////////////////////////////////////////
  // checks all combinations that can win and where player is not present

  const freeCombinations = [];
  possibleValues.map((item) => {
    item.every((aaa) => !p1.includes(aaa.toString()));
    if (item.every((aaa) => !p1.includes(aaa.toString()))) {
      freeCombinations.push(item);
    }
  });

  ///////////////////////////////////////////////////////////////////////
  // checks all combinations where PC already has fields taken

  const fastestWin = [];
  freeCombinations.map((item) => {
    if (item.some((aaa) => p2.includes(aaa.toString()))) {
      fastestWin.push(item);
    }
  });

  /////////////////////////////////////////////////////////////////////////
  // picks a move based on where pc can win the fastest

  function pickStep() {
    const randArr = Math.floor(Math.random() * fastestWin.length);
    const randNr = Math.round(Math.random() * 2);
    if (fastestWin.length > 0) {
      const temp = fastestWin[randArr][randNr];
      if (!p1.includes(temp.toString()) && !p2.includes(temp.toString())) {
        step = temp.toString();
      } else pickStep();
    }
  }

  pickStep();

  //////////////////////////////////////////////////////////////////////////
  // check if player needs to be stopped

  pcCheck("stop");

  /////////////////////////////////////////////////////////////////////////
  // check if PC can win in the next step

  p2.length >= 1 && pcCheck();

  /////////////////////////////////////////////////////////////////////////
  // checks if the block is not occupied

  if (p1.includes(step) || p2.includes(step)) pc();
  else {
    steps++;
    color(step, "p2");
  }

  //////////////////////////////////////////////////////////////////////////
  // checks if player is near win or PC is near win and picks the right move

  function pcCheck(arr) {
    const temp = arr === "stop" ? p1 : p2;

    possibleValues.map((item) => {
      let won = 0;
      temp.map((value) => {
        if (item.includes(+value)) {
          won++;
          if (won === 2) {
            item.map((number) => {
              if (
                !p1.includes(number.toString()) &&
                !p2.includes(number.toString())
              ) {
                step = number.toString();
              }
              won = 0;
            });
          }
        }
      });
    });
  }
  canPlayerMove = true;
}

/////////////////////////////////////////////////////////////////////////////////////
// adds X and O on click

function color(id, name) {
  items[id].innerHTML =
    name === "p1"
      ? `<img src="green.png" alt="x"/>`
      : `<img src="red.png" alt="x"/>`;

  name === "p1" ? p1.push(id) : p2.push(id);
  check(name);
  currentPlayer = "p2" ? (currentPlayer = "p1") : (currentPlayer = "p2");
}

///////////////////////////////////////////////////////////////////////////////////
//check win status

function check(x) {
  const temp = x === "p1" ? p1 : p2;
  possibleValues.map((item) => {
    let won = 0;
    temp.map((value) => {
      if (item.includes(+value)) {
        won++;
      }
    });
    if (won === 3) {
      info.innerHTML = x === "p1" ? "Player won" : "PC won";
      gameOn = false;
    }
    if (steps === 9) {
      gameOn = false;
      info.innerHTML = "It's a draw";
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////
// restart game

function restart() {
  whoStarts++;

  if (whoStarts % 2 === 0) {
    currentPlayer = "p2";
    canPlayerMove = false;
    setTimeout(pc, 300);
  } else currentPlayer = "p1";

  p1 = [];
  p2 = [];
  steps = 0;
  info.innerHTML = "";
  items.forEach((item) => (item.innerHTML = ""));
  gameOn = true;
}
