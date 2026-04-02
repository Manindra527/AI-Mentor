import { useState } from "react";
import { BarChart3, TrendingUp, Award, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from "recharts";

type TimeFrame = "daily" | "weekly" | "monthly";

const ProgressPage = () => {
  const [tab, setTab] = useState<TimeFrame>("weekly");
  const [studyData] = useState<{ day: string; hours: number }[]>([]);
  const [mockScores] = useState<{ test: string; score: number }[]>([]);
  const [moodData] = useState<Record<string, number>>({});

  const hasStudyData = studyData.length > 0;
  const hasMockData = mockScores.length > 0;
  const hasMoodData = Object.keys(moodData).length > 0;

  return (
    <div className="space-y-5 pb-4">
      <h1 className="text-2xl font-bold text-foreground">Progress</h1>

      <div className="flex gap-1 bg-accent p-1 rounded-xl">
        {(["daily", "weekly", "monthly"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors capitalize ${
              tab === t ? "gradient-primary text-primary-foreground shadow-orange" : "text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card rounded-2xl shadow-card p-4">
          <TrendingUp size={18} className="text-primary mb-1" />
          <p className="text-2xl font-bold text-foreground">0h</p>
          <p className="text-xs text-muted-foreground font-medium">Study Hours</p>
        </div>
        <div className="bg-card rounded-2xl shadow-card p-4">
          <Target size={18} className="text-primary mb-1" />
          <p className="text-2xl font-bold text-foreground">0%</p>
          <p className="text-xs text-muted-foreground font-medium">Planner Completion</p>
        </div>
        <div className="bg-card rounded-2xl shadow-card p-4">
          <Award size={18} className="text-success mb-1" />
          <p className="text-2xl font-bold text-foreground">0</p>
          <p className="text-xs text-muted-foreground font-medium">Day Streak</p>
        </div>
        <div className="bg-card rounded-2xl shadow-card p-4">
          <BarChart3 size={18} className="text-warning mb-1" />
          <p className="text-2xl font-bold text-foreground">0%</p>
          <p className="text-xs text-muted-foreground font-medium">Consistency</p>
        </div>
      </div>

      {/* Study Hours Chart */}
      <div className="bg-card rounded-2xl shadow-card p-5">
        <h3 className="font-semibold text-foreground mb-4">Study Hours</h3>
        {hasStudyData ? (
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(20 8% 50%)" }} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "var(--shadow-md)", fontSize: "12px" }} />
                <Bar dataKey="hours" fill="hsl(24 95% 53%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No study data yet</p>
            <p className="text-xs text-muted-foreground mt-1">Start studying to see your progress chart</p>
          </div>
        )}
      </div>

      {/* Mock Score Trend */}
      <div className="bg-card rounded-2xl shadow-card p-5">
        <h3 className="font-semibold text-foreground mb-4">Mock Test Improvement</h3>
        {hasMockData ? (
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockScores}>
                <XAxis dataKey="test" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(20 8% 50%)" }} />
                <YAxis hide domain={[50, 100]} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "var(--shadow-md)", fontSize: "12px" }} />
                <Line type="monotone" dataKey="score" stroke="hsl(142 70% 45%)" strokeWidth={2.5} dot={{ fill: "hsl(142 70% 45%)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No mock tests taken yet</p>
            <p className="text-xs text-muted-foreground mt-1">Take a mock test to track your improvement</p>
          </div>
        )}
      </div>

      {/* Weak/Strong Subjects */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card rounded-2xl shadow-card p-4">
          <p className="text-xs font-semibold text-destructive mb-2">Weak Subject</p>
          <p className="font-bold text-muted-foreground">—</p>
          <p className="text-xs text-muted-foreground mt-1">Not enough data</p>
        </div>
        <div className="bg-card rounded-2xl shadow-card p-4">
          <p className="text-xs font-semibold text-success mb-2">Strong Subject</p>
          <p className="font-bold text-muted-foreground">—</p>
          <p className="text-xs text-muted-foreground mt-1">Not enough data</p>
        </div>
      </div>

      {/* Mood Trend */}
      <div className="bg-card rounded-2xl shadow-card p-5">
        <h3 className="font-semibold text-foreground mb-3">Mood Analysis</h3>
        {hasMoodData ? (
          <div className="space-y-2">
            {Object.entries(moodData).map(([mood, count]) => (
              <div key={mood} className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground w-20">{mood}</span>
                <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
                  <div className="h-full rounded-full gradient-primary" style={{ width: `${(count / 12) * 100}%` }} />
                </div>
                <span className="text-xs font-semibold text-foreground w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-sm text-muted-foreground">No mood data yet</p>
            <p className="text-xs text-muted-foreground mt-1">Log moods in your journal to see trends</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;
