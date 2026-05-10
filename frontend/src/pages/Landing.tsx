import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-20">
      <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
        Measure your reading like you measure your runs.
      </h1>
      <p className="text-xl text-slate-600 mb-8 max-w-2xl">
        Transform every reading session into objective data (time, pages, PPM), generate streaks, and share your progress with the community.
      </p>
      <Link to="/auth" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg transition-transform hover:scale-105">
        Start for free
      </Link>
      
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-xl mb-2">Track Speed</h3>
          <p className="text-slate-600">Know your Pages-Per-Minute (PPM) to estimate how long books will take you.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-xl mb-2">Build Streaks</h3>
          <p className="text-slate-600">Stay consistent with daily reading goals and maintain your reading streak.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-xl mb-2">Social Feed</h3>
          <p className="text-slate-600">See what your friends are reading and share your completion cards.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
