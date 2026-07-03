import ContinueReadingSection from "../components/home/ContinueReadingSection";
import ReadingDays from "../components/home/ReadingDays";
import RecentBooks from "../components/home/RecentBooks";
import DashboardLayout from "../layouts/DashboardLayout";
import { books } from "../data/books";

export default function Home() {
  return (
    <DashboardLayout>
      <ContinueReadingSection />
      <ReadingDays />
      <RecentBooks books={books} />
    </DashboardLayout>
  );
}
