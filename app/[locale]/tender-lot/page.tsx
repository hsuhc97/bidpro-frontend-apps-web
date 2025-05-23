import TenderLotComponent from "@/components/tender-lot";
import { redirect } from "next/navigation";

export default function TenderLotPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const id = searchParams.id;

  if (!id) redirect("/404");

  return <TenderLotComponent tenderLotId={id} />;
}
