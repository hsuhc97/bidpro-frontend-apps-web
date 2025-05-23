import TenderPackagesComponent from "@/components/tender-packages";
import { redirect } from "next/navigation";

export default function TenderPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const id = searchParams.id;

  if (!id) redirect("/404");

  return <TenderPackagesComponent tenderId={id} />;
}
