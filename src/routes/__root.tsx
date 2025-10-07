import { Outlet, createRootRoute, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'
import { useAuth, type AuthContextProps } from '@/contexts/AuthContext'

// import Header from '../components/Header'

type RouteContexts = {
  auth: AuthContextProps
}

export const Route = createRootRouteWithContext<RouteContexts>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      {/* <Header /> */}
      <Outlet />
      <TanstackDevtools
        config={{
          position: 'bottom-left',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}