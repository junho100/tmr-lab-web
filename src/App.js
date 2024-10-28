import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ExperimentApp from "./ExperimentApp";
import ExperimentMenu from "./components/ExperimentMenu";
import LabPage from "./components/LabPage";
import Round1 from "./components/Round1";
import Round2 from "./components/Round2";
import Round3 from "./components/Round3";
import PreRound1 from "./components/PreRound1";
import PreRound2 from "./components/PreRound2";

const App = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<ExperimentApp />} />
        <Route path="/:userId/*" element={<AuthenticatedRoutes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route path="menu" element={<ExperimentMenu />} />
      <Route path="lab" element={<LabPage />} />
      <Route path="pre-round1" element={<PreRound1 />} />
      <Route path="pre-round2" element={<PreRound2 />} />
      <Route path="round1" element={<Round1 />} />
      <Route path="round2" element={<Round2 />} />
      <Route path="round3" element={<Round3 />} />
      <Route path="pre-test" element={<div>Pre-Test 페이지</div>} />
      <Route path="test" element={<div>Test 페이지</div>} />
      <Route path="*" element={<Navigate to="menu" replace />} />
    </Routes>
  );
};

export default App;
