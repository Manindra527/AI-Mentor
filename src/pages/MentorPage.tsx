import { useState } from "react";
import { Send, ArrowRight, CheckCircle2 } from "lucide-react";

interface Message {
  from: "mentor" | "user";
  text: string;
}

const weeklySteps = [
  {
    title: "Weekly Performance Report",
    emptyMessage: "Complete at least one week of study sessions to generate your performance report.",
  },
  {
    title: "Mental Check",
    question: "How did you feel about this week's preparation?",
    options: ["Great — on track", "Okay — some struggles", "Tough — need help", "Overwhelmed"],
  },
  {
    title: "Problem Identification",
    question: "What was your biggest challenge this week?",
    options: ["Time constraints", "Topic difficulty", "Lack of motivation", "Personal reasons"],
  },
  {
    title: "Next Week Strategy",
    emptyMessage: "Your personalized strategy will appear here after completing the review steps above.",
  },
];

const MentorPage = () => {
  const [view, setView] = useState<"chat" | "weekly" | "monthly">("chat");
  const [weeklyStep, setWeeklyStep] = useState(0);
  const [monthlyStep, setMonthlyStep] = useState(0);
  const [messages] = useState<Message[]>([
    { from: "mentor", text: "Welcome! I'm your AI study mentor. Start a study session and I'll help you stay on track with personalized coaching." },
  ]);

  if (view === "weekly") {
    const step = weeklySteps[weeklyStep];
    return (
      <div className="space-y-5 pb-4">
        <div className="flex items-center justify-between">
          <button onClick={() => { setView("chat"); setWeeklyStep(0); }} className="text-sm text-primary font-semibold">← Back</button>
          <h2 className="font-bold text-foreground">Weekly Mentor Session</h2>
          <span className="text-xs text-muted-foreground">{weeklyStep + 1}/4</span>
        </div>

        <div className="flex gap-1.5">
          {weeklySteps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= weeklyStep ? "gradient-primary" : "bg-border"}`} />
          ))}
        </div>

        <div className="bg-card rounded-2xl shadow-card-lg p-6 animate-fade-in-up">
          <h3 className="font-bold text-lg text-foreground mb-4">Step {weeklyStep + 1}: {step.title}</h3>

          {step.emptyMessage && (
            <div className="py-6 text-center">
              <p className="text-sm text-muted-foreground leading-relaxed">{step.emptyMessage}</p>
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
        </div>

        <button
          onClick={() => weeklyStep < 3 ? setWeeklyStep(weeklyStep + 1) : setView("chat")}
          className="w-full gradient-primary text-primary-foreground font-semibold py-3 rounded-xl shadow-orange active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          {weeklyStep < 3 ? <>Next Step <ArrowRight size={16} /></> : "Complete Session"}
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
            <div className="py-6 text-center">
              <h3 className="font-bold text-lg text-foreground mb-3">Monthly Performance Report</h3>
              <p className="text-sm text-muted-foreground">Complete at least one month of study sessions to see your monthly report.</p>
            </div>
          )}
          {monthlyStep === 1 && (
            <div className="py-6 text-center">
              <h3 className="font-bold text-lg text-foreground mb-3">Consistency Analysis</h3>
              <p className="text-sm text-muted-foreground">Your consistency data will appear here once you have enough study history.</p>
            </div>
          )}
          {monthlyStep === 2 && (
            <div className="py-6 text-center">
              <h3 className="font-bold text-lg text-foreground mb-3">Strategy Adjustment</h3>
              <p className="text-sm text-muted-foreground">Strategy suggestions will be generated based on your study patterns.</p>
            </div>
          )}
          {monthlyStep === 3 && (
            <div className="py-6 text-center">
              <h3 className="font-bold text-lg text-foreground mb-3">Exam Readiness</h3>
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-4 border-border mb-3">
                <span className="text-3xl font-bold text-muted-foreground">—</span>
              </div>
              <p className="text-sm text-muted-foreground">Take mock tests to see your exam readiness score.</p>
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

      <div className="flex-1 overflow-y-auto space-y-3 hide-scrollbar">
        {messages.map((msg, i) => (
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
