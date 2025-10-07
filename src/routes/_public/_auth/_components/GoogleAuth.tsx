import { useAuth } from '@/contexts/AuthContext';
import {
  GoogleOAuthProvider,
  GoogleLogin,
} from '@react-oauth/google'
import type { CredentialResponse } from '@react-oauth/google'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import axios from 'axios'

export const Route = createFileRoute(
  '/_public/_auth/_components/GoogleAuth'
)({
  component: GoogleAuth,
});

export function GoogleAuth() {
  const { googleAuth } = useAuth()
  const navigate = useNavigate()
  const handleLoginSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    const googleToken = credentialResponse.credential

    if (!googleToken) {
      console.error('Token do Google não encontrado.')
      return
    }

    try {
      await googleAuth(googleToken)
      const params = new URLSearchParams(window.location.search)
      const redirect_url = params.get('redirect')

      if (redirect_url) {
        try {
          // normaliza e valida origem (protege contra open redirect)
          const target = new URL(redirect_url, window.location.origin)
          if (target.origin === window.location.origin) {
            // navega cliente-side preservando search/hash
            console.log("Navigate2?")
            navigate({ to: target.pathname + target.search + target.hash })
            return
          }
        } catch (e) {
          // URL inválida => ignora e segue para dashboard
          navigate({ to: '/dashboard' })
        }
      }

      console.log("Navigate?")

      // sem redirect válido, vai para o dashboard
      navigate({ to: '/dashboard' })

    } catch (error) {
      alert("Erro ao logar")
    }
  }

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  if (!googleClientId) {
    console.error('GOOGLE_CLIENT_ID não foi definida no arquivo .env')
    return <div>Google Client ID não configurado.</div>
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => console.error('Erro no login')}
        />
      </div>
    </GoogleOAuthProvider>
  )
}