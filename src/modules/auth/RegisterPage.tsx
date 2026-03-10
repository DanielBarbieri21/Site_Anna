import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function RegisterPage() {
  const { registerEmail, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)

    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não conferem.')
      return
    }

    try {
      await registerEmail(email, password)
      setInfo(
        'Conta criada com sucesso. Se a confirmação por e-mail estiver ativada, verifique sua caixa de entrada.'
      )
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Não foi possível criar a conta. Verifique os dados ou tente outro e-mail.')
    }
  }

  return (
    <div className="card-surface mx-auto max-w-md space-y-6 p-8">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#9cabca]">
          criar acesso
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#f8efe1]">
          Registrar nova conta
        </h1>
        <p className="text-sm text-[#b2bed6]">
          Crie um acesso seguro para publicar e organizar seus textos dentro do painel.
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
          <label className="text-xs font-medium text-[#9cabca]">Senha</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input-surface w-full rounded-lg px-3 py-2 text-sm outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#9cabca]">Confirmar senha</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="input-surface w-full rounded-lg px-3 py-2 text-sm outline-none"
          />
        </div>

        {error && (
          <p className="text-xs text-red-500" role="alert">
            {error}
          </p>
        )}
        {info && (
          <p className="text-xs text-emerald-400" role="status">
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mysterious-pill mt-2 w-full rounded-full px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.2em] transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <p className="text-xs text-[#9cabca]">
        Já tem uma conta?{' '}
        <Link to="/login" className="font-semibold text-[#f2e6d3] underline-offset-2 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}

