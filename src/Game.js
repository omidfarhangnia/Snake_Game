import { useEffect, useRef, useState } from "react";
import {
  acceptedKey,
  blocks,
  firstAppleBlockNum,
  notAcceptedMove,
  snakeStartBlocks,
} from "./data";

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
      className={`w-[60%] h-[60%] rounded-full absolute inline-block bg-green-600 z-10`}
    ></span>
  );
}

function Game() {
  const [snake, setSnake] = useState(snakeStartBlocks);
  const [gameStatus, setGameStatus] = useState("playing");
  const [arrowDir, setArrowDir] = useState("ArrowRight");
  const [appleBlockNum, setAppleBlockNum] = useState(firstAppleBlockNum);
  const [eatenAppleNum, setEatenAppleNum] = useState(0);
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
    setGameStatus("paused");
    setAppleBlockNum(firstAppleBlockNum);
    clearInterval(intervalRef.current);
  }

  function handlePlayGame(e, status = "newGame") {
    if (status === "newGame") {
      setGameStatus("playing");
      setSnake(snakeStartBlocks);
      setArrowDir("ArrowRight");
      setEatenAppleNum(0);
      setLegalSnakeLength(Array.from(snake).length);
    }
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
      className="w-full flex items-center justify-center h-[100vh] bg-black"
    >
      {gameStatus === "playing" ? (
        <div className="w-[700px] h-[500px] bg-white flex flex-wrap justify-evenly items-center">
          {blocks.map((item, i) => {
            return (
              <button
                key={i}
                className="w-[5%] aspect-square bg-gray-400 relative flex items-center justify-center"
              >
                <span className="absolute top-0 right-0 text-[16px]">
                  {item.id}
                </span>
                {snake.has(item.id) && (
                  <SnakeBody id={item.id} head={currentSnakeArr[0]} />
                )}
                {appleBlockNum === item.id && <Apple />}
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <div className="text-white">you looosed</div>
          <button className="bg-white" onClick={handlePlayGame}>
            play again
          </button>
        </>
      )}
    </div>
  );
}

function SorryMessage() {
  return (
    <div>
      <h1 className="text-[32px] uppercase text-center font-jersey text-white">
        sorry your device can't support this game
      </h1>
      <p className="text-center capitalize font-jersey text-[#fffffff6] mt-[20px]">
        Please comeback with other device and you can play this game easily
      </p>
    </div>
  );
}

function PlayGame() {
  return (
    <div className="h-full flex justify-between items-center p-[30px]">
      <div className="w-[40%] h-full bg-black">
        <button></button>
        <button></button>
        <button></button>
      </div>
      <div className="w-[40%] h-full bg-blue-500">
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const userAgent = window.navigator.userAgent;
  const isDeviceMobile = userAgent.includes("Mobile");

  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden relative flex justify-center items-center">
      <div className="w-[100vw] h-[100vh] absolute top-0 bg-snakeImg z-10"></div>
      <div className="w-[90%] h-[50%] max-w-[800px] bg-[#ffffff76] rounded-[30px] z-20 p-[20px]">
        {isDeviceMobile ? <SorryMessage /> : <PlayGame />}
      </div>
    </div>
  );
}
