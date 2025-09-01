
import React, { useState } from 'react';
import { GameSettings, Operation } from '../types';

interface SettingsPageProps {
  onStartGame: (settings: GameSettings) => void;
}

const operationOptions: Operation[] = [
  Operation.Addition,
  Operation.Subtraction,
  Operation.Multiplication,
  Operation.Division,
];

const SettingsPage: React.FC<SettingsPageProps> = ({ onStartGame }) => {
  const [selectedOps, setSelectedOps] = useState<Operation[]>([Operation.Addition, Operation.Subtraction]);
  const [time, setTime] = useState<number>(3);
  const [digits, setDigits] = useState<number>(2);
  const [error, setError] = useState<string>('');

  const toggleOperation = (op: Operation) => {
    setSelectedOps((prev) =>
      prev.includes(op) ? prev.filter((p) => p !== op) : [...prev, op]
    );
  };

  const handleStart = () => {
    if (selectedOps.length === 0) {
      setError('Lütfen en az bir işlem seçin.');
      return;
    }
    if (time <= 0 || digits <= 0) {
      setError('Değerler sıfırdan büyük olmalıdır.');
      return;
    }
    setError('');
    onStartGame({
      operations: selectedOps,
      timePerQuestion: time,
      digits: digits,
    });
  };

  return (
    <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl animate-pop-in border border-slate-700">
      <h1 className="text-4xl font-bold text-center text-cyan-400 mb-2">Math Speed Run ⚡</h1>
      <p className="text-center text-slate-400 mb-8">Ayarları yapılandır ve pratiğe başla!</p>

      <div className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-slate-300 mb-3">İşlemler</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {operationOptions.map((op) => (
              <button
                key={op}
                onClick={() => toggleOperation(op)}
                className={`p-4 rounded-lg text-3xl font-bold transition-all duration-200 ${
                  selectedOps.includes(op)
                    ? 'bg-cyan-500 text-white ring-2 ring-cyan-300'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {op}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="time" className="block text-lg font-medium text-slate-300 mb-2">
            Soru Başına Süre (saniye) ⏱️
          </label>
          <input
            id="time"
            type="number"
            value={time}
            onChange={(e) => setTime(parseFloat(e.target.value))}
            min="0.1"
            step="0.1"
            className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="digits" className="block text-lg font-medium text-slate-300 mb-2">
            Basamak Sayısı 🔢
          </label>
          <input
            id="digits"
            type="number"
            value={digits}
            onChange={(e) => setDigits(parseInt(e.target.value))}
            min="1"
            step="1"
            className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
        </div>
      </div>
      
      {error && <p className="text-red-400 text-center mt-4">{error}</p>}

      <button
        onClick={handleStart}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-xl py-4 rounded-lg mt-8 transition-transform duration-200 hover:scale-105"
      >
        Başla
      </button>
    </div>
  );
};

export default SettingsPage;
