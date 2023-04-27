import "./style.css";
import { Subject, fromEvent } from "rxjs";
import JSConfetti from "js-confetti";
import WORDS_LIST from "./wordsList.json";

const letterRows = document.getElementsByClassName("letter-row");
const messageText = document.getElementById("message-text");
const onKeyDown$ = fromEvent(document, "keydown");
let letterIndex = 0;
let letterRowIndex = 0;
let userAnswer = [];
const getRandomWord = () =>
  WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
let rightWord = getRandomWord();
console.log(`Right word: ${rightWord}`);

const userWinOrLoose$ = new Subject();

const insertLetter = {
  next: (event) => {
    const pressedKey = event.key.toUpperCase();
    if (
      pressedKey.length === 1 &&
      pressedKey.match(/[A-Z]/i) &&
      letterIndex < 5
    ) {
      let letterBox =
        Array.from(letterRows)[letterRowIndex].children[letterIndex];
      letterBox.textContent = pressedKey;
      letterBox.classList.add("filled-letter");
      letterIndex++;
      userAnswer.push(pressedKey);
    }
  },
};

const checkWord = {
  next: (event) => {
    if (event.key === "Enter") {
      if (userAnswer.length !== 5) {
        messageText.textContent = "¡Te faltan algunas letras!";
        return; // <- Este return nos permite parar la ejecución del observable
      }

      // También podemos cambiar el ciclo for/forEach/while en lugar de `userAnswer.map()`
      // 😊 Iteramos sobre las letras en índices `[0, 1, 2, 3, 4]`:
      userAnswer.map((_, i) => {
        let letterColor = "";
        let letterBox = letterRows[letterRowIndex].children[i];

        // 🔍 Verificamos si la posición de la letra del usuario coincide con la posición correcta
        // Si la letra no se encuentra, indexOf() devolverá -1 (ver línea 58)
        // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
        let letterPosition = rightWord.indexOf(userAnswer[i]);

        if (rightWord[i] === userAnswer[i]) {
          letterColor = "letter-green"; // Pintar de verde 🟩 si coincide letra[posición]
        } else {
          if (letterPosition === -1) {
            letterColor = "letter-grey"; // Pintar de gris ⬜️ si no coincide letra o posición
          } else {
            letterColor = "letter-yellow"; // Pintar de amarillo 🟨 si coincide letra, pero no posición
          }
        }
        letterBox.classList.add(letterColor);
      });

      // 💚 Ganas el juego si la respuesta del usuario coincide con la palabra correcta
      if (userAnswer.join("") === rightWord) {
        userWinOrLoose$.next();
      }

      // 🔄 Cuando se haya completado la palabra, permite escribir en la siguiente fila:
      if (userAnswer.length === 5) {
        letterIndex = 0;
        userAnswer = [];
        letterRowIndex++;
      }
    }
  },
};

// 📝 Observador `removeLetter` (o `deleteLetter`) que nos ayuda a borrar la última letra
const removeLetter = {
  next: (event) => {
    const pressedKey = event.key;
    // Verificamos si es la tecla Backspace y que no estamos en la primera posición [0]
    if (pressedKey === "Backspace" && letterIndex !== 0) {
      let letterBox =
        letterRows[letterRowIndex].children[userAnswer.length - 1];
      letterBox.textContent = "";
      letterBox.classList = "letter";
      letterIndex--;
      userAnswer.pop();
    }
  },
};

onKeyDown$.subscribe(insertLetter);
onKeyDown$.subscribe(checkWord);
onKeyDown$.subscribe(removeLetter);

userWinOrLoose$.subscribe(() => {
  let letterRowsWinned = letterRows[letterRowIndex];
  for (let i = 0; i < 5; i++) {
    letterRowsWinned.children[i].classList.add("letter-green");
  }
  const jsConfetti = new JSConfetti();
  jsConfetti.addConfetti();
});
