import { Routes, Route } from 'react-router-dom';
import OnboardingWizard from './OnboardingWizard';
import Dashboard from './Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<OnboardingWizard />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;