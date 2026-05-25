import { Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Admin } from './pages/Admin';
import { AppShell } from './components/AppShell';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';

// Books
import { BookList } from './pages/BookList';
import { BookForm } from './pages/BookForm';
// Members
import { MemberList } from './pages/MemberList';
import { MemberForm } from './pages/MemberForm';
// Loans
import { LoanList } from './pages/LoanList';
import { LoanForm } from './pages/LoanForm';
// Reservations
import { ReservationList } from './pages/ReservationList';
import { ReservationForm } from './pages/ReservationForm';
// Fines
import { FineList } from './pages/FineList';
import { FineForm } from './pages/FineForm';
// Authors
import { AuthorList } from './pages/AuthorList';
import { AuthorForm } from './pages/AuthorForm';
// Publishers
import { PublisherList } from './pages/PublisherList';
import { PublisherForm } from './pages/PublisherForm';
// Categories
import { CategoryList } from './pages/CategoryList';
import { CategoryForm } from './pages/CategoryForm';
// Users
import { UserList } from './pages/UserList';
import { UserForm } from './pages/UserForm';
// Settings
import { SettingList } from './pages/SettingList';
import { SettingForm } from './pages/SettingForm';
// Audit Logs
import { AuditLogList } from './pages/AuditLogList';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected shell */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Books */}
        <Route path="/books" element={<BookList />} />
        <Route path="/books/new" element={<BookForm />} />
        <Route path="/books/:id" element={<BookForm />} />

        {/* Members */}
        <Route path="/members" element={<MemberList />} />
        <Route path="/members/new" element={<MemberForm />} />
        <Route path="/members/:id" element={<MemberForm />} />

        {/* Loans */}
        <Route path="/loans" element={<LoanList />} />
        <Route path="/loans/new" element={<LoanForm />} />
        <Route path="/loans/:id" element={<LoanForm />} />

        {/* Reservations */}
        <Route path="/reservations" element={<ReservationList />} />
        <Route path="/reservations/new" element={<ReservationForm />} />
        <Route path="/reservations/:id" element={<ReservationForm />} />

        {/* Fines */}
        <Route path="/fines" element={<FineList />} />
        <Route path="/fines/new" element={<FineForm />} />
        <Route path="/fines/:id" element={<FineForm />} />

        {/* Authors */}
        <Route path="/authors" element={<AuthorList />} />
        <Route path="/authors/new" element={<AuthorForm />} />
        <Route path="/authors/:id" element={<AuthorForm />} />

        {/* Publishers */}
        <Route path="/publishers" element={<PublisherList />} />
        <Route path="/publishers/new" element={<PublisherForm />} />
        <Route path="/publishers/:id" element={<PublisherForm />} />

        {/* Categories */}
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/categories/new" element={<CategoryForm />} />
        <Route path="/categories/:id" element={<CategoryForm />} />

        {/* Users */}
        <Route path="/users" element={<UserList />} />
        <Route path="/users/new" element={<UserForm />} />
        <Route path="/users/:id" element={<UserForm />} />

        {/* Settings */}
        <Route path="/settings" element={<SettingList />} />
        <Route path="/settings/new" element={<SettingForm />} />
        <Route path="/settings/:id" element={<SettingForm />} />

        {/* Audit Logs */}
        <Route path="/audit-logs" element={<AuditLogList />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
