import Die from "./Components/Die";
import React from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [dice, setDice] = React.useState(randomDiceGenerator());
  const [tenzie, setTenzie] = React.useState(false);
  const [movesCount, setMovesCount] = React.useState(0);
  const [time, setTime] = React.useState(0);
  const [isTimerActive, setIsTimerActive] = React.useState(false);
  const [bestTimeTaken, setBestTimeTaken] = React.useState(localStorage.getItem('bestTimeTaken') || 0);

  React.useEffect(() => {
    window.addEventListener("resize", () =>
      setWindowSize(() => ({
        width: window.innerWidth,
        height: window.innerHeight,
      }))
    );
  }, []);

  function randomDieGenerator() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function randomDiceGenerator() {
    const diceArr = [];
    for (let i = 0; i < 10; i++) {
      if(i == 10 - 1 && windowSize.width < 425) {
          break;
      }
      diceArr.push(randomDieGenerator());
    }
    return diceArr;
  }

  function rollDice() {
    if (tenzie) {
      setDice(randomDiceGenerator());
      setTenzie(false);
      setMovesCount(0);
      setTime(0);
    } else {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : randomDieGenerator();
        })
      );
      setMovesCount((prevCount) => prevCount + 1);
    }
  }

  function hold(id) {
    setDice((oldDice) =>
      oldDice.map((die) =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  }

  // Timer code
  React.useEffect(() => {
      let timer = null;

       if(isTimerActive && !tenzie){
        timer = setInterval(() => {
           setTime(prevSecond => prevSecond + 1);
        }, 1000);
      }
      if(tenzie){
        if(time < bestTimeTaken || bestTimeTaken === 0){
          setBestTimeTaken(time);
          localStorage.setItem('bestTimeTaken', time);
        }
      }
     
       return () => {
        clearInterval(timer);
       }
  }, [tenzie, isTimerActive])


  const diceElements = dice.map((die) => (
    <Die
      value={die.value}
      isHeld={die.isHeld}
      key={die.id}
      handleHold={() => hold(die.id)}
    />
  ));

  function winCase() {
    const firstVal = dice[0].value;
    return dice.every((die) => die.isHeld && die.value === firstVal);
  }

  React.useEffect(() => {
    const isWon = winCase();
    if (isWon) {
      setTenzie(true);
    }
  }, [dice]);

  return (
    <>
      {tenzie && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}
      <div id="showcase-container">
        <div id="showcase">
          <div className="game-performance">
            {(bestTimeTaken != 0) && <p>Best Time: {bestTimeTaken}s</p>}
            <p>Moves : {movesCount}</p>
            <p>Time : {time}s</p>
          </div>
          <h1 className="heading">Tenzies</h1>
          <p className="hint-txt">
            Roll until all dice are the same. Click each die to freeze it at its
            current value between rolls.
          </p>

          <div className="dice">{diceElements}</div>

          <button
            onClick={() => { rollDice(); setIsTimerActive(true)}}
            className="roll-btn"
          >
            {tenzie ? "New Game" : "Roll"}
          </button>

        </div>
      </div>
    </>
  );
}
