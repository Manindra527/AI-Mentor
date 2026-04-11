import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
import {
  type Doubt,
  type JournalEntry,
  type MockScore,
  type TimeBlock,
} from "@/lib/store";

type ThemeMode = "light" | "dark";

export interface ProfileData {
  id: string;
  displayName: string;
  targetExam: string;
  examDate: string;
  availableHoursPerDay: number;
  weekStart: string;
  mentorDay: string;
  mentorTime: string;
  monthlyReviewDay: string;
  dailyReminder: boolean;
  sessionReminder: boolean;
  mentorReminder: boolean;
  streakReminder: boolean;
  theme: ThemeMode;
}

export interface PlannerSetupData {
  targetExam: string;
  examDate: string;
  availableHoursPerDay: number;
  subjects: string[];
}

interface AppDataContextValue {
  userId: string | null;
  isLoading: boolean;
  profile: ProfileData | null;
  plannerSetup: PlannerSetupData | null;
  plannerEntries: TimeBlock[];
  journalEntries: JournalEntry[];
  doubts: Doubt[];
  mockScores: MockScore[];
  saveProfile: (patch: Partial<ProfileData>) => Promise<boolean>;
  savePlannerSetup: (setup: PlannerSetupData) => Promise<boolean>;
  replacePlannerEntries: (entries: TimeBlock[]) => Promise<boolean>;
  upsertPlannerEntry: (entry: TimeBlock) => Promise<boolean>;
  deletePlannerEntry: (id: string) => Promise<boolean>;
  addJournalEntry: (entry: JournalEntry) => Promise<boolean>;
  addDoubt: (entry: Doubt) => Promise<boolean>;
}

