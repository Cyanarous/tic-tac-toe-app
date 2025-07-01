"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";

const emptyBoard = Array(9).fill(null);

type Player = "X" | "O";

export default function TicTacToeBoard() {
  const [board, setBoard] = useState<(Player | null)[]>(emptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [scores, setScores] = useState<{ X: number; O: number; draws: number }>({ X: 0, O: 0, draws: 0 });
  const [showResult, setShowResult] = useState(false);

  function checkWinner(b: (Player | null)[]): Player | null {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, bIdx, c] of lines) {
      if (
        b[a] &&
        b[a] === b[bIdx] &&
        b[a] === b[c]
      ) {
        return b[a];
      }
    }
    return null;
  }

  function handleClick(idx: number) {
    if (board[idx] || winner) return;
    const newBoard = board.slice();
    newBoard[idx] = currentPlayer;
    const win = checkWinner(newBoard);
    setBoard(newBoard);
    if (win) {
      setWinner(win);
      setScores((prev) => ({ ...prev, [win]: prev[win] + 1 }));
      setShowResult(true);
      setTimeout(() => setShowResult(false), 1500);
    } else if (newBoard.every(Boolean)) {
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      setShowResult(true);
      setTimeout(() => setShowResult(false), 1500);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  }

  function resetGame() {
    setBoard(emptyBoard);
    setWinner(null);
    setCurrentPlayer("X");
    setShowResult(false);
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="bg-white/80 dark:bg-zinc-900/80 shadow-2xl rounded-3xl p-8 w-full max-w-md border border-zinc-200 dark:border-zinc-800 flex flex-col items-center gap-6">
        {/* Scoreboard */}
        <div className="flex justify-center gap-8 w-full mb-2">
          <div className={`flex flex-col items-center px-4 py-2 rounded-xl ${currentPlayer === "X" && !winner ? "bg-red-100 dark:bg-red-900/60" : ""}`}>
            <span className="font-bold text-xl text-red-600 dark:text-red-300">X</span>
            <span className="text-lg font-semibold bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-full px-3 py-1 mt-1 shadow-sm">{scores.X}</span>
            <span className={`text-xs mt-1 min-h-[1.25rem] ${currentPlayer === "X" && !winner ? "text-red-500 animate-pulse" : "invisible"}`}>Your turn</span>
          </div>
          <div className="flex flex-col items-center px-4 py-2 rounded-xl bg-yellow-100 dark:bg-yellow-900 order-none">
            <span className="font-bold text-xl text-yellow-600 dark:text-yellow-300">Draws</span>
            <span className="text-lg font-semibold bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full px-3 py-1 mt-1 shadow-sm">{scores.draws}</span>
            <span className="min-h-[1.25rem] invisible">placeholder</span>
          </div>
          <div className={`flex flex-col items-center px-4 py-2 rounded-xl ${currentPlayer === "O" && !winner ? "bg-blue-100 dark:bg-blue-900/60" : ""}`}>
            <span className="font-bold text-xl text-blue-600 dark:text-blue-300">O</span>
            <span className="text-lg font-semibold bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full px-3 py-1 mt-1 shadow-sm">{scores.O}</span>
            <span className={`text-xs mt-1 min-h-[1.25rem] ${currentPlayer === "O" && !winner ? "text-blue-500 animate-pulse" : "invisible"}`}>Your turn</span>
          </div>
        </div>
        {/* Board */}
        <div className="grid grid-cols-3 gap-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-4 shadow-inner">
          {board.map((cell, idx) => (
            <Button
              key={idx}
              variant="outline"
              className={`w-20 h-20 text-3xl font-extrabold rounded-2xl shadow-md transition-all duration-200 border-2 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 ${cell ? "scale-105 animate-pop" : ""}`}
              onClick={() => handleClick(idx)}
              disabled={!!cell || !!winner}
            >
              <span className={cell ? `animate-fade-in ${cell === "X" ? "text-red-600 dark:text-red-300" : "text-blue-600 dark:text-blue-300"}` : ""}>{cell}</span>
            </Button>
          ))}
        </div>
        {/* Status Message */}
        <div className={`mt-2 text-lg min-h-[2rem] transition-opacity duration-500 text-center ${showResult ? "opacity-100 animate-bounce" : "opacity-80"}`}>
          {winner
            ? <span className={winner === "X" ? "text-red-600 dark:text-red-300 font-bold" : "text-blue-600 dark:text-blue-300 font-bold"}>Winner: {winner}!</span>
            : board.every(Boolean)
            ? <span className="text-zinc-600 dark:text-zinc-300 font-bold">It's a draw!</span>
            : <span className="text-zinc-500 dark:text-zinc-400">Current Player: <span className={currentPlayer === "X" ? "text-red-600 dark:text-red-300 font-bold" : "text-blue-600 dark:text-blue-300 font-bold"}>{currentPlayer}</span></span>}
        </div>
        <Button onClick={resetGame} variant="secondary" className="mt-2 w-32">Reset</Button>
      </div>
    </div>
  );
}

// Tailwind custom animations (add to your tailwind.config if not present):
// 'pop': { '0%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.15)' }, '100%': { transform: 'scale(1)' } },
// 'fade-in': { 'from': { opacity: 0 }, 'to': { opacity: 1 } } 