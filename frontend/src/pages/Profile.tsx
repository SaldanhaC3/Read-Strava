import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { User as UserIcon } from 'lucide-react';

const Profile = () => {
  const { user, login } = useAuth();
  const [bio, setBio] = useState(user?.bio || '');
  const [theme, setTheme] = useState(user?.theme_palette || 'default');

  if (!user) return null;

  const handleSave = async () => {
    try {
      const res = await api.patch('/users/me', { bio, theme_palette: theme });
      login(localStorage.getItem('token')!, res.data);
      alert('Profile updated');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
          <UserIcon className="w-12 h-12" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-slate-500">@{user.handle}</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
          <textarea 
            value={bio} 
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 border rounded-lg h-24"
            placeholder="Tell us about your reading habits..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Color Theme</label>
          <div className="flex gap-4">
            <button 
              onClick={() => setTheme('default')}
              className={`w-10 h-10 rounded-full bg-emerald-500 ${theme === 'default' ? 'ring-4 ring-offset-2 ring-emerald-500' : ''}`}
            ></button>
            <button 
              onClick={() => setTheme('blue')}
              className={`w-10 h-10 rounded-full bg-blue-500 ${theme === 'blue' ? 'ring-4 ring-offset-2 ring-blue-500' : ''}`}
            ></button>
          </div>
        </div>
        
        <button onClick={handleSave} className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;
