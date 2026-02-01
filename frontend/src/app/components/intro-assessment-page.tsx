import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, Trophy, TrendingUp } from 'lucide-react';
import {
  getIntroAssessment,
  submitIntroAssessment,
  IntroAssessment,
  IntroAssessmentAnswer,
  IntroAssessmentResult
} from '../services/assessment.service';

interface IntroAssessmentPageProps {
  onComplete: () => void;
}

export const IntroAssessmentPage: React.FC<IntroAssessmentPageProps> = ({ onComplete }) => {
  const [assessment, setAssessment] = useState<IntroAssessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<IntroAssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAssessment();
  }, []);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      const data = await getIntroAssessment();
      setAssessment(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < (assessment?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!assessment) return;

    // Check if all questions are answered
    const unansweredCount = assessment.questions.filter(
      q => selectedAnswers[q.id] === undefined
    ).length;

    if (unansweredCount > 0) {
      alert(`Please answer all questions. ${unansweredCount} question(s) remaining.`);
      return;
    }

    try {
      setIsSubmitting(true);
      const answers: IntroAssessmentAnswer[] = assessment.questions.map(q => ({
        questionId: q.id,
        selectedAnswer: selectedAnswers[q.id]
      }));

      const resultData = await submitIntroAssessment(assessment.id, answers);
      setResult(resultData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <p className="text-red-800 dark:text-red-200">{error}</p>
          <button
            onClick={loadAssessment}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-full ${
                result.passed
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                  : 'bg-gradient-to-br from-blue-500 to-purple-600'
              }`}>
                <Trophy className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Assessment Complete!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              You scored {result.score} out of {result.totalQuestions} ({result.percentage}%)
            </p>
          </div>

          {/* Encouraging Message */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Great Start!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  This baseline assessment helps us understand where you are now. As you complete our courses,
                  you'll build strong cybersecurity skills and see significant improvement.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Remember, everyone starts somewhere. The key is continuous learning and improvement.
                  Your final assessment will show how much you've grown!
                </p>
              </div>
            </div>
          </div>

          {/* Question Review */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Question Review
            </h2>
            <div className="space-y-6">
              {result.answers.map((answer, index) => (
                <div
                  key={answer.questionId}
                  className={`p-4 rounded-lg border-2 ${
                    answer.isCorrect
                      ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                      : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {answer.isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white mb-2">
                        Question {index + 1}
                      </p>
                      {!answer.isCorrect && answer.explanation && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 italic">
                          {answer.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={onComplete}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Continue to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!assessment) return null;

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / assessment.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === assessment.questions.length - 1;
  const hasAnsweredCurrent = selectedAnswers[currentQuestion.id] !== undefined;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {assessment.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Question {currentQuestionIndex + 1} of {assessment.questions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-right">
            {answeredCount} of {assessment.questions.length} answered
          </p>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {currentQuestion.courseTitle}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswers[currentQuestion.id] === index
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedAnswers[currentQuestion.id] === index
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {selectedAnswers[currentQuestion.id] === index && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-gray-800 dark:text-gray-200">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
              currentQuestionIndex === 0
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600'
            }`}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || answeredCount !== assessment.questions.length}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                isSubmitting || answeredCount !== assessment.questions.length
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
              <CheckCircle className="ml-2 h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!hasAnsweredCurrent}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                !hasAnsweredCurrent
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Next
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
