import { useState, useEffect, useRef } from "react";
import { Play, Square, Clock } from "lucide-react";

const SESSION_TYPES = ["Concept", "Practice", "Revision", "Mock", "Analysis"] as const;

const StudyTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [sessionType, setSessionType] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleStart = () => setShowPicker(true);

  const selectSession = (type: string) => {
    setSessionType(type);
    setShowPicker(false);
    setIsRunning(true);
    setElapsed(0);
  };

  const handleStop = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSessionType(null);
    setElapsed(0);
  };

  return (
    <div className="bg-card rounded-2xl shadow-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={18} className="text-primary" />
        <h3 className="font-semibold text-foreground">Study Timer</h3>
        {sessionType && (
          <span className="ml-auto text-xs font-medium gradient-primary text-primary-foreground px-2.5 py-1 rounded-full">
            {sessionType}
          </span>
        )}
      </div>

      <div className="text-center">
        <p className={`text-4xl font-bold tracking-tight tabular-nums ${isRunning ? "text-primary" : "text-foreground"}`}>
          {formatTime(elapsed)}
        </p>

        {isRunning && (
          <div className="flex justify-center mt-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
          </div>
        )}

        <div className="mt-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="gradient-primary text-primary-foreground font-semibold py-3 px-8 rounded-xl shadow-orange transition-transform active:scale-95 flex items-center gap-2 mx-auto"
            >
              <Play size={18} /> Start Study
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="bg-destructive text-destructive-foreground font-semibold py-3 px-8 rounded-xl transition-transform active:scale-95 flex items-center gap-2 mx-auto"
            >
              <Square size={18} /> Stop Study
            </button>
          )}
        </div>
      </div>

      {showPicker && (
        <div className="fixed inset-0 bg-foreground/40 flex items-end z-50" onClick={() => setShowPicker(false)}>
          <div className="bg-card w-full rounded-t-3xl p-6 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <h4 className="font-bold text-lg text-foreground mb-1">Which session are you starting?</h4>
            <p className="text-sm text-muted-foreground mb-4">Select your session type</p>
            <div className="grid grid-cols-2 gap-3">
              {SESSION_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => selectSession(type)}
                  className="bg-accent text-accent-foreground font-medium py-3 px-4 rounded-xl border border-border hover:border-primary transition-colors active:scale-95"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyTimer;
