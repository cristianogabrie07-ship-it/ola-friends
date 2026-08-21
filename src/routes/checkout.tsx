import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
});

function CheckoutPage() {
  return <div>Checkout Page</div>;
}
