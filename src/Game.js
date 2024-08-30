import { useEffect, useRef, useState } from "react";
import {
  acceptedKey,
  blocks,
  firstAppleBlockNum,
  notAcceptedMove,
  snakeStartBlocks,
} from "./data";
import AppleImage from "./images/apple-img.png";
import SnakeHeadImg from "./images/snake-head.png";

function SnakeHead({ arrowDir }) {
  const snakeHeadDir = useRef(null);
  switch (arrowDir) {
    case "ArrowRight": {
      snakeHeadDir.current = "0";
      break;
    }
    case "ArrowUp": {
      snakeHeadDir.current = "-90deg";
      break;
    }
    case "ArrowDown": {
      snakeHeadDir.current = "90deg";
      break;
    }
    case "ArrowLeft": {
      snakeHeadDir.current = "180deg";
      break;
    }
    default:
  }

  return (
    <img
      className={`scale-[1.2]`}
      style={{ rotate: snakeHeadDir.current }}
      src={SnakeHeadImg}
      alt="this is snake head"
    />
  );
}

function SnakeBody({ id, head, arrowDir, snakeArr }) {
  const elementIndex = snakeArr.indexOf(id) + 1;
  // i find this number with testing
  const bodyPartScale = 1.3 - (1 / (snakeArr.length + 7)) * elementIndex;

  return (
    <span
      className={`w-[100%] h-[100%] rounded-full inline-flex justify-center items-center snakeBody${id} z-20`}
    >
      {head === id ? (
        <SnakeHead arrowDir={arrowDir} />
      ) : (
        <span
          className={`w-[70%] h-[70%] rounded-full bg-[#A1C432] bg-green inline-block`}
          style={{ scale: String(bodyPartScale > 0.2 ? bodyPartScale : 0.2) }}
        ></span>
      )}
    </span>
  );
}

function Apple() {
  return (
    <span
      className={`w-[100%] h-[100%] rounded-full absolute inline-block z-10`}
    >
      <img
        className="w-full filter-apple"
        src={AppleImage}
        alt="this is apple"
      />
    </span>
  );
}

export default function Game({
  gameStatus,
  handleSaveNewScore,
  setGameStatus,
  setEatenAppleNum,
}) {
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
    handleSaveNewScore();
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
                <SnakeBody
                  id={item.id}
                  snakeArr={currentSnakeArr}
                  head={currentSnakeArr[0]}
                  arrowDir={arrowDir}
                />
              )}
              {appleBlockNum === item.id && <Apple />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
