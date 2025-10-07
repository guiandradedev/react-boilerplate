import Header from '@/components/Header'
import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public')({
  component: PublicLayoutComponent,
})

function PublicLayoutComponent() {
  return (
    <main>
      {/* <SmallBanner /> */}
      <Header />
      <div className="container mx-auto px-4">
        <Outlet />
      </div>
    </main>
  )
}
