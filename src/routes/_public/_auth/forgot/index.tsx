import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/_auth/forgot/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_public/forgot"!</div>
}
