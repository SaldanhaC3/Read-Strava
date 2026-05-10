import { useEffect, useState } from 'react';
import api from '../api';
import { formatDistanceToNow } from 'date-fns';
import { User as UserIcon } from 'lucide-react';

const Feed = () => {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    api.get('/feed').then(res => setActivities(res.data));
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Activity Feed</h1>
      
      {activities.length === 0 ? (
        <div className="text-center py-20 text-slate-500 bg-white rounded-xl border border-slate-200">
          No activity yet.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {activities.map(activity => (
            <div key={activity.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                {activity.avatar_url ? <img src={activity.avatar_url} className="w-full h-full rounded-full object-cover" /> : <UserIcon />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-slate-900">
                    <span className="font-bold">@{activity.handle}</span>
                    {activity.activity_type === 'session' && ' completed a reading session of '}
                    {activity.activity_type === 'finish' && ' finished reading '}
                    <span className="font-bold italic">{activity.title}</span>
                  </p>
                  <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                    {formatDistanceToNow(new Date(activity.created_at))} ago
                  </span>
                </div>
                
                {activity.activity_type === 'session' && activity.metadata && (
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 inline-flex gap-4 text-sm font-medium">
                    <div className="text-emerald-600">{activity.metadata.pagesRead} pages</div>
                    <div className="text-slate-400">|</div>
                    <div className="text-slate-600">{Number(activity.metadata.ppm).toFixed(1)} PPM</div>
                  </div>
                )}
                
                {activity.activity_type === 'finish' && (
                  <div className="mt-2 inline-block bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold border border-emerald-200">
                    🎉 Finished!
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
