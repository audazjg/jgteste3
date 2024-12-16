import React, { useState } from 'react';
import Calendar from './components/Calendar';
import ProgressGraph from './components/ProgressGraph';

interface Subject {
  name: string;
  goal: string;
}

interface SubjectQuestions {
  math: number;
}

interface TaskCompletion {
  studyHours: boolean;
  mathQuestions: boolean;
}

interface DayGoals {
  studyHours: number;
  questions: SubjectQuestions;
  completion: TaskCompletion;
  subjects: Subject[];
}

interface CalendarData {
  [key: string]: DayGoals;
}

function App() {
  const [calendarData, setCalendarData] = useState<CalendarData>({});

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Acompanhamento de Estudos</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <Calendar calendarData={calendarData} setCalendarData={setCalendarData} />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <ProgressGraph data={calendarData} />
        </div>
      </div>
    </div>
  );
}

export default App;