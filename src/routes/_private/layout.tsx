import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_private')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.href, // Salva a URL anterior para redirect pos login
        },
      })
    }
  }
})