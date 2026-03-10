import { Route, Routes, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HomePage } from '../home/HomePage'
import { PostPage } from '../posts/PostPage'
import { AuthorPage } from '../authors/AuthorPage'
import { CategoryPage } from '../categories/CategoryPage'
import { LoginPage } from '../auth/LoginPage'
import { AboutPage } from '../about/AboutPage'
import { AboutEditPage } from '../about/AboutEditPage'
import { BuscaPage } from '../busca/BuscaPage'
import { MusicaPage } from '../secoes/MusicaPage'
import { FotosPage } from '../secoes/FotosPage'
import { VideosPage } from '../secoes/VideosPage'
import { RegisterPage } from '../auth/RegisterPage'
import { DashboardPage } from '../dashboard/DashboardPage'
import { DashboardSecoesPage } from '../dashboard/DashboardSecoesPage'
import { Layout } from '../../shared/Layout'
import { AuthProvider } from '../auth/AuthContext'
import { NotFoundPage } from './NotFoundPage'

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
            <Route path="/post/:idOrSlug" element={<PostPage />} />
            <Route path="/autor/:id" element={<AuthorPage />} />
            <Route path="/categoria/:slug" element={<CategoryPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registrar" element={<RegisterPage />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/sobre/editar" element={<AboutEditPage />} />
            <Route path="/busca" element={<BuscaPage />} />
            <Route path="/musica" element={<MusicaPage />} />
            <Route path="/fotos" element={<FotosPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/secoes" element={<DashboardSecoesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </motion.main>
      </Layout>
    </AuthProvider>
  )
}

