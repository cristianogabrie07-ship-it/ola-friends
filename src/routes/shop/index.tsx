import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/shop/')({
  component: ShopPage,
});

function ShopPage() {
  return <div>Shop Page</div>;
}