const DEFAULT_PROFILE_VALUES: Omit<ProfileData, "id"> = {
  displayName: "Study Warrior",
  targetExam: "UPSC CSE",
  examDate: "",
  availableHoursPerDay: 0,
  weekStart: "Monday",
  mentorDay: "Sunday",
  mentorTime: "9:00 AM",
  monthlyReviewDay: "1",
  dailyReminder: true,
  sessionReminder: true,
  mentorReminder: true,
  streakReminder: false,
  theme: "light",
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

const normalizeTimeValue = (value: string) => value.slice(0, 5);

const mapProfileRow = (row: {
  id: string;
  display_name: string;
  target_exam: string;
  exam_date: string | null;
  available_hours_per_day: number | null;
  week_start: string;
  mentor_day: string;
  mentor_time: string;
  monthly_review_day: string;
  daily_reminder: boolean;
  session_reminder: boolean;
  mentor_reminder: boolean;
  streak_reminder: boolean;
  theme: string;
}): ProfileData => ({
  id: row.id,
  displayName: row.display_name,
  targetExam: row.target_exam,
  examDate: row.exam_date ?? "",
  availableHoursPerDay: Number(row.available_hours_per_day ?? 0),
  weekStart: row.week_start,
  mentorDay: row.mentor_day,
  mentorTime: row.mentor_time,
  monthlyReviewDay: row.monthly_review_day,
  dailyReminder: row.daily_reminder,
  sessionReminder: row.session_reminder,
  mentorReminder: row.mentor_reminder,
  streakReminder: row.streak_reminder,
  theme: row.theme === "dark" ? "dark" : "light",
});

const mapPlannerRow = (row: {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  subject: string;
  topic: string;
  session_type: TimeBlock["sessionType"];
  completed: boolean;
}): TimeBlock => ({
  id: row.id,
  date: row.date,
  startTime: normalizeTimeValue(row.start_time),
  endTime: normalizeTimeValue(row.end_time),
  subject: row.subject,
  topic: row.topic,
  sessionType: row.session_type,
  completed: row.completed,
});

const mapJournalRow = (row: {
  id: string;
  date: string;
  session_type: JournalEntry["sessionType"];
  subject: string;
  topic: string;
  duration: number;
  mood: JournalEntry["mood"];
  stress_reason: JournalEntry["stressReason"] | null;
  notes: string | null;
  questions_attempted: number | null;
  correct_answers: number | null;
  hardness: JournalEntry["hardness"] | null;
  mistakes: string | null;
}): JournalEntry => ({
  id: row.id,
  date: row.date,
  sessionType: row.session_type,
  subject: row.subject,
  topic: row.topic,
  duration: row.duration,
  mood: row.mood,
  stressReason: row.stress_reason ?? undefined,
  notes: row.notes ?? undefined,
  questionsAttempted: row.questions_attempted ?? undefined,
  correctAnswers: row.correct_answers ?? undefined,
  hardness: row.hardness ?? undefined,
  mistakes: row.mistakes ?? undefined,
});

const mapDoubtRow = (row: {
  id: string;
  question: string;
  answer: string | null;
  subject: string | null;
  topic: string | null;
  date: string;
  image_url: string | null;
}): Doubt => ({
  id: row.id,
  question: row.question,
  answer: row.answer ?? undefined,
  subject: row.subject ?? undefined,
  topic: row.topic ?? undefined,
  date: row.date,
  imageUrl: row.image_url ?? undefined,
});

const mapMockScoreRow = (row: {
  id: string;
  date: string;
  test: string;
  score: number;
}): MockScore => ({
  id: row.id,
  date: row.date,
  test: row.test,
  score: row.score,
});

const toProfileInsert = (userId: string, patch: Partial<ProfileData>): TablesInsert<"profiles"> => ({
  id: userId,
  display_name: patch.displayName,
  target_exam: patch.targetExam,
  exam_date: patch.examDate || null,
  available_hours_per_day: patch.availableHoursPerDay ?? null,
  week_start: patch.weekStart,
  mentor_day: patch.mentorDay,
  mentor_time: patch.mentorTime,
  monthly_review_day: patch.monthlyReviewDay,
  daily_reminder: patch.dailyReminder,
  session_reminder: patch.sessionReminder,
  mentor_reminder: patch.mentorReminder,
  streak_reminder: patch.streakReminder,
  theme: patch.theme,
});

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const { theme, setTheme } = useTheme();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [plannerEntries, setPlannerEntries] = useState<TimeBlock[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [mockScores, setMockScores] = useState<MockScore[]>([]);

  const loadAccountData = async (nextUserId: string | null) => {
    if (!nextUserId) {
      setUserId(null);
      setProfile(null);
      setSubjects([]);
      setPlannerEntries([]);
      setJournalEntries([]);
      setDoubts([]);
      setMockScores([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const [
      profileResult,
      subjectsResult,
      plannerResult,
      journalResult,
      doubtsResult,
      mockScoresResult,
    ] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", nextUserId).maybeSingle(),
      supabase.from("study_subjects").select("*").eq("user_id", nextUserId).order("position", { ascending: true }),
      supabase.from("planner_entries").select("*").eq("user_id", nextUserId).order("date", { ascending: true }).order("start_time", { ascending: true }),
      supabase.from("journal_entries").select("*").eq("user_id", nextUserId).order("date", { ascending: false }).order("created_at", { ascending: false }),
      supabase.from("doubts").select("*").eq("user_id", nextUserId).order("date", { ascending: false }).order("created_at", { ascending: false }),
      supabase.from("mock_scores").select("*").eq("user_id", nextUserId).order("date", { ascending: true }).order("created_at", { ascending: true }),
    ]);

    if (profileResult.error || subjectsResult.error || plannerResult.error || journalResult.error || doubtsResult.error || mockScoresResult.error) {
      toast.error("Could not load account data from Supabase.");
      setIsLoading(false);
      return;
    }

    setUserId(nextUserId);
    setProfile(profileResult.data ? mapProfileRow(profileResult.data) : { id: nextUserId, ...DEFAULT_PROFILE_VALUES });
    setSubjects((subjectsResult.data ?? []).map((row) => row.name));
    setPlannerEntries((plannerResult.data ?? []).map(mapPlannerRow));
    setJournalEntries((journalResult.data ?? []).map(mapJournalRow));
    setDoubts((doubtsResult.data ?? []).map(mapDoubtRow));
    setMockScores((mockScoresResult.data ?? []).map(mapMockScoreRow));
    setIsLoading(false);
  };

  useEffect(() => {
    let active = true;

    const boot = async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) {
        return;
      }
      await loadAccountData(data.user?.id ?? null);
    };

    void boot();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void loadAccountData(session?.user?.id ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const channel = supabase
      .channel(`ai-mentor-data-${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles", filter: `id=eq.${userId}` }, () => {
        void loadAccountData(userId);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "study_subjects", filter: `user_id=eq.${userId}` }, () => {
        void loadAccountData(userId);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "planner_entries", filter: `user_id=eq.${userId}` }, () => {
        void loadAccountData(userId);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "journal_entries", filter: `user_id=eq.${userId}` }, () => {
        void loadAccountData(userId);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "doubts", filter: `user_id=eq.${userId}` }, () => {
        void loadAccountData(userId);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "mock_scores", filter: `user_id=eq.${userId}` }, () => {
        void loadAccountData(userId);
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    if (!profile?.theme) {
      return;
    }

    if (theme !== profile.theme) {
      setTheme(profile.theme);
    }
  }, [profile?.theme, setTheme, theme]);

  const saveProfile = async (patch: Partial<ProfileData>) => {
    if (!userId) {
      toast.error("Please sign in to save settings.");
      return false;
    }

    const insertPayload = toProfileInsert(userId, {
      ...(profile ?? { id: userId, ...DEFAULT_PROFILE_VALUES }),
      ...patch,
    });
    const { error } = await supabase.from("profiles").upsert(insertPayload);

    if (error) {
      toast.error("Could not save settings.");
      return false;
    }

    setProfile((previous) => ({
      id: userId,
      ...(previous ?? DEFAULT_PROFILE_VALUES),
      ...patch,
      theme: patch.theme ?? previous?.theme ?? "light",
      displayName: patch.displayName ?? previous?.displayName ?? DEFAULT_PROFILE_VALUES.displayName,
      targetExam: patch.targetExam ?? previous?.targetExam ?? DEFAULT_PROFILE_VALUES.targetExam,
      examDate: patch.examDate ?? previous?.examDate ?? DEFAULT_PROFILE_VALUES.examDate,
      availableHoursPerDay: patch.availableHoursPerDay ?? previous?.availableHoursPerDay ?? DEFAULT_PROFILE_VALUES.availableHoursPerDay,
      weekStart: patch.weekStart ?? previous?.weekStart ?? DEFAULT_PROFILE_VALUES.weekStart,
      mentorDay: patch.mentorDay ?? previous?.mentorDay ?? DEFAULT_PROFILE_VALUES.mentorDay,
      mentorTime: patch.mentorTime ?? previous?.mentorTime ?? DEFAULT_PROFILE_VALUES.mentorTime,
      monthlyReviewDay: patch.monthlyReviewDay ?? previous?.monthlyReviewDay ?? DEFAULT_PROFILE_VALUES.monthlyReviewDay,
      dailyReminder: patch.dailyReminder ?? previous?.dailyReminder ?? DEFAULT_PROFILE_VALUES.dailyReminder,
      sessionReminder: patch.sessionReminder ?? previous?.sessionReminder ?? DEFAULT_PROFILE_VALUES.sessionReminder,
      mentorReminder: patch.mentorReminder ?? previous?.mentorReminder ?? DEFAULT_PROFILE_VALUES.mentorReminder,
      streakReminder: patch.streakReminder ?? previous?.streakReminder ?? DEFAULT_PROFILE_VALUES.streakReminder,
    }));

    return true;
  };

  const savePlannerSetup = async (setup: PlannerSetupData) => {
    if (!userId) {
      toast.error("Please sign in to create your planner.");
      return false;
    }

    const profileSaved = await saveProfile({
      targetExam: setup.targetExam,
      examDate: setup.examDate,
      availableHoursPerDay: setup.availableHoursPerDay,
    });

    if (!profileSaved) {
      return false;
    }

    const { error: deleteError } = await supabase.from("study_subjects").delete().eq("user_id", userId);

    if (deleteError) {
      toast.error("Could not update your subjects.");
      return false;
    }

    if (setup.subjects.length > 0) {
      const rows: TablesInsert<"study_subjects">[] = setup.subjects.map((name, index) => ({
        user_id: userId,
        name,
        position: index,
      }));

      const { error: insertError } = await supabase.from("study_subjects").insert(rows);

      if (insertError) {
        toast.error("Could not save your subjects.");
        return false;
      }
    }

    setSubjects(setup.subjects);
    return true;
  };

  const replacePlannerEntries = async (entries: TimeBlock[]) => {
    if (!userId) {
      toast.error("Please sign in to update your planner.");
      return false;
    }

    const { error: deleteError } = await supabase.from("planner_entries").delete().eq("user_id", userId);

    if (deleteError) {
      toast.error("Could not replace planner entries.");
      return false;
    }

    if (entries.length > 0) {
      const rows: TablesInsert<"planner_entries">[] = entries.map((entry) => ({
        id: entry.id,
        user_id: userId,
        date: entry.date,
        start_time: `${entry.startTime}:00`,
        end_time: `${entry.endTime}:00`,
        subject: entry.subject,
        topic: entry.topic ?? "",
        session_type: entry.sessionType,
        completed: entry.completed,
      }));

      const { error: insertError } = await supabase.from("planner_entries").insert(rows);

      if (insertError) {
        toast.error("Could not save planner entries.");
        return false;
      }
    }

    setPlannerEntries(entries);
    return true;
  };

  const upsertPlannerEntry = async (entry: TimeBlock) => {
    if (!userId) {
      toast.error("Please sign in to update your planner.");
      return false;
    }

    const { error } = await supabase.from("planner_entries").upsert({
      id: entry.id,
      user_id: userId,
      date: entry.date,
      start_time: `${entry.startTime}:00`,
      end_time: `${entry.endTime}:00`,
      subject: entry.subject,
      topic: entry.topic ?? "",
      session_type: entry.sessionType,
      completed: entry.completed,
    });

    if (error) {
      toast.error("Could not save this planner block.");
      return false;
    }

    setPlannerEntries((previous) => {
      const next = previous.filter((item) => item.id !== entry.id);
      next.push(entry);
      return next.sort((first, second) => `${first.date}${first.startTime}`.localeCompare(`${second.date}${second.startTime}`));
    });
    return true;
  };

  const deletePlannerEntry = async (id: string) => {
    const { error } = await supabase.from("planner_entries").delete().eq("id", id);
    if (error) {
      toast.error("Could not delete this planner block.");
      return false;
    }
    setPlannerEntries((previous) => previous.filter((entry) => entry.id !== id));
    return true;
  };

  const addJournalEntry = async (entry: JournalEntry) => {
    if (!userId) {
      toast.error("Please sign in to save journal entries.");
      return false;
    }

    const { error } = await supabase.from("journal_entries").insert({
      id: entry.id,
      user_id: userId,
      date: entry.date,
      session_type: entry.sessionType,
      subject: entry.subject,
      topic: entry.topic,
      duration: entry.duration,
      mood: entry.mood,
      stress_reason: entry.stressReason ?? null,
      notes: entry.notes ?? null,
      questions_attempted: entry.questionsAttempted ?? null,
      correct_answers: entry.correctAnswers ?? null,
      hardness: entry.hardness ?? null,
      mistakes: entry.mistakes ?? null,
    });

    if (error) {
      toast.error("Could not save this journal entry.");
      return false;
    }

    setJournalEntries((previous) => [entry, ...previous]);
    return true;
  };

  const addDoubt = async (entry: Doubt) => {
    if (!userId) {
      toast.error("Please sign in to save doubts.");
      return false;
    }

    const { error } = await supabase.from("doubts").insert({
      id: entry.id,
      user_id: userId,
      question: entry.question,
      answer: entry.answer ?? null,
      subject: entry.subject ?? null,
      topic: entry.topic ?? null,
      date: entry.date,
      image_url: entry.imageUrl ?? null,
    });

    if (error) {
      toast.error("Could not save this doubt.");
      return false;
    }

    setDoubts((previous) => [entry, ...previous]);
    return true;
  };

  const plannerSetup = useMemo<PlannerSetupData | null>(() => {
    if (!profile?.examDate || subjects.length === 0) {
      return null;
    }

    return {
      targetExam: profile.targetExam,
      examDate: profile.examDate,
      availableHoursPerDay: profile.availableHoursPerDay,
      subjects,
    };
  }, [profile, subjects]);

  const value = useMemo<AppDataContextValue>(
    () => ({
      userId,
      isLoading,
      profile,
      plannerSetup,
      plannerEntries,
      journalEntries,
      doubts,
      mockScores,
      saveProfile,
      savePlannerSetup,
      replacePlannerEntries,
      upsertPlannerEntry,
      deletePlannerEntry,
      addJournalEntry,
      addDoubt,
    }),
    [
      userId,
      isLoading,
      profile,
      plannerSetup,
      plannerEntries,
      journalEntries,
      doubts,
      mockScores,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used inside AppDataProvider.");
  }
  return context;
};
