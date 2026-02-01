import React from 'react';
import { Shield, BookOpen, Target, Award, ArrowRight } from 'lucide-react';

interface WelcomePageProps {
  onStartAssessment: () => void;
  userName: string;
}

const WelcomeCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description
}) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
    <div className="flex items-start space-x-4">
      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
      </div>
    </div>
  </div>
);

export const WelcomePage: React.FC<WelcomePageProps> = ({ onStartAssessment, userName }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <Shield className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to CyberGuard AI, {userName}!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your journey to becoming a cybersecurity expert starts here. Let's begin by assessing your current knowledge.
          </p>
        </div>

        {/* What to Expect */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Target className="h-6 w-6 mr-2 text-blue-600" />
            What to Expect
          </h2>
          <div className="space-y-6">
            <WelcomeCard
              icon={<BookOpen className="h-6 w-6 text-blue-600" />}
              title="Quick Skills Assessment"
              description="We'll ask you 6 questions covering key cybersecurity topics. This helps us understand your starting point and track your progress."
            />
            <WelcomeCard
              icon={<Shield className="h-6 w-6 text-green-600" />}
              title="Personalized Learning Path"
              description="Based on your responses, we'll guide you through courses tailored to strengthen your cybersecurity knowledge."
            />
            <WelcomeCard
              icon={<Award className="h-6 w-6 text-purple-600" />}
              title="Track Your Growth"
              description="After completing the training, you'll take a comprehensive assessment to measure your improvement and earn certificates."
            />
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button
            onClick={onStartAssessment}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Take Intro Assessment
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Takes approximately 5 minutes • 6 questions
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg px-6 py-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Note:</strong> This assessment is not graded. It's designed to help us understand your current knowledge level so we can provide the best learning experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
