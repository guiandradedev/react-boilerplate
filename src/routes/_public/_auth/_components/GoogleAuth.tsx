import { useAuth } from '@/contexts/AuthContext';
import {
  GoogleOAuthProvider,
  GoogleLogin,
} from '@react-oauth/google'
import type { CredentialResponse } from '@react-oauth/google'
import { createFileRoute, redirect } from '@tanstack/react-router';
import axios from 'axios'

export const Route = createFileRoute(
  '/_public/_auth/_components/GoogleAuth'
)({
  component: GoogleAuth,
});

export function GoogleAuth() {
  const { googleAuth } = useAuth()
  const handleLoginSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    const googleToken = credentialResponse.credential

    if (!googleToken) {
      console.error('Token do Google não encontrado.')
      return
    }

    try {
      googleAuth(googleToken)
    } catch(error) {
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