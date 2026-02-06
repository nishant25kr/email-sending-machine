export default function Header() {
  return (
    <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 bg-gray-900 rounded flex items-center justify-center">
            <svg 
              className="w-5 h-5 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">ReachInbox</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">John Doe</p>
          <p className="text-xs text-gray-500">john@example.com</p>
        </div>
        
        {/* User Avatar */}
        <div className="h-9 w-9 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
          JD
        </div>
      </div>
    </header>
  );
}