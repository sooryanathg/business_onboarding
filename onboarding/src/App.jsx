import { Routes, Route } from 'react-router-dom';
import OnboardingWizard from './OnboardingWizard';
import Dashboard from './Dashboard';

function App() {
  return (
    <div className="w-full min-h-screen">
      <Routes>
        <Route path="/" element={<OnboardingWizard />} />
        <Route path="/onboarding" element={<OnboardingWizard />} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </div>
  );
}

export default App;