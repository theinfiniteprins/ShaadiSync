import TopBar from "./components/TopBar";
import HeroSection from "./components/HeroSection";
import FilterBar from "./components/FilterBar";

export default function App() {
  return (
    <div className="min-h-screen bg-pink-50">
      <TopBar />
      <HeroSection />
      <div className="flex justify-center mt-8">
        <FilterBar />
      </div>
    </div>
  );
}
