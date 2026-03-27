'use client';
import { useEffect, useState } from 'react';
import { getBooks, createBook, updateBook, deleteBook, searchBooks } from '@/lib/api';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    title: '', author: '', category: '', isbn: '',
    publisher: '', publishedYear: '', totalQuantity: 1, availableQuantity: 1
  });

  const userStr = Cookies.get('user');
  const role = userStr ? JSON.parse(userStr).role : 'STAFF';

  const fetchBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch { toast.error('Failed to load books'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleSearch = async (val: string) => {
    setSearch(val);
    if (val.trim()) {
      const res = await searchBooks(val);
      setBooks(res.data);
    } else fetchBooks();
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', author: '', category: '', isbn: '', publisher: '', publishedYear: '', totalQuantity: 1, availableQuantity: 1 });
    setShowModal(true);
  };

  const openEdit = (book: any) => {
    setEditing(book);
    setForm({ ...book, publishedYear: book.publishedYear?.toString() || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateBook(editing.id, form);
        toast.success('Book updated!');
      } else {
        await createBook(form);
        toast.success('Book added!');
      }
      setShowModal(false);
      fetchBooks();
    } catch { toast.error('Failed to save book'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this book?')) return;
    try {
      await deleteBook(id);
      toast.success('Book deleted');
      fetchBooks();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 fade-up">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)' }}>
            Books
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-dim)' }}>
            Manage your library book catalog
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          + Add Book
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-6 fade-up fade-up-delay-1">
        <input
          className="input-field"
          style={{ maxWidth: '400px' }}
          placeholder="🔍  Search by title or author..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden fade-up fade-up-delay-2"
        style={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--ink-700)' }}>
                {['#', 'Title', 'Author', 'Category', 'ISBN', 'Available', 'Total', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-dim)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-12" style={{ color: 'var(--text-dim)' }}>
                  Loading books...
                </td></tr>
              ) : books.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12" style={{ color: 'var(--text-dim)' }}>
                  No books found
                </td></tr>
              ) : books.map((book, i) => (
                <tr key={book.id} className="table-row-hover"
                  style={{ borderBottom: '1px solid var(--ink-700)' }}>
                  <td className="px-5 py-4 text-sm font-mono" style={{ color: 'var(--text-dim)' }}>{i + 1}</td>
                  <td className="px-5 py-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{book.title}</td>
                  <td className="px-5 py-4 text-sm" style={{ color: 'var(--text-muted)' }}>{book.author}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(245,200,66,0.1)', color: 'var(--gold-400)' }}>
                      {book.category || '—'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs font-mono" style={{ color: 'var(--text-dim)' }}>{book.isbn || '—'}</td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold"
                      style={{ color: book.availableQuantity > 0 ? '#5A9E59' : '#F87171' }}>
                      {book.availableQuantity}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm" style={{ color: 'var(--text-muted)' }}>{book.totalQuantity}</td>
                  <td className="px-5 py-4 flex gap-2">
                    <button onClick={() => openEdit(book)} className="btn-secondary"
                      style={{ padding: '6px 14px', fontSize: '12px' }}>
                      Edit
                    </button>
                    {role === 'ADMIN' && (
                      <button onClick={() => handleDelete(book.id)} className="btn-danger">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg mx-4 rounded-2xl p-6"
            style={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)', boxShadow: '0 32px 64px rgba(0,0,0,0.6)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)' }}>
                {editing ? 'Edit Book' : 'Add New Book'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ color: 'var(--text-dim)' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              {[
                { label: 'Title *', key: 'title', required: true, span: 2 },
                { label: 'Author', key: 'author', span: 1 },
                { label: 'Category', key: 'category', span: 1 },
                { label: 'ISBN', key: 'isbn', span: 1 },
                { label: 'Publisher', key: 'publisher', span: 1 },
                { label: 'Published Year', key: 'publishedYear', span: 1 },
              ].map(({ label, key, required, span }) => (
                <div key={key} className={span === 2 ? 'col-span-2' : ''}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>{label}</label>
                  <input className="input-field" value={(form as any)[key]} required={required}
                    onChange={e => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Total Qty</label>
                <input className="input-field" type="number" min={1} value={form.totalQuantity}
                  onChange={e => setForm({ ...form, totalQuantity: +e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Available Qty</label>
                <input className="input-field" type="number" min={0} value={form.availableQuantity}
                  onChange={e => setForm({ ...form, availableQuantity: +e.target.value })} />
              </div>
              <div className="col-span-2 flex gap-3 mt-2">
                <button type="submit" className="btn-primary flex-1">
                  {editing ? 'Update Book' : 'Add Book'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
