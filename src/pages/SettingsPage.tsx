import { useState, type ReactNode } from "react";
import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MoonStar,
  UserCircle2,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "next-themes";

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MENTOR_TIMES = ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];
const MONTHLY_REVIEW_OPTIONS = [
  { value: "1", label: "Day 1" },
  { value: "15", label: "Day 15" },
  { value: "Last", label: "Last Day" },
] as const;

type SettingsView = "menu" | "profile" | "theme" | "weekStart" | "mentorMeeting" | "monthlyReview" | "notifications";

interface SettingsPageProps {
  onBack: () => void;
}

interface SettingsItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
  onClick: () => void;
}

const SettingsItem = ({ icon: Icon, label, value, onClick }: SettingsItemProps) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card shadow-card text-left transition-colors hover:bg-accent"
  >
    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
      <Icon size={18} className="text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground truncate">{value}</p>
    </div>
    <ChevronRight size={18} className="text-muted-foreground" />
  </button>
);

const Toggle = ({
  label,
  description,
  value,
  onToggle,
}: {
  label: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}) => (
  <div className="flex items-center justify-between p-4 bg-card rounded-2xl shadow-card">
    <div className="pr-3">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
    <button
      type="button"
      onClick={onToggle}
      className={`w-12 h-7 rounded-full transition-colors relative ${value ? "bg-primary" : "bg-border"}`}
      aria-pressed={value}
    >
      <div
        className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
          value ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

const DetailLayout = ({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack: () => void;
  children: ReactNode;
}) => (
  <div className="space-y-5 pb-4">
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onBack}
        className="w-9 h-9 rounded-full bg-card shadow-card flex items-center justify-center text-foreground"
        aria-label={`Back to settings from ${title}`}
      >
        <ChevronLeft size={18} />
      </button>
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
    </div>
    {children}
  </div>
);

