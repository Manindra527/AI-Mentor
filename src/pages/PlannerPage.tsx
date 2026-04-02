import { useState } from "react";
import { ChevronLeft, ChevronRight, Palmtree, Plus, X, Clock } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DATES = [14, 15, 16, 17, 18, 19, 20];

type SessionType = "Concept" | "Practice" | "Revision" | "Mock" | "Analysis";

interface TimeBlock {
  time: string;
  subject: string;
  type: SessionType;
}

const typeColors: Record<SessionType, string> = {
  Concept: "bg-blue-100 text-blue-700",
  Practice: "bg-primary/10 text-primary",
  Revision: "bg-purple-100 text-purple-700",
  Mock: "bg-destructive/10 text-destructive",
  Analysis: "bg-success/10 text-success",
};

const SESSION_TYPES: SessionType[] = ["Concept", "Practice", "Revision", "Mock", "Analysis"];

const PlannerPage = () => {
  const [selectedDate, setSelectedDate] = useState(15);
  const [planData, setPlanData] = useState<Record<number, TimeBlock[]>>({});
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [sessionType, setSessionType] = useState<SessionType>("Concept");

  const blocks = planData[selectedDate] || [];

  const handleAddSession = () => {
    if (!subject.trim()) return;
    const newBlock: TimeBlock = {
      time: `${startTime}–${endTime}`,
      subject: subject.trim(),
      type: sessionType,
    };
    setPlanData((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newBlock],
    }));
    setSubject("");
    setStartTime("09:00");
    setEndTime("10:00");
    setSessionType("Concept");
    setShowForm(false);
  };

  const handleDeleteSession = (index: number) => {
    setPlanData((prev) => ({
      ...prev,
      [selectedDate]: (prev[selectedDate] || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-5 pb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Study Planner</h1>
        <button className="text-sm text-primary font-semibold flex items-center gap-1">
          <Palmtree size={14} /> Holiday
        </button>
      </div>

      {/* Week Selector */}
      <div className="bg-card rounded-2xl shadow-card p-4">
        <div className="flex items-center justify-between mb-3">
          <button className="text-muted-foreground p-1"><ChevronLeft size={18} /></button>
          <span className="font-semibold text-sm text-foreground">March 2026</span>
          <button className="text-muted-foreground p-1"><ChevronRight size={18} /></button>
        </div>
        <div className="flex justify-between">
          {DAYS.map((day, i) => {
            const date = DATES[i];
            const isSelected = date === selectedDate;
            const hasBlocks = (planData[date] || []).length > 0;
            return (
              <button
                key={day}
                onClick={() => setSelectedDate(date)}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-[10px] text-muted-foreground font-medium">{day}</span>
                <span
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                    isSelected
                      ? "gradient-primary text-primary-foreground shadow-orange"
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  {date}
                </span>
                {hasBlocks && !isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5" />
                )}
                {!hasBlocks && <div className="w-1.5 h-1.5 mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Blocks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">March {selectedDate}</h3>
          <span className="text-xs text-muted-foreground">{blocks.length} sessions</span>
        </div>

        {blocks.length > 0 ? (
          blocks.map((block, i) => (
            <div key={i} className="bg-card rounded-2xl shadow-card p-4 flex items-start gap-3">
              <div className="text-center min-w-[48px]">
                <p className="text-xs font-medium text-muted-foreground">{block.time.split("–")[0]}</p>
                <div className="w-px h-4 bg-border mx-auto my-1" />
                <p className="text-xs font-medium text-muted-foreground">{block.time.split("–")[1]}</p>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{block.subject}</p>
                <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-md mt-1 ${typeColors[block.type]}`}>
                  {block.type}
                </span>
              </div>
              <button onClick={() => handleDeleteSession(i)} className="text-muted-foreground hover:text-destructive p-1">
                <X size={14} />
              </button>
            </div>
          ))
        ) : (
          <div className="bg-card rounded-2xl shadow-card p-8 text-center">
            <p className="text-muted-foreground text-sm">No sessions planned for this day</p>
            <p className="text-xs text-muted-foreground mt-1">Tap + to add a study session</p>
          </div>
        )}
      </div>

      {/* Add Session Form */}
      {showForm && (
        <div className="bg-card rounded-2xl shadow-card p-5 space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Add Session</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground p-1">
              <X size={18} />
            </button>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Subject / Topic</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Physics — Kinematics"
              className="w-full bg-accent border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1"><Clock size={12} /> Start</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-accent border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1"><Clock size={12} /> End</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-accent border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Session Type</label>
            <div className="flex flex-wrap gap-2">
              {SESSION_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setSessionType(type)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                    sessionType === type
                      ? "border-primary gradient-primary text-primary-foreground shadow-orange"
                      : `border-border ${typeColors[type]}`
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddSession}
            disabled={!subject.trim()}
            className="w-full gradient-primary text-primary-foreground font-semibold py-3 rounded-xl shadow-orange active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
          >
            Add Session
          </button>
        </div>
      )}

      {/* Session Type Legend */}
      <div className="bg-card rounded-2xl shadow-card p-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Session Types</h4>
        <div className="flex flex-wrap gap-2">
          {SESSION_TYPES.map((type) => (
            <span key={type} className={`text-xs font-medium px-2.5 py-1 rounded-md ${typeColors[type]}`}>
              {type}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">Concept : Practice = 40 : 60 ratio</p>
      </div>

      {/* Floating Add Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-24 right-5 w-14 h-14 gradient-primary text-primary-foreground rounded-full shadow-orange flex items-center justify-center active:scale-90 transition-transform z-30"
        >
          <Plus size={24} />
        </button>
      )}
    </div>
  );
};

export default PlannerPage;
