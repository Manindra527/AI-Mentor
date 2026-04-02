import { useState } from "react";
import { ChevronLeft, Calendar, Users, Bell } from "lucide-react";

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MENTOR_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MENTOR_TIMES = ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];

interface SettingsPageProps {
  onBack: () => void;
}

const SettingsPage = ({ onBack }: SettingsPageProps) => {
  const [weekStart, setWeekStart] = useState("Monday");
  const [mentorDay, setMentorDay] = useState("Sunday");
  const [mentorTime, setMentorTime] = useState("9:00 AM");
  const [monthlyReviewDay, setMonthlyReviewDay] = useState("1");

  const [dailyReminder, setDailyReminder] = useState(true);
  const [sessionReminder, setSessionReminder] = useState(true);
  const [mentorReminder, setMentorReminder] = useState(true);
  const [streakReminder, setStreakReminder] = useState(false);

  return (
    <div className="space-y-5 pb-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-primary font-semibold text-sm">← Back</button>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      </div>

      {/* Week Start Day */}
      <div className="bg-card rounded-2xl shadow-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={18} className="text-primary" />
          <h3 className="font-semibold text-foreground">Week Start Day</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {WEEK_DAYS.map((day) => (
            <button
              key={day}
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

      {/* Mentor Meeting Schedule */}
      <div className="bg-card rounded-2xl shadow-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} className="text-primary" />
          <h3 className="font-semibold text-foreground">Mentor Meeting Schedule</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Weekly Session Day</label>
            <div className="grid grid-cols-3 gap-2">
              {MENTOR_DAYS.map((day) => (
                <button
                  key={day}
                  onClick={() => setMentorDay(day)}
                  className={`py-2 rounded-xl text-xs font-medium transition-colors ${
                    mentorDay === day
                      ? "gradient-primary text-primary-foreground shadow-orange"
                      : "bg-accent text-accent-foreground border border-border hover:border-primary"
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Preferred Time</label>
            <div className="grid grid-cols-3 gap-2">
              {MENTOR_TIMES.map((time) => (
                <button
                  key={time}
                  onClick={() => setMentorTime(time)}
                  className={`py-2 rounded-xl text-xs font-medium transition-colors ${
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

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Monthly Review Day</label>
            <div className="flex gap-2">
              {["1", "15", "Last"].map((day) => (
                <button
                  key={day}
                  onClick={() => setMonthlyReviewDay(day)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    monthlyReviewDay === day
                      ? "gradient-primary text-primary-foreground shadow-orange"
                      : "bg-accent text-accent-foreground border border-border hover:border-primary"
                  }`}
                >
                  {day === "Last" ? "Last Day" : `Day ${day}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-card rounded-2xl shadow-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={18} className="text-primary" />
          <h3 className="font-semibold text-foreground">Notifications</h3>
        </div>

        <div className="space-y-3">
          {[
            { label: "Daily study reminder", desc: "Get reminded to start your daily plan", value: dailyReminder, set: setDailyReminder },
            { label: "Session start alerts", desc: "Notify before each planned session", value: sessionReminder, set: setSessionReminder },
            { label: "Mentor session reminder", desc: "Remind before weekly/monthly reviews", value: mentorReminder, set: setMentorReminder },
            { label: "Streak protection", desc: "Alert when your streak is at risk", value: streakReminder, set: setStreakReminder },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 bg-accent rounded-xl">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <button
                onClick={() => item.set(!item.value)}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  item.value ? "bg-primary" : "bg-border"
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    item.value ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
