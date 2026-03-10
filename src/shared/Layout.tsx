import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../modules/auth/AuthContext'

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen text-[#ece8df]">
      <header className="sticky top-0 z-30 border-b border-slate-700/60 bg-[#090d16]/85 backdrop-blur-xl">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-4">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="mysterious-pill rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em]">
              contos & poesias
            </span>
            <span className="text-xl font-semibold tracking-tight text-[#f8f2e8]">
              Contos de Anna
            </span>
          </Link>

          <nav className="flex flex-wrap items-center justify-end gap-2 text-xs sm:gap-4 sm:text-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `rounded-full px-2.5 py-1.5 transition ${
                  isActive
                    ? 'bg-[#6a738f2e] font-medium text-[#f2eadc]'
                    : 'text-[#b9c3d9] hover:text-[#f2eadc]'
                }`
              }
            >
              Início
            </NavLink>
            <NavLink
              to="/categoria/contos"
              className={({ isActive }) =>
                `rounded-full px-2.5 py-1.5 transition ${
                  isActive
                    ? 'bg-[#6a738f2e] font-medium text-[#f2eadc]'
                    : 'text-[#b9c3d9] hover:text-[#f2eadc]'
                }`
              }
            >
              Contos
            </NavLink>
            <NavLink
              to="/categoria/poesias"
              className={({ isActive }) =>
                `rounded-full px-2.5 py-1.5 transition ${
                  isActive
                    ? 'bg-[#6a738f2e] font-medium text-[#f2eadc]'
                    : 'text-[#b9c3d9] hover:text-[#f2eadc]'
                }`
              }
            >
              Poesias
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `rounded-full px-2.5 py-1.5 transition ${
                  isActive
                    ? 'bg-[#6a738f2e] font-medium text-[#f2eadc]'
                    : 'text-[#b9c3d9] hover:text-[#f2eadc]'
                }`
              }
            >
              Dashboard
            </NavLink>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-slate-600/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.13em] text-[#d3dcee]">
                  {user.email ?? 'logado'}
                </span>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="rounded-full border border-rose-500/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.13em] text-rose-200 transition hover:border-rose-400"
                >
                  Sair
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="mysterious-pill rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] transition hover:brightness-110"
              >
                Entrar
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      <motion.div>{children}</motion.div>

      <footer className="mt-16 border-t border-slate-700/60 py-6 text-xs text-[#a6b0c7]">
        <div className="container-page flex flex-wrap items-center justify-between gap-3">
          <span>&copy; {new Date().getFullYear()} Contos e Poesias de Anna</span>
          <span className="text-[11px] text-[#7f8ca9]">
            Feito com React e Supabase
          </span>
        </div>
      </footer>
    </div>
  )
}

