import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/orders')({
  component: () => <div className="p-4">Gerenciamento de Pedidos (Em breve)</div>,
});
