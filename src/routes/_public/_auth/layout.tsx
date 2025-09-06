import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/_auth')({
  component: PublicAuthLayoutComponent,
})

function PublicAuthLayoutComponent() {
  return (
    <div className='max-h-screen py-2 flex-1 items-center justify-center md:py-8 lg:pt-24'>
      <Outlet />
    </div>
  )
}
