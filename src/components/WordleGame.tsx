"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, RefreshCw, BarChart2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import VirtualKeyboard from "./VirtualKeyboard";
import StatsModal from "./StatsModal";
import { GameStats, defaultStats, loadStats, saveStats, generateShareText } from "./types";

interface WordleGameProps {}

const WordleGame: React.FC<WordleGameProps> = () => {
  const [guesses, setGuesses] = useState<string[]>(Array(6).fill(""));
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [targetWord, setTargetWord] = useState<string>("");
  const [usedLetters, setUsedLetters] = useState<{ [key: string]: "correct" | "present" | "absent" }>({});
  const [shake, setShake] = useState<boolean>(false);
  const [revealed, setRevealed] = useState<number[]>(Array(6).fill(-1));
  const [stats, setStats] = useState<GameStats>(defaultStats);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [shareText, setShareText] = useState<string>("");

  useEffect(() => {
    setStats(loadStats());
  }, []);

  useEffect(() => {
    fetchWord();
  }, []);

  const fetchWord = async () => {
    try {
      const response = await fetch('/api/words');
      const data = await response.json();
      setTargetWord(data.word);
    } catch (error) {
      setMessage('Error al cargar la palabra');
    }
  };

  const resetGame = async () => {
    setGuesses(Array(6).fill(""));
    setCurrentGuess("");
    setCurrentRow(0);
    setGameOver(false);
    setMessage("");
    setUsedLetters({});
    setRevealed(Array(6).fill(-1));
    await fetchWord();
  };

  const updateUsedLetters = (guess: string) => {
    const newUsedLetters = { ...usedLetters };
    
    // Etiquetar letras correctas
    for (let i = 0; i < guess.length; i++) {
      if (targetWord[i] === guess[i]) {
        newUsedLetters[guess[i]] = 'correct';
      }
    }
    
    // Etiquetar letras presentes y ausentes
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      if (targetWord[i] !== letter) {
        if (targetWord.includes(letter) && newUsedLetters[letter] !== 'correct') {
          newUsedLetters[letter] = 'present';
        } else if (!targetWord.includes(letter)) {
          newUsedLetters[letter] = 'absent';
        }
      }
    }
  
    setUsedLetters(newUsedLetters);
  };

  const revealRow = (rowIndex: number) => {
    const delay = 300; // ms por letra
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        setRevealed(prev => {
          const newRevealed = [...prev];
          newRevealed[rowIndex] = i + 1; // Incrementa para incluir todas las letras reveladas
          return newRevealed;
        });
      }, i * delay);
    }
  };

  const handleKeyPress = (key: string) => {
    if (gameOver) return;

    if (key === "ENTER") {
      if (currentGuess.length !== 5) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setMessage("¡La palabra debe tener 5 letras!");
        return;
      }

      const newGuesses = [...guesses];
      newGuesses[currentRow] = currentGuess;
      setGuesses(newGuesses);
      updateUsedLetters(currentGuess);
      revealRow(currentRow);

      if (currentGuess === targetWord) {
        const newStats = {
          ...stats,
          gamesPlayed: stats.gamesPlayed + 1,
          gamesWon: stats.gamesWon + 1,
          currentStreak: stats.currentStreak + 1,
          maxStreak: Math.max(stats.maxStreak, stats.currentStreak + 1),
          guessDistribution: stats.guessDistribution.map((count, i) =>
            i === currentRow ? count + 1 : count
          ),
        };

        const shareText = generateShareText([...guesses, currentGuess], true, targetWord, currentRow + 1);

        setTimeout(() => {
          setStats(newStats);
          saveStats(newStats);
          setShareText(shareText);
          setShowStats(true);
          setMessage("¡Ganaste! 🎉");
          setGameOver(true);
        }, 1500);
      } else if (currentRow === 5) {
        setMessage(`Juego terminado. La palabra era ${targetWord}`);
        setGameOver(true);
      } else {
        setCurrentGuess("");
        setCurrentRow(currentRow + 1);
      }
    } else if (key === "⌫") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[A-Za-zÑñ]$/.test(key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + key);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (event.key === 'Backspace') {
        handleKeyPress('⌫');
      } else if (/^[A-Za-zÑñ]$/.test(event.key)) {
        handleKeyPress(event.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, currentRow, gameOver]);

  const getLetterColor = (letter: string, position: number, rowIndex: number): string => {
    if (!targetWord || revealed[rowIndex] < position) return 'bg-gray-200';
  
    if (targetWord[position] === letter) {
      return 'bg-green-500'; // Correcto
    }
    if (targetWord.includes(letter) && usedLetters[letter] === 'present') {
      return 'bg-yellow-500'; // Presente en otro lugar
    }
    return 'bg-gray-500'; // Incorrecto
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold">Wordle</h1>
        <button
          onClick={() => setShowStats(true)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          title="Estadísticas"
        >
          <BarChart2 className="w-6 h-6" />
        </button>
        <button
          onClick={resetGame}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          title="Nueva partida"
        >
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>

      {/* Contenedor del juego */}
      <div className="grid gap-2 mb-8">
        {guesses.map((guess, rowIndex) => (
          <div 
            key={rowIndex} 
            className={`flex gap-2 
              ${rowIndex === currentRow && shake ? 'animate-shake' : ''}
              ${currentGuess.toUpperCase() === targetWord && rowIndex === currentRow - 1 ? 'animate-bounce' : ''}`}
          >
            {Array(5).fill(0).map((_, colIndex) => {
              const letter = rowIndex === currentRow 
                ? currentGuess[colIndex] 
                : guess[colIndex];
              
              return (
                <div
                key={colIndex}
                className={`w-14 h-14 border-2 flex items-center justify-center text-xl font-bold
                    ${revealed[rowIndex] > colIndex ? getLetterColor(letter, colIndex, rowIndex) : 'border-gray-200'}
                    ${revealed[rowIndex] > colIndex ? 'text-white' : 'text-black'}
                    transform transition-all duration-300
                    ${revealed[rowIndex] === colIndex ? 'scale-110' : ''}`}
                >
                {letter || ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <VirtualKeyboard onKeyPress={handleKeyPress} usedLetters={usedLetters} />

      {message && (
        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <StatsModal stats={stats} isOpen={showStats} onClose={() => setShowStats(false)} shareText={shareText} />
    </div>
  );
};

export default WordleGame;
