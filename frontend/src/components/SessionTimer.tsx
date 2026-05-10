import { useState, useEffect } from 'react';
import api from '../api';

interface SessionTimerProps {
  bookId: string;
  currentProgress: number;
  onFinish: (data: any) => void;
  onCancel: () => void;
}

const SessionTimer = ({ bookId, currentProgress, onFinish, onCancel }: SessionTimerProps) => {
  const [startPage, setStartPage] = useState(currentProgress);
  const [endPage, setEndPage] = useState(currentProgress);
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showFinishModal, setShowFinishModal] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isTracking && startTime) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, startTime]);

  const handleStart = () => {
    setIsTracking(true);
    setStartTime(new Date());
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleFinishSubmit = async () => {
    if (!startTime) return;
    const endTime = new Date();
    
    const sessionData = {
      bookId,
      startPage: Number(startPage),
      endPage: Number(endPage),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString()
    };

    try {
      const res = await api.post('/sessions/finish', sessionData);
      onFinish(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  if (showFinishModal) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold mb-4">Complete Session</h3>
        <p className="mb-4">You read for <strong>{Math.floor(elapsedSeconds / 60)} minutes</strong>.</p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">What page did you end on?</label>
          <input 
            type="number" 
            value={endPage} 
            onChange={(e) => setEndPage(Number(e.target.value))}
            className="w-full p-3 border rounded-lg"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={handleFinishSubmit} className="flex-1 bg-emerald-500 text-white py-3 rounded-lg font-bold">Save Session</button>
          <button onClick={() => setShowFinishModal(false)} className="flex-1 bg-slate-200 text-slate-800 py-3 rounded-lg font-bold">Resume</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
      <h3 className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-4">Live Session</h3>
      
      {!isTracking ? (
        <div className="max-w-xs mx-auto">
          <label className="block text-sm font-medium text-slate-700 mb-1">Starting Page</label>
          <input 
            type="number" 
            value={startPage} 
            onChange={(e) => setStartPage(Number(e.target.value))}
            className="w-full p-3 border rounded-lg text-center font-bold text-xl mb-4"
          />
          <div className="flex gap-2">
            <button onClick={handleStart} className="flex-1 bg-emerald-500 text-white py-3 rounded-lg font-bold text-lg shadow-md">Begin</button>
            <button onClick={onCancel} className="bg-slate-200 text-slate-700 px-4 py-3 rounded-lg font-bold">Cancel</button>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-6xl font-mono font-light tracking-tight mb-8">
            {formatTime(elapsedSeconds)}
          </div>
          
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => setShowFinishModal(true)} 
              className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-slate-800"
            >
              Finish Reading
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionTimer;