const SettingsPage = ({ onBack }: SettingsPageProps) => {
  const { theme, setTheme } = useTheme();
  const [view, setView] = useState<SettingsView>("menu");
  const [profileName, setProfileName] = useState("Study Warrior");
  const [targetExam, setTargetExam] = useState("UPSC CSE");
  const [dailyHoursGoal, setDailyHoursGoal] = useState("6");
  const [weekStart, setWeekStart] = useState("Monday");
  const [mentorDay, setMentorDay] = useState("Sunday");
  const [mentorTime, setMentorTime] = useState("9:00 AM");
  const [monthlyReviewDay, setMonthlyReviewDay] = useState("1");
  const [dailyReminder, setDailyReminder] = useState(true);
  const [sessionReminder, setSessionReminder] = useState(true);
  const [mentorReminder, setMentorReminder] = useState(true);
  const [streakReminder, setStreakReminder] = useState(false);

  const monthlyReviewLabel =
    MONTHLY_REVIEW_OPTIONS.find((option) => option.value === monthlyReviewDay)?.label ?? "Day 1";
  const themeLabel = theme === "dark" ? "Dark" : "Light";

  if (view === "profile") {
    return (
      <DetailLayout title="Profile" onBack={() => setView("menu")}>
        <div className="bg-card rounded-2xl shadow-card p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Display Name</label>
            <input
              value={profileName}
              onChange={(event) => setProfileName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Target Exam</label>
            <input
              value={targetExam}
              onChange={(event) => setTargetExam(event.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
              placeholder="NEET, JEE, UPSC..."
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Daily Study Goal (hours)</label>
            <input
              value={dailyHoursGoal}
              onChange={(event) => setDailyHoursGoal(event.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
              placeholder="6"
            />
          </div>
        </div>
      </DetailLayout>
    );
  }

  if (view === "theme") {
    return (
      <DetailLayout title="Theme" onBack={() => setView("menu")}>
        <div className="bg-card rounded-2xl shadow-card p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Choose Theme</label>
            <select
              value={themeLabel}
              onChange={(event) => setTheme(event.target.value.toLowerCase())}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
            </select>
          </div>
        </div>
      </DetailLayout>
    );
  }

  if (view === "weekStart") {
    return (
      <DetailLayout title="Week Start" onBack={() => setView("menu")}>
        <div className="bg-card rounded-2xl shadow-card p-5">
          <p className="text-sm text-muted-foreground mb-4">Choose which day starts your study week.</p>
          <div className="grid grid-cols-2 gap-2">
            {WEEK_DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setWeekStart(day)}
                className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  weekStart === day
                    ? "gradient-primary text-primary-foreground shadow-orange"
                    : "bg-accent text-accent-foreground border border-border hover:border-primary"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </DetailLayout>
    );
  }

  if (view === "mentorMeeting") {
    return (
      <DetailLayout title="Weekly Meeting" onBack={() => setView("menu")}>
        <div className="space-y-4">
          <div className="bg-card rounded-2xl shadow-card p-5">
            <p className="text-sm font-semibold text-foreground mb-3">Meeting Day</p>
            <div className="grid grid-cols-2 gap-2">
              {WEEK_DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setMentorDay(day)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    mentorDay === day
                      ? "gradient-primary text-primary-foreground shadow-orange"
                      : "bg-accent text-accent-foreground border border-border hover:border-primary"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-card p-5">
            <p className="text-sm font-semibold text-foreground mb-3">Preferred Time</p>
            <div className="grid grid-cols-2 gap-2">
              {MENTOR_TIMES.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setMentorTime(time)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    mentorTime === time
                      ? "gradient-primary text-primary-foreground shadow-orange"
                      : "bg-accent text-accent-foreground border border-border hover:border-primary"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </DetailLayout>
    );
  }

  if (view === "monthlyReview") {
    return (
      <DetailLayout title="Monthly Review" onBack={() => setView("menu")}>
        <div className="bg-card rounded-2xl shadow-card p-5">
          <p className="text-sm text-muted-foreground mb-4">Pick when your monthly review should happen.</p>
          <div className="space-y-2">
            {MONTHLY_REVIEW_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMonthlyReviewDay(option.value)}
                className={`w-full py-3 rounded-xl text-sm font-medium transition-colors ${
                  monthlyReviewDay === option.value
                    ? "gradient-primary text-primary-foreground shadow-orange"
                    : "bg-accent text-accent-foreground border border-border hover:border-primary"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </DetailLayout>
    );
  }

  if (view === "notifications") {
    return (
      <DetailLayout title="Notifications" onBack={() => setView("menu")}>
        <div className="space-y-3">
          <Toggle
            label="Daily study reminder"
            description="Get reminded to start your daily plan."
            value={dailyReminder}
            onToggle={() => setDailyReminder((value) => !value)}
          />
          <Toggle
            label="Session start alerts"
            description="Notify before each planned session."
            value={sessionReminder}
            onToggle={() => setSessionReminder((value) => !value)}
          />
          <Toggle
            label="Mentor session reminder"
            description="Remind before your weekly check-in and monthly review."
            value={mentorReminder}
            onToggle={() => setMentorReminder((value) => !value)}
          />
          <Toggle
            label="Streak protection"
            description="Alert when your study streak is at risk."
            value={streakReminder}
            onToggle={() => setStreakReminder((value) => !value)}
          />
        </div>
      </DetailLayout>
    );
  }

  return (
    <div className="space-y-5 pb-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-card shadow-card flex items-center justify-center text-foreground"
          aria-label="Back"
        >
          <ChevronLeft size={18} />
        </button>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      </div>

      <div className="space-y-3">
        <SettingsItem
          icon={UserCircle2}
          label="Profile"
          value={`${profileName} | ${targetExam}`}
          onClick={() => setView("profile")}
        />
        <SettingsItem
          icon={MoonStar}
          label="Theme"
          value={themeLabel}
          onClick={() => setView("theme")}
        />
        <SettingsItem
          icon={Calendar}
          label="Week Start"
          value={weekStart}
          onClick={() => setView("weekStart")}
        />
        <SettingsItem
          icon={Users}
          label="Weekly Meeting"
          value={`${mentorDay} at ${mentorTime}`}
          onClick={() => setView("mentorMeeting")}
        />
        <SettingsItem
          icon={Clock3}
          label="Monthly Review"
          value={monthlyReviewLabel}
          onClick={() => setView("monthlyReview")}
        />
        <SettingsItem
          icon={Bell}
          label="Notifications"
          value="Daily reminders, session alerts, mentor reminders"
          onClick={() => setView("notifications")}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
