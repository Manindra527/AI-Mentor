import { useState } from "react";
import { ChevronLeft, ChevronRight, Palmtree } from "lucide-react";

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

const PlannerPage = () => {
  const [selectedDate, setSelectedDate] = useState(15);
  const [planData] = useState<Record<number, TimeBlock[]>>({});

  const blocks = planData[selectedDate] || [];

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
            </div>
          ))
        ) : (
          <div className="bg-card rounded-2xl shadow-card p-8 text-center">
            <p className="text-muted-foreground text-sm">No sessions planned for this day</p>
            <p className="text-xs text-muted-foreground mt-1">Tap + to add a study session</p>
          </div>
        )}
      </div>

      {/* Session Type Legend */}
      <div className="bg-card rounded-2xl shadow-card p-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Session Types</h4>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(typeColors) as SessionType[]).map((type) => (
            <span key={type} className={`text-xs font-medium px-2.5 py-1 rounded-md ${typeColors[type]}`}>
              {type}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">Concept : Practice = 40 : 60 ratio</p>
      </div>
    </div>
  );
};

export default PlannerPage;
