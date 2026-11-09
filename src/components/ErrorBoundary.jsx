import React from 'react';

/**
 * Material 3 Expressive Error Boundary Component
 * Catches unhandled render errors anywhere in the component tree
 * and displays an actionable recovery view without blanking the screen.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Antigravity ErrorBoundary caught an unhandled render error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-m3-surface text-m3-on-surface flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-m3-surface-container rounded-[28px] p-8 border border-m3-outline-variant/40 shadow-xl space-y-5 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-m3-error-container text-m3-error flex items-center justify-center">
              <span className="material-symbols-rounded text-[32px] filled">warning</span>
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-m3-on-surface">Something went wrong</h2>
              <p className="text-xs text-m3-on-surface-variant mt-1.5 leading-relaxed">
                An unexpected error occurred while rendering the image canvas workspace. You can reset safely to the homepage.
              </p>
            </div>
            {this.state.error?.message && (
              <pre className="text-[11px] font-mono text-left bg-m3-surface-container-lowest p-3 rounded-xl overflow-x-auto text-m3-error border border-m3-outline-variant/30 max-h-28">
                {this.state.error.message}
              </pre>
            )}
            <div className="pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full py-3 px-6 rounded-full bg-m3-primary text-m3-on-primary font-bold text-xs hover:brightness-105 transition active:scale-95 cursor-pointer shadow-sm inline-flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-rounded text-[18px]">restart_alt</span>
                <span>Reset to Homepage</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
