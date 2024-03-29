import Button from "./components/Button";
import FactLoader from './components/FactLoader'
import "./style.css";
import { useState, setState, useEffect } from "react";
import calculations from "./calculations";

const calcElementsArr = [ "AC", "⌫", ".", "+", 7, 8, 9, "-", 4, 5, 6, "x", 1, 2, 3, "÷", 0, "00", "FACT", "="];

export default function CalculatorApp() {
  const [currentOperand, setCurrentOperand] = useState("");
  const [prevOperand, setprevOperand] = useState("");
  const [operator, setOperator] = useState("");
  const [showFactTray, setShowFactTray] = useState(false);
  const [fact, setFact] = useState("");
  const [decreaseSize, setDecreaseSize] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_KEY,
        "X-RapidAPI-Host": process.env.REACT_APP_HOST,
      },
    };
    let randomNum = Math.floor(Math.random() * 1000);


    async function fetchFact() {
      setShowFactTray(false);
      const response = await fetch(`https://numbersapi.p.rapidapi.com/${randomNum}/math?fragment=true&json=true`,
      options);
      const data = await response.json();
      setFact(() => randomNum + " ➡ " + data.text);
      setShowFactTray(true);
      setLoader(false);
    }
    fetchFact();
  }, [loader]);

  const buttonElements = calcElementsArr.map((btn, id) => (
    <Button
      handleClick={handleBtnClick}
      flipGetFact={flipGetFact}
      key={id}
      value={btn}
      isShowFactTray={showFactTray}
    />
  ));

  return (
    <div className="calc-container">
      <div
        className={
          decreaseSize ? "smallFontSize output-screen" : "output-screen"
        }
      >
        <div className="prev-operand">
          {prevOperand} {operator}
        </div>
        <div className="current-operand">{currentOperand}</div>
      </div>

      <div className="btn-container">{buttonElements}</div>

      <div className="calc-tray">
         {(loader && !showFactTray) ?
         <FactLoader />
          :
         (showFactTray && 
          (<div className="tray">
          <p>"{fact}"</p>
         </div>))}
      </div>
    </div>
  );

  function flipGetFact() {
    setLoader(true);
  }

  function HandleOutputFontSize(bool) {
    if (bool) {
      setDecreaseSize(true);
    } else {
      setDecreaseSize(false);
    }
  }

  function handleBtnClick(e) {
    const value = e.target.innerText;

    if (value === "AC") {
      setCurrentOperand("");
      setprevOperand("");
      setOperator("");
    } else if (value === "⌫") {
      if (!currentOperand) {
        setCurrentOperand(prevOperand);
        setprevOperand("");
        setOperator("");
      } else {
        setCurrentOperand((prevState) => {
          return prevState.substring(0, prevState.length - 1);
        });
      }
    } else if (value === "-" && currentOperand === "-") {
      return;
    } else if (
      (value === "+" || value === "-" || value === "x" || value === "÷") &&
      !(!currentOperand && value === "-" && operator != "-")
    ) {
      if (!currentOperand && !prevOperand) {
        return;
      }
      if (currentOperand && prevOperand && operator) {
        let result = calculations(prevOperand, currentOperand, operator);
        setCurrentOperand("");
        setprevOperand(result.toFixed(2).toString());
        setOperator(value);
      } else {
        setprevOperand((prevState) => prevState + currentOperand);
        setCurrentOperand((prevState) => "");
        setOperator(value);
      }
    } else if (value === "=" && operator && currentOperand) {
      let result = calculations(prevOperand, currentOperand, operator);
      setCurrentOperand(result.toFixed(2).toString());
      setprevOperand("");
      setOperator("");
    } else if (value != "=") {
      if (value === "." && currentOperand.includes(".")) {
        return;
      }
      if (currentOperand.length > 12 || prevOperand.length > 12) {
        HandleOutputFontSize(true);
      } else {
        HandleOutputFontSize(false);
      }
      setCurrentOperand((prevState) => {
        if (value === "." && !currentOperand) {
          return prevState + "0.";
        } else if (currentOperand.length > 20) {
          return currentOperand;
        }
        return prevState + value;
      });
    }
  }
}
