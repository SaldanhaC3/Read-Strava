const Settings = () => {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-bold mb-2">Export Data</h3>
          <p className="text-slate-600 mb-4 text-sm">Download a copy of all your reading sessions, books, and metrics as JSON.</p>
          <button className="bg-slate-100 border border-slate-300 text-slate-800 px-4 py-2 rounded-lg font-medium hover:bg-slate-200">
            Export as JSON
          </button>
        </div>
        
        <div className="pt-8 border-t border-slate-100">
          <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
          <p className="text-slate-600 mb-4 text-sm">Permanently delete your account and all associated data.</p>
          <button className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg font-bold hover:bg-red-100">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
