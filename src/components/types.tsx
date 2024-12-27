// types.ts
export interface GameStats {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    maxStreak: number;
    guessDistribution: number[];
    lastPlayedDate: string | null;
  }
  
  // utils/storage.ts
  export const defaultStats: GameStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
    lastPlayedDate: null,
  };
  
  export const loadStats = (): GameStats => {
    if (typeof window === 'undefined') return defaultStats;
    const stats = localStorage.getItem('wordleStats');
    return stats ? JSON.parse(stats) : defaultStats;
  };
  
  export const saveStats = (stats: GameStats) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('wordleStats', JSON.stringify(stats));
  };
  
  export const generateShareText = (guesses: string[], won: boolean, targetWord: string, attemptNumber: number) => {
    const emojiGrid = guesses
      .filter(guess => guess)
      .map(guess => {
        return guess
          .split('')
          .map((letter, i) => {
            if (letter === targetWord[i]) return '🟩';
            if (targetWord.includes(letter)) return '🟨';
            return '⬜';
          })
          .join('');
      })
      .join('\n');
  
    return `Wordle ${won ? attemptNumber : 'X'}/6\n\n${emojiGrid}`;
  };