import { useState } from "react";
import { Send, ArrowRight, CheckCircle2 } from "lucide-react";

const mentorMessages = [
  { from: "mentor", text: "Good morning. You have 3 study sessions planned today. Start with Quant Practice at 6:00." },
  { from: "mentor", text: "I noticed your reasoning practice improved this week. But puzzle accuracy is still low. Let's discuss a plan." },
  { from: "user", text: "How should I improve puzzles?" },
  { from: "mentor", text: "Your reasoning accuracy dropped from 75% to 62% this week. Let's practice puzzles for 5 days straight focusing on pattern recognition. Start with easier puzzles and build up." },
];

const weeklySteps = [
  {
    title: "Weekly Performance Report",
    content: {
      studyHours: 23,
      completion: 78,
      weakSubject: "Reasoning",
      strongSubject: "English",
    },
  },
  {
    title: "Mental Check",
    question: "How did you feel about this week's preparation?",
    options: ["Great — on track", "Okay — some struggles", "Tough — need help", "Overwhelmed"],
  },
  {
    title: "Problem Identification",
    question: "You skipped 2 sessions this week. Was it due to:",
    options: ["Time constraints", "Topic difficulty", "Lack of motivation", "Personal reasons"],
  },
  {
    title: "Next Week Strategy",
    content: "Based on your performance, I suggest: Increase Reasoning practice by 30 mins daily. Add 2 revision sessions for Puzzles. Keep English maintenance at current level.",
  },
];

