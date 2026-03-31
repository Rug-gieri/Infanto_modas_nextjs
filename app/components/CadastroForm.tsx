'use client'

import { useState, FormEvent } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function CadastroForm() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [newsletter, setNewsletter] = useState(true)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return digits
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          telefone: telefone.replace(/\D/g, ''),
          aceita_newsletter: newsletter,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Erro ao cadastrar.')
        return
      }

      setStatus('success')
      setMessage(data.message || 'Cadastro realizado!')
      setNome('')
      setEmail('')
      setTelefone('')
      setNewsletter(true)
    } catch {
      setStatus('error')
      setMessage('Erro de conexão. Tente novamente.')
    }
  }

  return (
    <form className="cadastro-form" onSubmit={handleSubmit} id="cadastro-form">
      {/* Decorative corner elements */}
      <div className="form-corner form-corner-tl" />
      <div className="form-corner form-corner-br" />

      <div className="form-group">
        <label htmlFor="cadastro-nome">
          <span className="label-icon">👤</span> Nome completo
        </label>
        <input
          id="cadastro-nome"
          type="text"
          placeholder="Ex: Maria Silva"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          maxLength={100}
          autoComplete="name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="cadastro-email">
          <span className="label-icon">✉️</span> E-mail
        </label>
        <input
          id="cadastro-email"
          type="email"
          placeholder="Ex: maria@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={150}
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="cadastro-telefone">
          <span className="label-icon">📱</span> Telefone{' '}
          <span className="label-optional">(opcional)</span>
        </label>
        <input
          id="cadastro-telefone"
          type="tel"
          placeholder="(69) 99999-9999"
          value={telefone}
          onChange={(e) => setTelefone(formatPhone(e.target.value))}
          autoComplete="tel"
        />
      </div>

      <div className="form-group form-checkbox-group">
        <label className="checkbox-label" htmlFor="cadastro-newsletter">
          <input
            id="cadastro-newsletter"
            type="checkbox"
            checked={newsletter}
            onChange={(e) => setNewsletter(e.target.checked)}
          />
          <span className="checkbox-custom" />
          <span>
            Quero receber novidades e promoções por e-mail 💌
          </span>
        </label>
      </div>

      <button
        type="submit"
        className="btn btn-primary cadastro-submit"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <>
            <span className="spinner" /> Enviando...
          </>
        ) : (
          <>✨ Cadastrar</>
        )}
      </button>

      {message && (
        <div
          className={`cadastro-message ${
            status === 'success' ? 'msg-success' : 'msg-error'
          }`}
        >
          {status === 'success' ? '🎉' : '⚠️'} {message}
        </div>
      )}
    </form>
  )
}
