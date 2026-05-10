import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Library = () => {
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    api.get('/user-books').then(res => setBooks(res.data));
  }, []);

  const addTestBook = async () => {
    // Para MVP, criar um livro dummy se não houver
    const bookRes = await api.post('/books', {
      title: 'The Pragmatic Programmer',
      author: 'Andy Hunt',
      page_count: 320
    });
    await api.post('/user-books', { bookId: bookRes.data.id });
    const res = await api.get('/user-books');
    setBooks(res.data);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Library</h1>
        <button onClick={addTestBook} className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600">
          + Add Book
        </button>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-20 text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
          No books in your library yet. Add one to start tracking your reading!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map(ub => (
            <div key={ub.user_book_id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col">
              <div className="flex gap-4 mb-4">
                <div className="w-20 h-28 bg-slate-200 rounded object-cover flex-shrink-0">
                  {ub.cover_url && <img src={ub.cover_url} alt="cover" className="w-full h-full rounded object-cover"/>}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight mb-1">{ub.title}</h3>
                  <p className="text-slate-600 text-sm mb-2">{ub.author}</p>
                  <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    {ub.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div className="mt-auto">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Progress</span>
                  <span>{ub.progress_page} / {ub.page_count || '?'} p</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.min(100, (ub.progress_page / (ub.page_count || 1)) * 100)}%` }}></div>
                </div>
                
                <Link to={`/books/${ub.id}`} className="block w-full text-center bg-slate-900 text-white py-2 rounded-lg font-medium hover:bg-slate-800">
                  Open Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
