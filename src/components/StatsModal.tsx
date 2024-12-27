import React from 'react';
import { GameStats } from '@/components/types';
import { Share2 } from 'lucide-react';

interface StatsModalProps {
  stats: GameStats;
  isOpen: boolean;
  onClose: () => void;
  shareText?: string;
}

const StatsModal: React.FC<StatsModalProps> = ({ stats, isOpen, onClose, shareText }) => {
  if (!isOpen) return null;

  const winPercentage = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0;

  const maxGuesses = Math.max(...stats.guessDistribution);

  const handleShare = async () => {
    if (!shareText) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText
        });
      } catch {
        // Fallback al portapapeles si falla el share nativo
        await navigator.clipboard.writeText(shareText);
        alert('¡Copiado al portapapeles!');
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('¡Copiado al portapapeles!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Estadísticas</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.gamesPlayed}</div>
            <div className="text-xs text-gray-500">Jugadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{winPercentage}%</div>
            <div className="text-xs text-gray-500">Victorias</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.currentStreak}</div>
            <div className="text-xs text-gray-500">Racha</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.maxStreak}</div>
            <div className="text-xs text-gray-500">Mejor</div>
          </div>
        </div>

        <h3 className="font-bold mb-3">Distribución de intentos</h3>
        <div className="space-y-2">
          {stats.guessDistribution.map((count, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4">{i + 1}</div>
              <div className="flex-grow bg-gray-100 rounded">
                <div 
                  className="bg-green-500 text-white text-right px-2 py-1 rounded"
                  style={{
                    width: `${maxGuesses > 0 ? (count / maxGuesses) * 100 : 0}%`,
                    minWidth: count > 0 ? '10%' : '0%'
                  }}
                >
                  {count}
                </div>
              </div>
            </div>
          ))}
        </div>

        {shareText && (
          <button
            onClick={handleShare}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-bold transition-colors"
          >
            Compartir <Share2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default StatsModal;