import TenderLotsComponent from "@/components/tender-lots";
import { redirect } from "next/navigation";

export default async function TenderPackagePage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const { id } = await searchParams;

  if (!id) redirect("/404");

  return <TenderLotsComponent tenderPackageId={id} />;
}
