import { Route, Routes, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HomePage } from '../home/HomePage'
import { PostPage } from '../posts/PostPage'
import { AuthorPage } from '../authors/AuthorPage'
import { CategoryPage } from '../categories/CategoryPage'
import { LoginPage } from '../auth/LoginPage'
import { DashboardPage } from '../dashboard/DashboardPage'
import { Layout } from '../../shared/Layout'
import { AuthProvider } from '../auth/AuthContext'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export function App() {
  const location = useLocation()

  return (
    <AuthProvider>
      <Layout>
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="container-page py-10"
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/autor/:id" element={<AuthorPage />} />
            <Route path="/categoria/:slug" element={<CategoryPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </motion.main>
      </Layout>
    </AuthProvider>
  )
}

