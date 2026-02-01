import React, { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface Props {
  children: ReactNode;
  labType: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SimulationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Simulation error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 border-red-500">
            <div className="flex flex-col items-center justify-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
                Simulation Error
              </h3>
              <p className="text-sm text-red-600 dark:text-red-300 text-center max-w-md">
                The {this.props.labType.toLowerCase().replace('_', ' ')} simulation encountered an error.
                Your progress has been saved. Try refreshing the page or contact support if the issue persists.
              </p>
              <div className="flex gap-2">
                <Button onClick={this.handleReset} variant="outline">
                  Try Again
                </Button>
                <Button onClick={() => window.location.reload()} variant="default">
                  Refresh Page
                </Button>
              </div>
              {this.state.error && (
                <details className="text-xs text-gray-500 dark:text-gray-400 max-w-md">
                  <summary className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                    Error Details
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto text-left">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
