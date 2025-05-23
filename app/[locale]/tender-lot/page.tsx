import TenderLotComponent from "@/components/tender-lot";
import { redirect } from "next/navigation";

export default async function TenderLotPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const { id } = await searchParams;

  if (!id) redirect("/404");

  return <TenderLotComponent tenderLotId={id} />;
}
