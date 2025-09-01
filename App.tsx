
import React, { useState, useCallback } from 'react';
import { GameSettings } from './types';
import SettingsPage from './components/SettingsPage';
import GamePage from './components/GamePage';

const App: React.FC = () => {
  const [settings, setSettings] = useState<GameSettings | null>(null);

  const handleStartGame = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
  }, []);

  const handleEndGame = useCallback(() => {
    setSettings(null);
  }, []);

  return (
    <main className="bg-slate-900 text-white min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {settings ? (
          <GamePage settings={settings} onEndGame={handleEndGame} />
        ) : (
          <SettingsPage onStartGame={handleStartGame} />
        )}
      </div>
    </main>
  );
};

export default App;
