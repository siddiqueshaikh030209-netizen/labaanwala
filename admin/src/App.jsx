import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import MenuManagement from './pages/MenuManagement'
import AddressManagement from './pages/AddressManagement'
import MenuCards from './pages/MenuCards'
import ReviewsManagement from './pages/ReviewsManagement'
import AdminLayout from './components/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="menu" element={<MenuManagement />} />
        <Route path="addresses" element={<AddressManagement />} />
        <Route path="menu-cards" element={<MenuCards />} />
        <Route path="reviews" element={<ReviewsManagement />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
