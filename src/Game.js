import { useEffect, useRef, useState } from "react";
import {
  acceptedKey,
  blocks,
  firstAppleBlockNum,
  notAcceptedMove,
  snakeStartBlocks,
} from "./data";
import AppleImage from "./images/apple-img.png";

function SnakeBody({ id, head }) {
  return (
    <span
      className={`w-[60%] h-[60%] ${
        head === id ? "bg-black" : "bg-red-400"
      }  rounded-full inline-block snakeBody${id} z-20`}
    ></span>
  );
}

function Apple() {
  return (
    <span
      className={`w-[60%] h-[60%] rounded-full absolute inline-block bg-green-400 z-10`}
    ></span>
  );
}

export default function Game({ gameStatus, setGameStatus, setEatenAppleNum }) {
  const [snake, setSnake] = useState(snakeStartBlocks);
  const [arrowDir, setArrowDir] = useState("ArrowRight");
  const [appleBlockNum, setAppleBlockNum] = useState(firstAppleBlockNum);
  const [legalSnakeLength, setLegalSnakeLength] = useState(
    Array.from(snake).length
  );
  const intervalRef = useRef(null);
  let currentSnakeArr = Array.from(snake);

  useEffect(() => {
    if (gameStatus === "paused") return;
    // document.querySelector(".gameGround").click();
    intervalRef.current = setInterval(() => {
      handleMoveSnake(arrowDir);
    }, 200);
    if (appleBlockNum === null) {
      putAppleInGround();
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [arrowDir, snake, gameStatus]);

  function handleMoveSnake(arrowDir) {
    let newArr = Array.from(snake);
    const popedNumber = newArr.pop();
    switch (arrowDir) {
      case "ArrowDown":
        if (currentSnakeArr[1] - currentSnakeArr[0] === 20) {
          setArrowDir("ArrowUp");
          return;
        }
        newArr.unshift(currentSnakeArr[0] + 20);
        break;
      case "ArrowUp":
        if (currentSnakeArr[1] - currentSnakeArr[0] === -20) {
          setArrowDir("ArrowDown");
          return;
        }
        newArr.unshift(currentSnakeArr[0] - 20);
        break;
      case "ArrowRight":
        if (currentSnakeArr[1] - currentSnakeArr[0] === 1) {
          setArrowDir("ArrowLeft");
          return;
        }
        newArr.unshift(currentSnakeArr[0] + 1);
        break;
      case "ArrowLeft":
        if (currentSnakeArr[1] - currentSnakeArr[0] === -1) {
          setArrowDir("ArrowRight");
          return;
        }
        newArr.unshift(currentSnakeArr[0] - 1);
        break;
      default:
    }

    checkGameStatus(currentSnakeArr, arrowDir);

    if (checkIsAppleEaten()) {
      newArr.push(popedNumber);
    }

    let newSet = new Set(newArr);
    setSnake(newSet);
  }

  function checkGameStatus(currentSnakeArr, arrowDir) {
    if (
      arrowDir === "ArrowRight" &&
      notAcceptedMove.toRight.has(currentSnakeArr[0])
    ) {
      handlePauseGame();
    } else if (
      arrowDir === "ArrowLeft" &&
      notAcceptedMove.toLeft.has(currentSnakeArr[0])
    ) {
      handlePauseGame();
    } else if (
      arrowDir === "ArrowUp" &&
      notAcceptedMove.toUp.has(currentSnakeArr[0])
    ) {
      handlePauseGame();
    } else if (
      arrowDir === "ArrowDown" &&
      notAcceptedMove.toDown.has(currentSnakeArr[0])
    ) {
      handlePauseGame();
    }

    if (legalSnakeLength !== Array.from(snake).length) {
      handlePauseGame();
    }
  }

  function handlePauseGame() {
    setGameStatus("paused");
    setAppleBlockNum(firstAppleBlockNum);
    setSnake(snakeStartBlocks);
    setArrowDir("ArrowRight");
    setLegalSnakeLength(Array.from(snake).length);
    clearInterval(intervalRef.current);
  }

  function putAppleInGround() {
    const avaialbeBlocks = blocks.filter((e) => !snake.has(e.id));
    const randomBlock = Math.floor(Math.random() * (avaialbeBlocks.length - 1));
    setAppleBlockNum(randomBlock);
  }

  function checkIsAppleEaten() {
    if (snake.has(appleBlockNum)) {
      setAppleBlockNum(null);
      setEatenAppleNum((x) => x + 1);
      setLegalSnakeLength((x) => x + 1);
      return true;
    } else {
      return false;
    }
  }

  return (
    <div
      onKeyDown={(e) => {
        // we need just left right up and down arrows
        if (!acceptedKey.has(e.code)) return;
        setArrowDir(e.code);
      }}
      className="w-full h-[700px] flex justify-center items-center"
    >
      <div className="w-[700px] bg-white flex flex-wrap justify-evenly items-center">
        {blocks.map((item, i) => {
          return (
            <button
              autoFocus
              key={i}
              className={`w-[5%] aspect-square relative flex items-center focus-visible:outline-none justify-center ${
                item.color === "dark" ? "bg-[#302952]" : "bg-[#932554]"
              }`}
            >
              {snake.has(item.id) && (
                <SnakeBody id={item.id} head={currentSnakeArr[0]} />
              )}
              {appleBlockNum === item.id && <Apple />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
