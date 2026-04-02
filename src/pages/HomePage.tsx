import { Flame, Target, TrendingUp, Sparkles, Calendar } from "lucide-react";
import StudyTimer from "@/components/StudyTimer";

const todayPlan = [
  { time: "6:00–7:00", subject: "Quant Practice", done: true },
  { time: "7:30–8:30", subject: "Reasoning Practice", done: false },
  { time: "8:30–9:00", subject: "Break", done: false },
  { time: "9:00–10:00", subject: "English Revision", done: false },
];

const moodLog = [
  { session: "Session 1 — Quant", mood: "Focused", emoji: "🎯" },
  { session: "Session 2 — Reasoning", mood: "Stressed", emoji: "😰" },
];

const HomePage = () => {
  return (
    <div className="space-y-5 pb-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Good Morning 👋</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Let's crush today's goals</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-2xl shadow-card p-3.5 text-center">
          <Flame className="text-primary mx-auto mb-1" size={22} />
          <p className="text-xl font-bold text-foreground">12</p>
          <p className="text-[11px] text-muted-foreground font-medium">Day Streak</p>
        </div>
        <div className="bg-card rounded-2xl shadow-card p-3.5 text-center">
          <Target className="text-primary mx-auto mb-1" size={22} />
          <p className="text-xl font-bold text-foreground">87%</p>
          <p className="text-[11px] text-muted-foreground font-medium">Discipline</p>
        </div>
        <div className="bg-card rounded-2xl shadow-card p-3.5 text-center">
          <TrendingUp className="text-success mx-auto mb-1" size={22} />
          <p className="text-xl font-bold text-foreground">2.5h</p>
          <p className="text-[11px] text-muted-foreground font-medium">Today</p>
        </div>
      </div>

      {/* Study Timer */}
      <StudyTimer />

      {/* Today's Plan */}
      <div className="bg-card rounded-2xl shadow-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={18} className="text-primary" />
          <h3 className="font-semibold text-foreground">Today's Plan</h3>
          <span className="ml-auto text-xs text-muted-foreground font-medium">1/4 done</span>
        </div>
        <div className="space-y-2.5">
          {todayPlan.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                item.done ? "bg-success/10" : "bg-accent"
              }`}
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.done ? "bg-success" : "bg-primary"}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${item.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {item.subject}
                </p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
              {item.done && (
                <span className="text-xs font-medium text-success">Done</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Suggestion */}
      <div className="gradient-primary rounded-2xl p-5 shadow-orange">
        <div className="flex items-start gap-3">
          <Sparkles className="text-primary-foreground flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-semibold text-primary-foreground text-sm">AI Suggestion</h4>
            <p className="text-primary-foreground/90 text-sm mt-1 leading-relaxed">
              You studied only 2 hrs yesterday. Your target is 4 hrs. Let's restart with a lighter session today.
            </p>
          </div>
        </div>
      </div>

      {/* Mood Log */}
      <div className="bg-card rounded-2xl shadow-card p-5">
        <h3 className="font-semibold text-foreground mb-3">Today's Mood Log</h3>
        <div className="space-y-2">
          {moodLog.map((m, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-accent rounded-xl">
              <span className="text-sm text-foreground font-medium">{m.session}</span>
              <span className="text-sm">
                {m.emoji} {m.mood}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Overall Day Mood → <span className="font-semibold text-foreground">Mixed</span>
        </p>
      </div>

      {/* Weekly Mentor Card */}
      <div className="bg-card rounded-2xl shadow-card p-5 border-l-4 border-primary">
        <h4 className="font-bold text-foreground">Weekly Mentor Review</h4>
        <p className="text-sm text-muted-foreground mt-1">Ready to start your session</p>
        <button className="gradient-primary text-primary-foreground font-semibold text-sm py-2.5 px-5 rounded-xl mt-3 shadow-orange active:scale-95 transition-transform">
          Start Meeting
        </button>
      </div>
    </div>
  );
};

export default HomePage;
