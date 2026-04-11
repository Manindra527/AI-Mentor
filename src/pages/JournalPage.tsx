import { useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import {
  MOOD_EMOJIS,
  SESSION_TYPE_COLORS,
  SESSION_TYPE_LABELS,
  type JournalEntry,
  type Mood,
  type StressReason,
  type SessionType,
} from "@/lib/store";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppData } from "@/components/AppDataProvider";
import { getTodayDateKey } from "@/lib/time";
import { toast } from "sonner";

const MOODS: Mood[] = ["focused", "distracted", "tired", "motivated", "frustrated", "stressed"];

const STRESS_REASONS: { value: StressReason; label: string }[] = [
  { value: "topic-difficult", label: "Topic difficult" },
  { value: "too-many-questions", label: "Too many questions" },
  { value: "time-pressure", label: "Time pressure" },
  { value: "didnt-understand", label: "Didn't understand concept" },
  { value: "personal-distraction", label: "Personal distraction" },
];

const formatStressReason = (value?: string) =>
  value
    ?.split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatMoodLabel = (mood: Mood) => mood.charAt(0).toUpperCase() + mood.slice(1);

const JournalPage = () => {
  const { journalEntries, addJournalEntry } = useAppData();
  const [showNew, setShowNew] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType>("concept");
  const [mood, setMood] = useState<Mood | null>(null);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("60");
  const [questionsAttempted, setQuestionsAttempted] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState("");
  const [hardness, setHardness] = useState<JournalEntry["hardness"] | null>(null);
  const [mistakes, setMistakes] = useState("");
  const [notes, setNotes] = useState("");
  const [stressReason, setStressReason] = useState<StressReason | null>(null);

  const todayDate = getTodayDateKey();
  const entries = journalEntries.filter((entry) => entry.date === todayDate);

  const resetForm = () => {
    setSessionType("concept");
    setMood(null);
    setSubject("");
    setTopic("");
    setDuration("60");
    setQuestionsAttempted("");
    setCorrectAnswers("");
    setHardness(null);
    setMistakes("");
    setNotes("");
    setStressReason(null);
  };

  const handleSave = async () => {
    if (!subject.trim() || !topic.trim() || !mood) {
      toast.error("Please add subject, topic, and mood.");
      return;
    }

    const nextEntry: JournalEntry = {
      id: crypto.randomUUID(),
      date: todayDate,
      sessionType,
      subject: subject.trim(),
      topic: topic.trim(),
      duration: Math.max(15, Number(duration) || 60),
      mood,
      stressReason: mood === "stressed" ? stressReason ?? undefined : undefined,
      notes: notes.trim() || undefined,
      questionsAttempted: questionsAttempted ? Number(questionsAttempted) : undefined,
      correctAnswers: correctAnswers ? Number(correctAnswers) : undefined,
      hardness: hardness ?? undefined,
      mistakes: mistakes.trim() || undefined,
    };

    const saved = await addJournalEntry(nextEntry);
    if (!saved) {
      return;
    }

    resetForm();
    setShowNew(false);
    toast.success("Journal entry saved.");
  };

  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="sticky top-0 z-10 bg-background pb-4 flex items-center justify-between flex-shrink-0">
        <h1 className="text-2xl font-bold text-foreground">Daily Journal</h1>
      </div>

      <Dialog
        open={showNew}
        onOpenChange={(open) => {
          setShowNew(open);
          if (!open) {
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-sm rounded-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Journal Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-2">Session Type</label>
              <div className="flex flex-wrap gap-2">
                {(Object.entries(SESSION_TYPE_LABELS) as [SessionType, string][]).map(([type, label]) => (
                  <button
                    key={type}
                    onClick={() => setSessionType(type)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                      type === sessionType ? "gradient-primary text-white" : SESSION_TYPE_COLORS[type],
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Subject</label>
              <Input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="e.g., Quantitative Aptitude" className="rounded-xl" />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Topic</label>
              <Input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="e.g., Permutations" className="rounded-xl" />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Duration (minutes)</label>
              <Input type="number" value={duration} onChange={(event) => setDuration(event.target.value)} placeholder="60" className="rounded-xl" />
            </div>

            {(sessionType === "practice" || sessionType === "mock") && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">Questions</label>
                    <Input type="number" value={questionsAttempted} onChange={(event) => setQuestionsAttempted(event.target.value)} placeholder="30" className="rounded-xl" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">Correct</label>
                    <Input type="number" value={correctAnswers} onChange={(event) => setCorrectAnswers(event.target.value)} placeholder="24" className="rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">Difficulty</label>
                  <div className="flex gap-2">
                    {(["easy", "medium", "hard", "mixed"] as const).map((item) => (
                      <button
                        key={item}
                        onClick={() => setHardness(item)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize",
                          hardness === item ? "gradient-primary text-white" : "bg-accent text-accent-foreground hover:bg-primary/10",
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Key Mistakes</label>
                  <Textarea value={mistakes} onChange={(event) => setMistakes(event.target.value)} placeholder="What went wrong?" className="rounded-xl" rows={2} />
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Notes</label>
              <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Any observations..." className="rounded-xl" rows={2} />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-2">How did you feel?</label>
              <div className="grid grid-cols-3 gap-2">
                {MOODS.map((item) => (
                  <button
                    key={item}
                    onClick={() => setMood(item)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 rounded-xl text-xs font-medium transition-all",
                      mood === item ? "gradient-primary text-white shadow-lg" : "bg-accent text-accent-foreground",
                    )}
                  >
                    <span className="text-lg">{MOOD_EMOJIS[item]}</span>
                    <span className="capitalize">{formatMoodLabel(item)}</span>
                  </button>
                ))}
              </div>
            </div>

            {mood === "stressed" && (
              <div>
                <label className="text-xs font-semibold text-destructive block mb-2">What caused the stress?</label>
                <div className="space-y-2">
                  {STRESS_REASONS.map((reason) => (
                    <button
                      key={reason.value}
                      onClick={() => setStressReason(reason.value)}
                      className={cn(
                        "w-full rounded-xl p-3 text-xs font-medium text-left transition-colors",
                        stressReason === reason.value
                          ? "bg-destructive text-destructive-foreground"
                          : "bg-destructive/5 text-destructive hover:bg-destructive/10",
                      )}
                    >
                      {reason.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleSave} className="w-full gradient-primary text-white rounded-xl p-3 font-semibold text-sm">
              Save Entry
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar pb-28">
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <BookOpen size={16} className="text-primary" />
            Today&apos;s Entries
          </h3>
          <div className="space-y-3">
            {entries.length > 0 ? (
              entries.map((entry) => (
                <div key={entry.id} className="bg-card rounded-2xl shadow-card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">
                        {entry.subject} - {entry.topic}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {entry.duration} min · {SESSION_TYPE_LABELS[entry.sessionType]}
                      </p>
                    </div>
                    <span className="text-sm">{MOOD_EMOJIS[entry.mood]}</span>
                  </div>
                  {entry.questionsAttempted && entry.correctAnswers !== undefined && (
                    <div className="flex gap-4 mt-3 text-xs">
                      <span className="text-muted-foreground">
                        Attempted: <span className="font-semibold text-foreground">{entry.questionsAttempted}</span>
                      </span>
                      <span className="text-muted-foreground">
                        Correct: <span className="font-semibold text-success">{entry.correctAnswers}</span>
                      </span>
                      <span className="text-muted-foreground">
                        Accuracy: <span className="font-semibold text-primary">{Math.round((entry.correctAnswers / entry.questionsAttempted) * 100)}%</span>
                      </span>
                    </div>
                  )}
                  {entry.stressReason && (
                    <p className="text-xs text-destructive mt-2">Stress reason: {formatStressReason(entry.stressReason)}</p>
                  )}
                  {entry.notes && (
                    <p className="text-xs text-muted-foreground mt-2 italic">"{entry.notes}"</p>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-card rounded-2xl shadow-card p-6 text-sm text-muted-foreground">
                No journal entries for today yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowNew(true)}
        className="fixed bottom-24 right-5 w-14 h-14 gradient-primary text-primary-foreground rounded-full shadow-orange flex items-center justify-center active:scale-90 transition-transform z-30"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default JournalPage;
