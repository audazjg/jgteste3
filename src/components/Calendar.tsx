import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle, Circle } from 'lucide-react';

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

interface CalendarProps {
  calendarData: CalendarData;
  setCalendarData: React.Dispatch<React.SetStateAction<CalendarData>>;
}

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function Calendar({ calendarData, setCalendarData }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [studyHours, setStudyHours] = useState('');
  const [mathQuestions, setMathQuestions] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [subjectGoal, setSubjectGoal] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    const dateKey = formatDate(newDate);
    if (calendarData[dateKey]) {
      setSubjects(calendarData[dateKey].subjects || []);
    } else {
      setSubjects([]);
    }
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (subjectName && subjectGoal) {
      setSubjects([...subjects, { name: subjectName, goal: subjectGoal }]);
      setSubjectName('');
      setSubjectGoal('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && (studyHours || mathQuestions || subjects.length > 0)) {
      const dateKey = formatDate(selectedDate);
      setCalendarData((prev) => ({
        ...prev,
        [dateKey]: {
          studyHours: Number(studyHours),
          questions: {
            math: Number(mathQuestions)
          },
          completion: {
            studyHours: false,
            mathQuestions: false
          },
          subjects: subjects
        },
      }));
      setStudyHours('');
      setMathQuestions('');
      setSubjects([]);
    }
  };

  const toggleTaskCompletion = (dateKey: string, task: keyof TaskCompletion, e: React.MouseEvent) => {
    e.stopPropagation();
    setCalendarData((prev) => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        completion: {
          ...prev[dateKey].completion,
          [task]: !prev[dateKey].completion[task]
        }
      }
    }));
  };

  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = formatDate(date);
      const dayData = calendarData[dateKey];

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-32 border p-2 cursor-pointer hover:bg-gray-50 relative ${
            selectedDate &&
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentDate.getMonth()
              ? 'bg-blue-50'
              : ''
          }`}
        >
          <div className="font-semibold">{day}</div>
          {dayData && (
            <div className="text-xs space-y-2">
              {dayData.studyHours > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-blue-600">{dayData.studyHours}h estudadas</span>
                  <button
                    onClick={(e) => toggleTaskCompletion(dateKey, 'studyHours', e)}
                    className="text-gray-600 hover:text-green-600"
                  >
                    {dayData.completion.studyHours ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </button>
                </div>
              )}
              {dayData.questions.math > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-purple-600">{dayData.questions.math} Mat.</span>
                  <button
                    onClick={(e) => toggleTaskCompletion(dateKey, 'mathQuestions', e)}
                    className="text-gray-600 hover:text-green-600"
                  >
                    {dayData.completion.mathQuestions ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </button>
                </div>
              )}
              {dayData.subjects?.map((subject, index) => (
                <div key={index} className="text-gray-600">
                  {subject.name}: {subject.goal}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6" />
          <h2 className="text-xl font-semibold">
            {`${MESES[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {DIAS.map((day) => (
          <div key={day} className="text-center font-semibold py-2">
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>

      {selectedDate && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <h3 className="text-lg font-semibold">
            Adicionar Metas para {selectedDate.toLocaleDateString('pt-BR')}
          </h3>
          <div className="space-y-2">
            <label className="block">
              Horas de Estudo:
              <input
                type="number"
                min="0"
                step="0.5"
                value={studyHours}
                onChange={(e) => setStudyHours(e.target.value)}
                className="ml-2 border rounded px-2 py-1"
              />
            </label>
          </div>
          <div className="space-y-2">
            <label className="block">
              Questões de Matemática:
              <input
                type="number"
                min="0"
                value={mathQuestions}
                onChange={(e) => setMathQuestions(e.target.value)}
                className="ml-2 border rounded px-2 py-1"
              />
            </label>
          </div>
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Adicionar Matéria e Objetivo</h4>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Nome da Matéria"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="border rounded px-2 py-1 flex-1"
              />
              <input
                type="text"
                placeholder="Objetivo"
                value={subjectGoal}
                onChange={(e) => setSubjectGoal(e.target.value)}
                className="border rounded px-2 py-1 flex-1"
              />
              <button
                type="button"
                onClick={handleAddSubject}
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
              >
                Adicionar
              </button>
            </div>
            {subjects.length > 0 && (
              <div className="mt-2">
                <h5 className="font-semibold mb-1">Matérias Adicionadas:</h5>
                <ul className="list-disc pl-5">
                  {subjects.map((subject, index) => (
                    <li key={index}>
                      {subject.name}: {subject.goal}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Salvar Metas
          </button>
        </form>
      )}
    </div>
  );
}