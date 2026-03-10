import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function LoginPage() {
  const { loginEmail, loginGoogle, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await loginEmail(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Não foi possível entrar. Verifique os dados.')
      console.error(err)
    }
  }

  async function handleGoogle() {
    setError(null)
    try {
      await loginGoogle()
      navigate('/dashboard')
    } catch (err) {
      setError('Não foi possível entrar com o Google.')
      console.error(err)
    }
  }

  return (
    <div className="card-surface mx-auto max-w-md space-y-6 p-8">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#9cabca]">
          acesso do autor
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#f8efe1]">
          Entrar para publicar
        </h1>
        <p className="text-sm text-[#b2bed6]">
          Use seu e-mail ou conta Google para acessar o painel de criação de
          textos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#9cabca]">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input-surface w-full rounded-lg px-3 py-2 text-sm outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#9cabca]">
            Senha
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input-surface w-full rounded-lg px-3 py-2 text-sm outline-none"
          />
        </div>

        {error && (
          <p className="text-xs text-red-500" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mysterious-pill mt-2 w-full rounded-full px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.2em] transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="flex items-center gap-3 text-[11px] text-[#9cabca]">
        <div className="h-px flex-1 bg-slate-700" />
        <span>ou continue com</span>
        <div className="h-px flex-1 bg-slate-700" />
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-600/70 bg-[#0d1627c0] px-4 py-2.5 text-xs font-medium tracking-wide text-[#d9e2f2] transition hover:border-[#baa78c91]"
      >
        <span>Continuar com Google</span>
      </button>
    </div>
  )
}

