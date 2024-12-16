import React from 'react';

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

interface ProgressGraphProps {
  data: {
    [key: string]: DayGoals;
  };
}

export default function ProgressGraph({ data }: ProgressGraphProps) {
  const sortedDates = Object.keys(data).sort();
  
  const totalStudyHours = Object.values(data).reduce((sum, day) => 
    sum + (day.completion.studyHours ? day.studyHours : 0), 0);
    
  const totalMathQuestions = Object.values(data).reduce(
    (sum, day) => sum + (day.completion.mathQuestions ? day.questions.math : 0), 0);

  const maxStudyHours = Math.max(...Object.values(data).map((day) => day.studyHours));
  const maxQuestions = Math.max(
    ...Object.values(data).map((day) => day.questions.math)
  );

  // Calculate cumulative values for smooth curve
  const cumulativeData = sortedDates.reduce((acc, date, index) => {
    const prevValues = index > 0 ? acc[index - 1] : { hours: 0, questions: 0 };
    const dayData = data[date];
    
    acc.push({
      hours: prevValues.hours + (dayData.completion.studyHours ? dayData.studyHours : 0),
      questions: prevValues.questions + (dayData.completion.mathQuestions ? dayData.questions.math : 0)
    });
    
    return acc;
  }, [] as { hours: number; questions: number }[]);

  const maxCumulativeHours = cumulativeData.length > 0 ? cumulativeData[cumulativeData.length - 1].hours : 0;
  const maxCumulativeQuestions = cumulativeData.length > 0 ? cumulativeData[cumulativeData.length - 1].questions : 0;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Visão Geral do Progresso</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800">Total de Horas</h3>
            <p className="text-3xl font-bold text-blue-600">{totalStudyHours}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-purple-800">Questões de Matemática</h3>
            <p className="text-3xl font-bold text-purple-600">{totalMathQuestions}</p>
          </div>
        </div>
      </div>

      <div className="relative h-64 mt-8">
        {/* Y-axis labels */}
        <div className="absolute left-0 h-full flex flex-col justify-between text-xs text-gray-600">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>

        {/* Graph area */}
        <div className="absolute left-8 right-0 h-full">
          {/* Grid lines */}
          <div className="absolute w-full h-full grid grid-rows-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-t border-gray-200" />
            ))}
          </div>

          {/* Curves */}
          <svg className="absolute inset-0 w-full h-full">
            {/* Study Hours curve */}
            <path
              d={`M 0 ${64 * (1 - cumulativeData[0]?.hours / maxCumulativeHours || 0)} ${
                cumulativeData.map((point, i) => 
                  `L ${(i + 1) * (100 / cumulativeData.length)}% ${64 * (1 - point.hours / maxCumulativeHours)}`
                ).join(' ')
              }`}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
            />

            {/* Math Questions curve */}
            <path
              d={`M 0 ${64 * (1 - cumulativeData[0]?.questions / maxCumulativeQuestions || 0)} ${
                cumulativeData.map((point, i) => 
                  `L ${(i + 1) * (100 / cumulativeData.length)}% ${64 * (1 - point.questions / maxCumulativeQuestions)}`
                ).join(' ')
              }`}
              fill="none"
              stroke="#9333EA"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
          <span className="text-sm">Horas de Estudo</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 rounded mr-2" />
          <span className="text-sm">Questões de Matemática</span>
        </div>
      </div>
    </div>
  );
}