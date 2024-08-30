import { useEffect, useState } from "react";
import Game from "./Game";
import ScoreImage from "./images/score-img.png";
import AppleImage from "./images/apple-img.png";
import SnakeEasyMode from "./images/snake-in-easy-mode.png";
import SnakeHardMode from "./images/snake-in-hard-mode.png";
import SnakeMeduimMode from "./images/snake-in-meduim.png";

const snakeImages = [SnakeEasyMode, SnakeMeduimMode, SnakeHardMode];

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

function GameSetting({
  bestScore,
  eatenAppleNum,
  handlePlayGame,
  handleClearStorage,
  handleToggleDiff,
}) {
  return (
    <div className="h-[400px] flex justify-between items-center p-[30px] select-none">
      <div className="w-[40%] h-full flex flex-col justify-evenly items-center border-solid border-[5px] border-black bg-[#000000bf] rounded-[30px] p-[30px]">
        <button className="linear-btn" onClick={handlePlayGame}>
          play game
        </button>
        <button className="linear-btn" onClick={handleToggleDiff}>
          change difficulty
        </button>
        <button className="linear-btn" onClick={handleClearStorage}>
          clear history
        </button>
      </div>
      <div className="w-[40%] h-full flex flex-col justify-between border-solid border-[5px] border-black bg-[#000000bf] rounded-[30px] p-[30px]">
        <div className="w-full h-[40%] flex flex-col justify-between items-center">
          <img
            className="h-[50%]"
            src={ScoreImage}
            alt="this is for best score"
          />
          <div className="text-white text-[35px] uppercase font-jersey">
            best score : {bestScore}
          </div>
        </div>
        <div className="w-full h-[40%] flex flex-col justify-between items-center">
          <img
            className="h-[50%]"
            src={AppleImage}
            alt="this is for current score"
          />
          <div className="text-white text-[35px] uppercase font-jersey">
            score : {eatenAppleNum}
          </div>
        </div>
      </div>
    </div>
  );
}

function DiffSetting({ diffValue, setDiffValue }) {
  return (
    <div className="w-[90vw] max-w-[800px] select-none bg-[#ffffff76] rounded-[30px] z-20 p-[20px] flex flex-col justify-center items-center">
      <div>
        <img
          className="h-[150px] object-contain"
          src={snakeImages[diffValue]}
          alt="this is snake with different emotions"
        />
      </div>
      <div className="w-[60%]">
        <div className="w-full flex justify-between items-center">
          <span
            className="text-black uppercase font-jersey text-[25px] cursor-pointer"
            onClick={() => setDiffValue(0)}
          >
            easy
          </span>
          <span
            className="text-black uppercase font-jersey text-[25px] cursor-pointer"
            onClick={() => setDiffValue(1)}
          >
            meduim
          </span>
          <span
            className="text-black uppercase font-jersey text-[25px] cursor-pointer"
            onClick={() => setDiffValue(2)}
          >
            hard
          </span>
        </div>
        <input
          className="w-full range-input-style"
          type="range"
          min={0}
          max={2}
          value={diffValue}
          onChange={(e) => setDiffValue(e.target.value)}
        />
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [gameStatus, setGameStatus] = useState("paused");
  const [eatenAppleNum, setEatenAppleNum] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [showDiffSetting, setShowDiffSetting] = useState(false);
  const [diffValue, setDiffValue] = useState(0);
  const userAgent = window.navigator.userAgent;
  const isDeviceMobile = userAgent.includes("Mobile");

  useEffect(() => {
    setBestScore(localStorage.getItem("bestScore"));
  }, []);

  function handlePlayGame() {
    setGameStatus("playing");
    setEatenAppleNum(0);
    setShowDiffSetting(false);
  }

  function handleSaveNewScore() {
    const theCurrentBestValue = localStorage.getItem("bestScore");
    if (eatenAppleNum > Number(theCurrentBestValue)) {
      localStorage.setItem("bestScore", String(eatenAppleNum));
      setBestScore(eatenAppleNum);
    }
  }

  function handleClearStorage() {
    localStorage.setItem("bestScore", "0");
    setBestScore(0);
  }

  function handleToggleDiff() {
    setShowDiffSetting(!showDiffSetting);
  }

  return (
    <>
      <div className="w-[100vw] h-[100vh] overflow-hidden relative flex flex-col justify-center gap-[50px] items-center">
        {showDiffSetting && (
          <DiffSetting diffValue={diffValue} setDiffValue={setDiffValue} />
        )}
        <div className="w-[100vw] h-[100vh] absolute top-0 bg-snakeImg z-10"></div>
        <div className="w-[90%] max-w-[800px] bg-[#ffffff76] rounded-[30px] z-20 p-[20px]">
          {isDeviceMobile ? (
            <SorryMessage />
          ) : (
            <>
              {gameStatus === "playing" ? (
                <Game
                  gameStatus={gameStatus}
                  diffValue={diffValue}
                  handleSaveNewScore={handleSaveNewScore}
                  setGameStatus={setGameStatus}
                  setEatenAppleNum={setEatenAppleNum}
                />
              ) : (
                <GameSetting
                  bestScore={bestScore}
                  eatenAppleNum={eatenAppleNum}
                  handlePlayGame={handlePlayGame}
                  handleClearStorage={handleClearStorage}
                  handleToggleDiff={handleToggleDiff}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
