import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logError } from '@/lib/errors';
import { ErrorPage } from '@/pages/ErrorPage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to Supabase
    logError({
      error_type: 'client',
      error_message: error.message,
      error_stack: error.stack || errorInfo.componentStack || undefined,
      page_path: window.location.pathname,
      user_agent: navigator.userAgent,
      additional_data: {
        error_name: error.name,
        component_stack: errorInfo.componentStack,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    }

    return this.props.children;
  }
}
