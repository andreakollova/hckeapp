
import React, { ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Fixed: Inheriting from React.Component and declaring the state and props properties to ensure that
// they are correctly recognized as inherited members by the TypeScript compiler.
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Explicit declaration of state and props properties to satisfy property existence checks in strict mode.
  state: ErrorBoundaryState;
  props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Correctly initializing state inside the constructor using the inherited or declared property.
    this.state = {
      hasError: false,
      error: null
    };
    // Initialize props explicitly to satisfy property existence checks.
    this.props = props;
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("APP CRASH:", error, errorInfo);
  }

  render() {
    // Accessing this.state which is now correctly inherited from React.Component.
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          color: '#ff4444',
          backgroundColor: '#040404',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontFamily: 'sans-serif'
        }}>
          <h1 style={{ color: '#f46c24', fontSize: '2rem', marginBottom: '1rem' }}>Ups! Niečo sa nepodarilo.</h1>
          <pre style={{ background: '#111', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem', maxWidth: '100%', overflow: 'auto' }}>
            {this.state.error?.message}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '20px', padding: '10px 20px', background: '#f46c24', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Obnoviť aplikáciu
          </button>
        </div>
      );
    }
    // Accessing this.props.children inherited from React.Component.
    return this.props.children;
  }
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
