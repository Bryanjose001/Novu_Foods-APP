import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 gap-4 text-center">
          <div className="text-5xl">⚠️</div>
          <h2 className="text-xl font-bold text-blackc">Something went wrong</h2>
          <p className="text-gray-400 text-sm max-w-xs">
            An unexpected error occurred on this page. Your cart is safe.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-secondary py-2 px-4 text-sm"
            >
              Try again
            </button>
            <Link to="/" className="btn-primary py-2 px-4 text-sm">
              Go home
            </Link>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-4 text-left text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl p-4 max-w-full overflow-auto max-h-40">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
