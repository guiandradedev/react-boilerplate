import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/_auth')({
  component: PublicAuthLayoutComponent,
  beforeLoad: ({ context, }) => {
      if (context.auth.isAuthenticated) {
        throw redirect({
          to: '/dashboard',
        })
      }
    },
})

function PublicAuthLayoutComponent() {
  return (
    <div className='max-h-screen py-2 flex-1 items-center justify-center md:py-8 lg:pt-24'>
      <Outlet />
    </div>
  )
}
