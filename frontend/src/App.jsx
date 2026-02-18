import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import BoardsPage from './pages/BoardsPage';
import SchoolsPage from './pages/SchoolsPage';
import ClassesPage from './pages/ClassesPage';
import SubjectsPage from './pages/SubjectsPage';
import StudentsPage from './pages/StudentsPage';
import ExamsPage from './pages/ExamsPage';
import GradeRangesPage from './pages/GradeRangesPage';
import ExamWeightagePage from './pages/ExamWeightagePage';
import MarksEntryPage from './pages/MarksEntryPage';
import ResultsPage from './pages/ResultsPage';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#e2e8f0',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 lg:ml-64">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="p-4 lg:p-6 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/boards" element={<BoardsPage />} />
              <Route path="/schools" element={<SchoolsPage />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/subjects" element={<SubjectsPage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/exams" element={<ExamsPage />} />
              <Route path="/grade-ranges" element={<GradeRangesPage />} />
              <Route path="/exam-weightage" element={<ExamWeightagePage />} />
              <Route path="/marks" element={<MarksEntryPage />} />
              <Route path="/results" element={<ResultsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
