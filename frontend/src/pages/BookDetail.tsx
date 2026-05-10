import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import SessionTimer from '../components/SessionTimer';

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState<any>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);

  useEffect(() => {
    // Em um app real, teríamos a rota /user-books/:id
    api.get('/user-books').then(res => {
      const found = res.data.find((b: any) => b.id === id);
      setBook(found);
    });
  }, [id]);

  if (!book) return <div>Loading book details...</div>;

  const handleFinishSession = async () => {
    setIsSessionActive(false);
    // Refresh book info (progress)
    const res = await api.get('/user-books');
    const found = res.data.find((b: any) => b.id === id);
    setBook(found);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-6">
        <div className="w-32 h-48 bg-slate-200 rounded flex-shrink-0">
          {book.cover_url && <img src={book.cover_url} className="w-full h-full object-cover rounded" alt="Cover" />}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-slate-600 mb-4">{book.author}</p>
          <div className="flex gap-4">
            <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
              <div className="text-xs text-slate-500 font-semibold uppercase">Progress</div>
              <div className="font-bold text-lg">{book.progress_page} <span className="text-sm font-normal text-slate-500">/ {book.page_count}</span></div>
            </div>
            <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
              <div className="text-xs text-slate-500 font-semibold uppercase">Status</div>
              <div className="font-bold text-lg capitalize">{book.status.replace('_', ' ')}</div>
            </div>
          </div>
        </div>
      </div>

      {isSessionActive ? (
        <SessionTimer 
          bookId={book.id} 
          currentProgress={book.progress_page} 
          onFinish={handleFinishSession} 
          onCancel={() => setIsSessionActive(false)} 
        />
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
          <h3 className="text-xl font-bold mb-2">Ready to read?</h3>
          <p className="text-slate-600 mb-6">Start a new session to track your pages and speed.</p>
          <button 
            onClick={() => setIsSessionActive(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-bold shadow-md transition-transform hover:scale-105"
          >
            Start Reading Session
          </button>
        </div>
      )}
    </div>
  );
};

export default BookDetail;
