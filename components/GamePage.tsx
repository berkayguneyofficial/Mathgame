
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameSettings, Question, Operation } from '../types';
import ProgressBar from './ProgressBar';

interface GamePageProps {
  settings: GameSettings;
  onEndGame: () => void;
}

const GamePage: React.FC<GamePageProps> = ({ settings, onEndGame }) => {
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [question, setQuestion] = useState<Question | null>(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [progressBarKey, setProgressBarKey] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const generateNewQuestion = useCallback(() => {
    const operation = settings.operations[Math.floor(Math.random() * settings.operations.length)];
    const max = Math.pow(10, settings.digits) - 1;
    const min = settings.digits > 1 ? Math.pow(10, settings.digits - 1) : 0;

    let num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    let num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    let answer = 0;

    switch (operation) {
      case Operation.Addition:
        answer = num1 + num2;
        break;
      case Operation.Subtraction:
        if (num1 < num2) [num1, num2] = [num2, num1];
        answer = num1 - num2;
        break;
      case Operation.Multiplication:
        answer = num1 * num2;
        break;
      case Operation.Division:
        const factor = Math.floor(Math.random() * (10 - 2 + 1)) + 2; // Divisor between 2-10 for simplicity
        num2 = factor;
        num1 = (Math.floor(Math.random() * (max / factor - min + 1)) + min) * factor;
        if (num1 === 0 && min > 0) num1 = min * factor;
        answer = num1 / num2;
        break;
    }
    return { num1, num2, operation, answer };
  }, [settings]);
  
  const advanceToNextQuestion = useCallback((isCorrect?: boolean) => {
    if (feedback) return; // Prevent multiple advances

    if (isCorrect === true) {
      setScore(s => ({ ...s, correct: s.correct + 1 }));
      setFeedback('correct');
    } else { // Handles incorrect and timeout
      setScore(s => ({ ...s, incorrect: s.incorrect + 1 }));
      setFeedback('incorrect');
    }
    
    setUserInput('');

    setTimeout(() => {
        setFeedback(null);
        setQuestion(generateNewQuestion());
        setProgressBarKey(k => k + 1);
    }, 400);

  }, [feedback, generateNewQuestion]);

  useEffect(() => {
    gameAreaRef.current?.focus();
    setQuestion(generateNewQuestion());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!question) return;

    const timerId = setTimeout(() => {
        advanceToNextQuestion(false);
    }, settings.timePerQuestion * 1000);

    return () => clearTimeout(timerId);
  }, [question, settings.timePerQuestion, advanceToNextQuestion]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (feedback) return; // Disable input during feedback
    
    if (e.key >= '0' && e.key <= '9') {
      setUserInput(prev => prev + e.key);
    } else if (e.key === 'Backspace') {
      setUserInput(prev => prev.slice(0, -1));
    } else if (e.key === 'Enter' && userInput) {
      const userAnswer = parseInt(userInput, 10);
      advanceToNextQuestion(userAnswer === question?.answer);
    }
  }, [userInput, question, feedback, advanceToNextQuestion]);

  const total = score.correct + score.incorrect;
  const correctPercentage = total > 0 ? (score.correct / total) * 100 : 0;
  const incorrectPercentage = total > 0 ? (score.incorrect / total) * 100 : 100;

  const feedbackClasses = 
    feedback === 'correct' ? 'bg-green-500/20 border-green-500' :
    feedback === 'incorrect' ? 'bg-red-500/20 border-red-500' :
    'bg-slate-800 border-slate-700';

  return (
    <div
      ref={gameAreaRef}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="w-full h-[80vh] flex flex-col p-6 outline-none"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 text-xl">
          <span className="text-green-400 font-semibold">✅ {score.correct}</span>
          <span className="text-red-400 font-semibold">❌ {score.incorrect}</span>
        </div>
        <button onClick={onEndGame} className="bg-slate-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
          Bitir
        </button>
      </div>

      <div className="w-full bg-slate-700 rounded-full h-3 mb-8 flex">
        <div style={{width: `${correctPercentage}%`}} className="bg-green-500 h-3 rounded-l-full transition-all duration-300"></div>
        <div style={{width: `${incorrectPercentage}%`}} className="bg-red-500 h-3 rounded-r-full transition-all duration-300"></div>
      </div>
      
      <div className={`flex-grow flex flex-col items-center justify-center text-center rounded-2xl border-2 transition-colors duration-300 ${feedbackClasses}`}>
        {feedback && (
          <div className="absolute text-8xl animate-pop-in">
            {feedback === 'correct' ? '🥳' : '🤯'}
          </div>
        )}
        {question && !feedback && (
          <div className="animate-pop-in">
            <div className="text-7xl md:text-8xl font-bold text-slate-300 tracking-wider">
              <span>{question.num1}</span>
              <span className="text-cyan-400 mx-4">{question.operation}</span>
              <span>{question.num2}</span>
            </div>
            <div className="mt-8 text-6xl md:text-7xl font-bold text-white h-20 min-w-[2ch]">
              {userInput || '?'}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        <ProgressBar key={progressBarKey} duration={settings.timePerQuestion} />
      </div>
       <div className="text-center mt-4 text-slate-500">
          Cevabı yazıp 'Enter' tuşuna basın.
       </div>
    </div>
  );
};

export default GamePage;
