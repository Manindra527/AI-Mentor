import { useState } from "react";
import { BookOpen, Plus } from "lucide-react";

const MOODS = [
  { label: "Focused", emoji: "🎯" },
  { label: "Distracted", emoji: "😶‍🌫️" },
  { label: "Tired", emoji: "😴" },
  { label: "Motivated", emoji: "🔥" },
  { label: "Frustrated", emoji: "😤" },
  { label: "Stressed", emoji: "😰" },
];

const STRESS_REASONS = [
  "Topic difficult",
  "Too many questions",
  "Time pressure",
  "Didn't understand concept",
  "Personal distraction",
];

const HARDNESS = ["Easy", "Medium", "Hard", "Mixed"];

interface JournalEntry {
  subject: string;
  topic: string;
  time: string;
  type: "concept" | "practice";
  mood: string;
  stressReason?: string;
  questions?: number;
  correct?: number;
  hardness?: string;
  notes?: string;
}

const JournalPage = () => {
  const [showNew, setShowNew] = useState(false);
  const [entryType, setEntryType] = useState<"concept" | "practice">("concept");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showStressReasons, setShowStressReasons] = useState(false);
  const [entries] = useState<JournalEntry[]>([]);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setShowStressReasons(mood === "Stressed");
  };

  return (
    <div className="space-y-5 pb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Daily Journal</h1>
        <button
          onClick={() => setShowNew(!showNew)}
          className="gradient-primary text-primary-foreground p-2 rounded-xl shadow-orange active:scale-95 transition-transform"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* New Entry Form */}
      {showNew && (
        <div className="bg-card rounded-2xl shadow-card-lg p-5 space-y-4 animate-fade-in-up">
          <h3 className="font-semibold text-foreground">New Entry</h3>

          <div className="flex gap-2">
            {(["concept", "practice"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setEntryType(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  entryType === t
                    ? "gradient-primary text-primary-foreground shadow-orange"
                    : "bg-accent text-accent-foreground"
                }`}
              >
                {t === "concept" ? "Concept Study" : "Practice Session"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Subject</label>
              <input className="w-full bg-accent border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. Quant" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Topic</label>
              <input className="w-full bg-accent border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. Percentage" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Time Studied</label>
            <input className="w-full bg-accent border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. 60 min" />
          </div>

          {entryType === "practice" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Questions Attempted</label>
                  <input type="number" className="w-full bg-accent border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Correct Answers</label>
                  <input type="number" className="w-full bg-accent border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Hardness Level</label>
                <div className="flex gap-2">
                  {HARDNESS.map((h) => (
                    <button key={h} className="flex-1 py-2 rounded-xl text-xs font-medium bg-accent text-accent-foreground border border-border hover:border-primary transition-colors">
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {entryType === "concept" && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Notes</label>
              <textarea className="w-full bg-accent border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none h-20" placeholder="Key points learned..." />
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">How did you feel during this session?</label>
            <div className="grid grid-cols-3 gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.label}
                  onClick={() => handleMoodSelect(m.label)}
                  className={`py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    selectedMood === m.label
                      ? "gradient-primary text-primary-foreground shadow-orange"
                      : "bg-accent text-accent-foreground border border-border"
                  }`}
                >
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
          </div>

          {showStressReasons && (
            <div className="animate-fade-in-up">
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Why were you stressed?</label>
              <div className="space-y-2">
                {STRESS_REASONS.map((r) => (
                  <button key={r} className="w-full text-left py-2.5 px-3 rounded-xl text-sm bg-accent text-accent-foreground border border-border hover:border-primary transition-colors">
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button className="w-full gradient-primary text-primary-foreground font-semibold py-3 rounded-xl shadow-orange active:scale-95 transition-transform">
            Save Entry
          </button>
        </div>
      )}

      {/* Past Entries */}
      <div>
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <BookOpen size={16} className="text-primary" />
          Today's Entries
        </h3>
        {entries.length > 0 ? (
          <div className="space-y-3">
            {entries.map((entry, i) => (
              <div key={i} className="bg-card rounded-2xl shadow-card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{entry.subject} — {entry.topic}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{entry.time} · {entry.type === "concept" ? "Concept" : "Practice"}</p>
                  </div>
                  <span className="text-sm">{MOODS.find((m) => m.label === entry.mood)?.emoji}</span>
                </div>
                {entry.type === "practice" && entry.questions && (
                  <div className="flex gap-4 mt-3 text-xs">
                    <span className="text-muted-foreground">
                      Attempted: <span className="font-semibold text-foreground">{entry.questions}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Correct: <span className="font-semibold text-success">{entry.correct}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Accuracy: <span className="font-semibold text-primary">{Math.round((entry.correct! / entry.questions) * 100)}%</span>
                    </span>
                  </div>
                )}
                {entry.stressReason && (
                  <p className="text-xs text-destructive mt-2">Stress reason: {entry.stressReason}</p>
                )}
                {entry.notes && (
                  <p className="text-xs text-muted-foreground mt-2 italic">"{entry.notes}"</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-2xl shadow-card p-8 text-center">
            <p className="text-sm text-muted-foreground">No journal entries yet</p>
            <p className="text-xs text-muted-foreground mt-1">Tap + to record your first study session</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalPage;
