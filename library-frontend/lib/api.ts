import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      Cookies.remove('token');
      Cookies.remove('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// Auth
export const login = (data: { username: string; password: string }) =>
  api.post('/auth/login', data);

// Books
export const getBooks = () => api.get('/books');
export const searchBooks = (keyword: string) => api.get(`/books/search?keyword=${keyword}`);
export const createBook = (data: any) => api.post('/books', data);
export const updateBook = (id: number, data: any) => api.put(`/books/${id}`, data);
export const deleteBook = (id: number) => api.delete(`/books/${id}`);

// Members
export const getMembers = () => api.get('/members');
export const createMember = (data: any) => api.post('/members', data);
export const updateMember = (id: number, data: any) => api.put(`/members/${id}`, data);
export const deleteMember = (id: number) => api.delete(`/members/${id}`);

// Borrow
export const getBorrows = () => api.get('/borrow');
export const getActiveBorrows = () => api.get('/borrow/active');
export const getOverdueBorrows = () => api.get('/borrow/overdue');
export const borrowBook = (data: { bookId: number; memberId: number }) =>
  api.post('/borrow', data);
export const returnBook = (id: number) => api.put(`/borrow/${id}/return`);

// Fines
export const getFines = () => api.get('/fines');
export const payFine = (id: number) => api.put(`/fines/${id}/pay`);

// Thesis Invoice
export const getThesisInvoices = () => api.get('/thesis-invoices');
export const createThesisInvoice = (data: any) => api.post('/thesis-invoices', data);
export const payThesisInvoice = (id: number) => api.put(`/thesis-invoices/${id}/pay`);

// Clearance
export const getClearanceRequests = () => api.get('/clearance');
export const createClearanceRequest = (data: any) => api.post('/clearance', data);
export const approveClearance = (id: number) => api.put(`/clearance/${id}/approve`);
export const rejectClearance = (id: number) => api.put(`/clearance/${id}/reject`);

// Income
export const getIncomeTransactions = () => api.get('/income');
export const createIncome = (data: any) => api.post('/income', data);

// Expense
export const getExpenses = () => api.get('/expenses');
export const createExpense = (data: any) => api.post('/expenses', data);

// Staff Payouts
export const getStaffPayouts = () => api.get('/staff-payouts');
export const createPayout = (data: any) => api.post('/staff-payouts', data);
export const approvePayout = (id: number) => api.post(`/staff-payouts/approve/${id}`);

// Staff Management
export const getStaff = () => api.get('/users');
export const createStaff = (data: any) => api.post('/users', data);
export const updateStaff = (id: number, data: any) => api.put(`/users/${id}`, data);
export const deleteStaff = (id: number) => api.delete(`/users/${id}`);