const MentorPage = () => {
  const [view, setView] = useState<"chat" | "weekly" | "monthly">("chat");
  const [weeklyStep, setWeeklyStep] = useState(0);
  const [monthlyStep, setMonthlyStep] = useState(0);

  if (view === "weekly") {
    const step = weeklySteps[weeklyStep];
    return (
      <div className="space-y-5 pb-4">
        <div className="flex items-center justify-between">
          <button onClick={() => { setView("chat"); setWeeklyStep(0); }} className="text-sm text-primary font-semibold">← Back</button>
          <h2 className="font-bold text-foreground">Weekly Mentor Session</h2>
          <span className="text-xs text-muted-foreground">{weeklyStep + 1}/4</span>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-1.5">
          {weeklySteps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= weeklyStep ? "gradient-primary" : "bg-border"}`} />
          ))}
        </div>

        <div className="bg-card rounded-2xl shadow-card-lg p-6 animate-fade-in-up">
          <h3 className="font-bold text-lg text-foreground mb-4">Step {weeklyStep + 1}: {step.title}</h3>

          {step.content && typeof step.content === "object" && "studyHours" in step.content && (
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-accent rounded-xl">
                <span className="text-sm text-muted-foreground">Study Hours</span>
                <span className="font-bold text-foreground">{step.content.studyHours}h</span>
              </div>
              <div className="flex justify-between p-3 bg-accent rounded-xl">
                <span className="text-sm text-muted-foreground">Planner Completion</span>
                <span className="font-bold text-primary">{step.content.completion}%</span>
              </div>
              <div className="flex justify-between p-3 bg-accent rounded-xl">
                <span className="text-sm text-muted-foreground">Weak Subject</span>
                <span className="font-bold text-destructive">{step.content.weakSubject}</span>
              </div>
              <div className="flex justify-between p-3 bg-accent rounded-xl">
                <span className="text-sm text-muted-foreground">Strong Subject</span>
                <span className="font-bold text-success">{step.content.strongSubject}</span>
              </div>
            </div>
          )}

          {step.question && (
            <div>
              <p className="text-sm text-foreground mb-3">{step.question}</p>
              <div className="space-y-2">
                {step.options?.map((opt, i) => (
                  <button key={i} className="w-full text-left p-3 rounded-xl bg-accent text-sm text-foreground border border-border hover:border-primary transition-colors active:scale-[0.98]">
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step.content && typeof step.content === "string" && (
            <div>
              <p className="text-sm text-foreground leading-relaxed">{step.content}</p>
              <div className="flex items-center gap-2 mt-4 p-3 bg-success/10 rounded-xl">
                <CheckCircle2 size={16} className="text-success" />
                <span className="text-sm font-medium text-success">Strategy updated for next week</span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => weeklyStep < 3 ? setWeeklyStep(weeklyStep + 1) : setView("chat")}
          className="w-full gradient-primary text-primary-foreground font-semibold py-3 rounded-xl shadow-orange active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          {weeklyStep < 3 ? (
            <>Next Step <ArrowRight size={16} /></>
          ) : (
            "Complete Session"
          )}
        </button>
      </div>
    );
  }

  if (view === "monthly") {
    return (
      <div className="space-y-5 pb-4">
        <div className="flex items-center justify-between">
          <button onClick={() => { setView("chat"); setMonthlyStep(0); }} className="text-sm text-primary font-semibold">← Back</button>
          <h2 className="font-bold text-foreground">Monthly Mentor Review</h2>
          <span className="text-xs text-muted-foreground">{monthlyStep + 1}/4</span>
        </div>

        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= monthlyStep ? "gradient-primary" : "bg-border"}`} />
          ))}
        </div>

        <div className="bg-card rounded-2xl shadow-card-lg p-6 animate-fade-in-up">
          {monthlyStep === 0 && (
            <div>
              <h3 className="font-bold text-lg text-foreground mb-4">Monthly Performance Report</h3>
              <div className="space-y-3">
                {[
                  { label: "Total Study Hours", value: "92h", color: "text-foreground" },
                  { label: "Planner Completion", value: "84%", color: "text-primary" },
                  { label: "Mock Test Trend", value: "↑ Improving", color: "text-success" },
                  { label: "Weak Subject", value: "Reasoning", color: "text-destructive" },
                  { label: "Strong Subject", value: "English", color: "text-success" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between p-3 bg-accent rounded-xl">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className={`font-bold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {monthlyStep === 1 && (
            <div>
              <h3 className="font-bold text-lg text-foreground mb-4">Consistency Analysis</h3>
              <div className="space-y-3">
                <div className="p-3 bg-success/10 rounded-xl">
                  <p className="text-sm font-medium text-success">Best Study Week: Week 2 (28h)</p>
                </div>
                <div className="p-3 bg-destructive/10 rounded-xl">
                  <p className="text-sm font-medium text-destructive">Worst Study Week: Week 4 (18h)</p>
                </div>
                <div className="p-3 bg-accent rounded-xl">
                  <p className="text-sm text-foreground">Missed days: 3 (Travel, Personal)</p>
                </div>
              </div>
            </div>
          )}
          {monthlyStep === 2 && (
            <div>
              <h3 className="font-bold text-lg text-foreground mb-4">Strategy Adjustment</h3>
              <div className="space-y-3">
                {["Increase mock frequency to 2x per week", "Add revision sessions for weak topics", "Reduce weak-topic gaps between practice"].map((s, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-accent rounded-xl">
                    <ArrowRight size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {monthlyStep === 3 && (
            <div>
              <h3 className="font-bold text-lg text-foreground mb-4">Exam Readiness</h3>
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-4 border-primary mb-3">
                  <span className="text-3xl font-bold text-primary">63%</span>
                </div>
                <p className="text-sm text-foreground font-medium">You are on track</p>
                <p className="text-xs text-muted-foreground mt-1">But need more mock practice to improve</p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => monthlyStep < 3 ? setMonthlyStep(monthlyStep + 1) : setView("chat")}
          className="w-full gradient-primary text-primary-foreground font-semibold py-3 rounded-xl shadow-orange active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          {monthlyStep < 3 ? <>Next Step <ArrowRight size={16} /></> : "Complete Review"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-foreground">AI Mentor</h1>
      </div>

      {/* Session Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView("weekly")}
          className="flex-1 py-2.5 rounded-xl text-xs font-semibold gradient-primary text-primary-foreground shadow-orange active:scale-95 transition-transform"
        >
          Weekly Session
        </button>
        <button
          onClick={() => setView("monthly")}
          className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-card text-foreground border border-border hover:border-primary active:scale-95 transition-all"
        >
          Monthly Review
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 hide-scrollbar">
        {mentorMessages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                msg.from === "user"
                  ? "gradient-primary text-primary-foreground rounded-br-md"
                  : "bg-card shadow-card text-foreground rounded-bl-md"
              }`}
            >
              {msg.from === "mentor" && (
                <p className="text-xs font-semibold text-primary mb-1">Mentor</p>
              )}
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Ask your mentor..."
        />
        <button className="gradient-primary text-primary-foreground p-3 rounded-xl shadow-orange active:scale-95 transition-transform">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default MentorPage;
