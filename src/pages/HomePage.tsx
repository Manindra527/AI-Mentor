import { Flame, Target, TrendingUp, Sparkles, Calendar } from "lucide-react";
import StudyTimer from "@/components/StudyTimer";
import { useState } from "react";

interface PlanItem {
  time: string;
  subject: string;
  done: boolean;
}

interface MoodEntry {
  session: string;
  mood: string;
  emoji: string;
}

const HomePage = () => {
  const [todayPlan] = useState<PlanItem[]>([]);
  const [moodLog] = useState<MoodEntry[]>([]);
  const [streak] = useState(0);
  const [discipline] = useState(0);
  const [todayHours] = useState(0);

  const doneCount = todayPlan.filter((i) => i.done).length;

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
          <p className="text-xl font-bold text-foreground">{streak}</p>
          <p className="text-[11px] text-muted-foreground font-medium">Day Streak</p>
        </div>
        <div className="bg-card rounded-2xl shadow-card p-3.5 text-center">
          <Target className="text-primary mx-auto mb-1" size={22} />
          <p className="text-xl font-bold text-foreground">{discipline}%</p>
          <p className="text-[11px] text-muted-foreground font-medium">Discipline</p>
        </div>
        <div className="bg-card rounded-2xl shadow-card p-3.5 text-center">
          <TrendingUp className="text-success mx-auto mb-1" size={22} />
          <p className="text-xl font-bold text-foreground">{todayHours}h</p>
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
          <span className="ml-auto text-xs text-muted-foreground font-medium">
            {todayPlan.length > 0 ? `${doneCount}/${todayPlan.length} done` : ""}
          </span>
        </div>
        {todayPlan.length > 0 ? (
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
        ) : (
          <div className="py-6 text-center">
            <p className="text-sm text-muted-foreground">No plan set for today</p>
            <p className="text-xs text-muted-foreground mt-1">Add sessions in the Planner tab</p>
          </div>
        )}
      </div>

      {/* AI Suggestion */}
      <div className="gradient-primary rounded-2xl p-5 shadow-orange">
        <div className="flex items-start gap-3">
          <Sparkles className="text-primary-foreground flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-semibold text-primary-foreground text-sm">AI Suggestion</h4>
            <p className="text-primary-foreground/90 text-sm mt-1 leading-relaxed">
              Start by setting up your study plan and tracking your first session. Your AI mentor will give personalized tips once you begin.
            </p>
          </div>
        </div>
      </div>

      {/* Mood Log */}
      <div className="bg-card rounded-2xl shadow-card p-5">
        <h3 className="font-semibold text-foreground mb-3">Today's Mood Log</h3>
        {moodLog.length > 0 ? (
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
        ) : (
          <div className="py-4 text-center">
            <p className="text-sm text-muted-foreground">No mood entries yet</p>
            <p className="text-xs text-muted-foreground mt-1">Complete a study session to log your mood</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
