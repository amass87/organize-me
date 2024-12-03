// src/pages/Settings.jsx
export default function Settings() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
          <span>Dark Mode</span>
          <button className="px-4 py-2 bg-gray-200 rounded">Toggle</button>
        </div>
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
          <span>Notifications</span>
          <button className="px-4 py-2 bg-gray-200 rounded">Enable</button>
        </div>
      </div>
    </div>
  );
}
