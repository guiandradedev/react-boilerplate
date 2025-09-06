import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/_auth/activate/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_public/_auth/activate"!</div>
}
