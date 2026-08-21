import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/products')({
  component: () => <div className="p-4">Gerenciamento de Produtos (Em breve)</div>,
});
