import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import Die from "../components/Die";

function App() {
  const allnewDice = () => {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push({
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid(),
        count: 3,
      });
    }
    return newDice;
  };
  const [dice, setDice] = useState(allnewDice());
  const [tenzies, setTenzies] = useState(false);

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allValue = dice.every((die) => die.value === firstValue);

    if (allHeld && allValue) {
      setTenzies(true);
      console.log("You Won");
    }
  }, [dice]);

  const holdDice = (id) => {
    setDice((prevDice) =>
      prevDice.map((die) => {
        return id === die.id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  };

  const diceEle = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => {
        holdDice(die.id);
      }}
    />
  ));

  const [count, setCount] = useState(0);

  const rollDice = () => {
    if (!tenzies) {
      setDice((prevDice) =>
        prevDice.map((die) => {
          return die.isHeld
            ? die
            : {
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid(),
              };
        })
      );

      setCount((prevCount) => prevCount + 1);
    } else {
      setCount(0);
      setTenzies(false);
      setDice(allnewDice());
      CalBestScore();
    }
  };

  const [bestScore, setBestscore] = useState(
    JSON.parse(localStorage.getItem("bestScore")) || null
  );

  localStorage.setItem("bestScore", JSON.stringify(bestScore));

  const CalBestScore = () => {
    setBestscore((preBest) => {
      if (preBest === null || count < preBest) {
        return count;
      } else {
        return preBest;
      }
    });
  };

  return (
    <main>
      {tenzies && <Confetti />}
      <div className="instruction">
        <h1>Tenzi</h1>
        <p>
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
      </div>
      <div className="container">{diceEle}</div>
      <div className="best">
        <div className="count">
          <h3>Rolls</h3>
          <p>{count}</p>
        </div>
        <button onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
        <div className="count">
          <h3>Best</h3>
          <p>{bestScore}</p>
        </div>
      </div>
    </main>
  );
}

export default App;
