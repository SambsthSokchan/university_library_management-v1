import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
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
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const sendOtp = (username) => api.post('/auth/forgot-password', { username });
export const resetPassword = (data) => api.post('/auth/reset-password', data);

// Books
export const getBooks = () => api.get('/books');
export const searchBooks = (keyword) => api.get(`/books/search?keyword=${keyword}`);
export const createBook = (data) => api.post('/books', data);
export const updateBook = (id, data) => api.put(`/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/books/${id}`);

// Members
export const getMembers = () => api.get('/members');
export const createMember = (data) => api.post('/members', data);
export const updateMember = (id, data) => api.put(`/members/${id}`, data);
export const deleteMember = (id) => api.delete(`/members/${id}`);

// Borrow
export const getBorrows = () => api.get('/borrow');
export const getActiveBorrows = () => api.get('/borrow/active');
export const getOverdueBorrows = () => api.get('/borrow/overdue');
export const borrowBook = (data) =>
api.post('/borrow', data);
export const returnBook = (id) => api.put(`/borrow/${id}/return`);

// Fines
export const getFines = () => api.get('/fines');
export const payFine = (id) => api.put(`/fines/${id}/pay`);

// Thesis Invoice
export const getThesisInvoices = () => api.get('/thesis-invoices');
export const createThesisInvoice = (data) => api.post('/thesis-invoices', data);
export const payThesisInvoice = (id) => api.put(`/thesis-invoices/${id}/pay`);

// Clearance
export const getClearanceRequests = () => api.get('/clearance');
export const createClearanceRequest = (data) => api.post('/clearance', data);
export const approveClearance = (id) => api.put(`/clearance/${id}/approve`);
export const rejectClearance = (id) => api.put(`/clearance/${id}/reject`);

// Income
export const getIncomeTransactions = () => api.get('/income');
export const createIncome = (data) => api.post('/income', data);

// Expense
export const getExpenses = () => api.get('/expenses');
export const createExpense = (data) => api.post('/expenses', data);

// Staff Payouts
export const getStaffPayouts = () => api.get('/staff-payouts');
export const createPayout = (data) => api.post('/staff-payouts', data);
export const approvePayout = (id) => api.post(`/staff-payouts/approve/${id}`);

// Staff Management
export const getStaff = () => api.get('/users');
export const createStaff = (data) => api.post('/users', data);
export const updateStaff = (id, data) => api.put(`/users/${id}`, data);
export const deleteStaff = (id) => api.delete(`/users/${id}`);