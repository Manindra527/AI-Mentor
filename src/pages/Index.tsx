import { useState } from "react";
import BottomNav, { type TabId } from "@/components/BottomNav";
import HomePage from "@/pages/HomePage";
import PlannerPage from "@/pages/PlannerPage";
import JournalPage from "@/pages/JournalPage";
import MentorPage from "@/pages/MentorPage";
import DoubtsPage from "@/pages/DoubtsPage";
import ProgressPage from "@/pages/ProgressPage";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  const renderPage = () => {
    switch (activeTab) {
      case "home": return <HomePage />;
      case "planner": return <PlannerPage />;
      case "journal": return <JournalPage />;
      case "mentor": return <MentorPage />;
      case "doubts": return <DoubtsPage />;
      case "progress": return <ProgressPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
        {renderPage()}
      </div>
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
};

export default Index;
