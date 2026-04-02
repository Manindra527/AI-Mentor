import { useState } from "react";
import { Camera, Send, MessageSquare, Clock } from "lucide-react";

const pastDoubts = [
  {
    question: "How to solve percentage increase/decrease problems?",
    subject: "Quant",
    answer: "Use the formula: Change% = (New - Old) / Old × 100. For successive changes, use the net effect formula.",
    time: "2 hrs ago",
  },
  {
    question: "What is the difference between syllogism and logical reasoning?",
    subject: "Reasoning",
    answer: "Syllogism involves deductive reasoning from two premises to a conclusion. Logical reasoning is broader and includes puzzles, coding-decoding, etc.",
    time: "Yesterday",
  },
];

const DoubtsPage = () => {
  const [question, setQuestion] = useState("");

  return (
    <div className="space-y-5 pb-4">
      <h1 className="text-2xl font-bold text-foreground">Doubts</h1>
      <p className="text-sm text-muted-foreground -mt-3">Get instant solutions to your study questions</p>

      {/* Input Area */}
      <div className="bg-card rounded-2xl shadow-card p-5">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full bg-accent border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none h-24"
          placeholder="Type your question here..."
        />
        <div className="flex gap-2 mt-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-accent-foreground border border-border font-medium text-sm hover:border-primary transition-colors active:scale-95">
            <Camera size={18} /> Scan Question
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm shadow-orange active:scale-95 transition-transform">
            <Send size={18} /> Ask AI
          </button>
        </div>
      </div>

      {/* Past Doubts */}
      <div>
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <MessageSquare size={16} className="text-primary" />
          Recent Doubts
        </h3>
        <div className="space-y-3">
          {pastDoubts.map((d, i) => (
            <div key={i} className="bg-card rounded-2xl shadow-card p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium gradient-primary text-primary-foreground px-2 py-0.5 rounded-md">{d.subject}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock size={10} /> {d.time}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground mb-2">{d.question}</p>
              <div className="bg-accent rounded-xl p-3">
                <p className="text-xs font-medium text-primary mb-1">AI Solution</p>
                <p className="text-sm text-foreground leading-relaxed">{d.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoubtsPage;
