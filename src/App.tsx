import { useState } from 'react';
import ChatContainer from './components/chat/ChatContainer';
import { Sidebar, ErrorBoundary } from './components/layout';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ErrorBoundary>
      <div className="h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header with sidebar toggle */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                <svg className="w-5 h-5 text-gray-700 hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {sidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-800">AI Chat Assistant</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {sidebarOpen ? "Sidebar Open" : "Sidebar Closed"}
              </span>
            </div>
          </div>
          
          {/* Chat Container */}
          <div className="flex-1">
            <ChatContainer />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export { App as default };
