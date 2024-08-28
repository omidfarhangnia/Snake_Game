import ScoreImage from "./images/score-img.png";
import AppleImage from "./images/apple-img.png";

import { useState } from "react";
import Game from "./Game";

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

function GameSetting({ eatenAppleNum, handlePlayGame }) {
  const [bestScore, setBestScore] = useState(0);

  return (
    <div className="h-[400px] flex justify-between items-center p-[30px] select-none">
      <div className="w-[40%] h-full flex flex-col justify-evenly items-center border-solid border-[5px] border-black bg-[#000000bf] rounded-[30px] p-[30px]">
        <button className="linear-btn" onClick={handlePlayGame}>
          play game
        </button>
        <button className="linear-btn opacity-[.3]">change difficulty</button>
        <button className="linear-btn opacity-[.3]">clear history</button>
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
          <div
            className="text-white text-[35px] uppercase font-jersey"
            title={eatenAppleNum === 0 && "you haven't play yet"}
          >
            score : {eatenAppleNum === 0 ? "---" : eatenAppleNum}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [gameStatus, setGameStatus] = useState("playing");
  // const [gameStatus, setGameStatus] = useState("paused");
  const [eatenAppleNum, setEatenAppleNum] = useState(0);
  const userAgent = window.navigator.userAgent;
  const isDeviceMobile = userAgent.includes("Mobile");

  function handlePlayGame() {
    setGameStatus("playing");
    setEatenAppleNum(0);
  }

  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden relative flex justify-center items-center">
      <div className="w-[100vw] h-[100vh] absolute top-0 bg-snakeImg z-10"></div>
      <div className="w-[90%] max-w-[800px] bg-[#ffffff76] rounded-[30px] z-20 p-[20px]">
        {isDeviceMobile ? (
          <SorryMessage />
        ) : (
          <>
            {gameStatus === "playing" ? (
              <Game
                gameStatus={gameStatus}
                setGameStatus={setGameStatus}
                setEatenAppleNum={setEatenAppleNum}
              />
            ) : (
              <GameSetting
                eatenAppleNum={eatenAppleNum}
                handlePlayGame={handlePlayGame}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
