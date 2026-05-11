import { redirect } from "next/navigation";

/**
 * Legacy route — redirects to canonical invoice URL
 * /payments/invoice/[id] → /payments/[id]/invoice
 * @deprecated use /payments/[id]/invoice instead
 */
export default async function PaymentInvoiceLegacyRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/payments/${id}/invoice`);
}