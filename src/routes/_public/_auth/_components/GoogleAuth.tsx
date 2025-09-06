import {
  GoogleOAuthProvider,
  GoogleLogin,
} from '@react-oauth/google'
import type { CredentialResponse } from '@react-oauth/google'
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios'

export const Route = createFileRoute(
	'/_public/_auth/_components/GoogleAuth'
)({
	component: GoogleAuth,
});

export function GoogleAuth() {
  const handleLoginSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    const googleToken = credentialResponse.credential

    if (!googleToken) {
      console.error('Token do Google não encontrado.')
      return
    }

    try {
      const response = await axios.post<{
        data: { token: { access_token: string; refresh_token: string } }
      }>('http://localhost:3001/api/auth/social-login', {
        token: googleToken,
        provider: 'Google',
      })

      console.log(response.data.data.token.access_token)
      console.log('Login bem-sucedido!', response.data)
    } catch (error) {
      console.error('Erro ao fazer login:', error)
    }
  }

  // Em Vite, use import.meta.env para variáveis de ambiente
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  if (!googleClientId) {
    console.error('VITE_GOOGLE_CLIENT_ID não foi definida no arquivo .env')
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