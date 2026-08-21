import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/coupons')({
  component: () => <div className="p-4">Gerenciamento de Cupons (Em breve)</div>,
});
