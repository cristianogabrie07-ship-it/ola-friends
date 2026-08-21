import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/product/$id')({
  component: ProductPage,
});

function ProductPage() {
  return <div>Product Page</div>;
}
