import TenderLotsComponent from "@/components/tender-lots";
import { redirect } from "next/navigation";

export default function TenderPackagePage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const id = searchParams.id;

  if (!id) redirect("/404");

  return <TenderLotsComponent tenderPackageId={id} />;
}
