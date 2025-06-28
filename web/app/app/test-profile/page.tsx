"use client";

export default function TestProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-4 text-center">Test Profile Page</h1>
        <p className="text-gray-600 text-center">
          This is a simple test page to verify routing is working.
        </p>
        <div className="mt-6">
          <a 
            href="/app/profile" 
            className="block w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg text-center hover:shadow-lg transition-all duration-200"
          >
            Go to Full Profile Page
          </a>
        </div>
        <div className="mt-4">
          <a 
            href="/app/dashboard" 
            className="block w-full py-3 px-4 border border-purple-600 text-purple-600 font-semibold rounded-lg text-center hover:bg-purple-50 transition-all duration-200"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}