import TenderPackagesComponent from "@/components/tender-packages";
import { redirect } from "next/navigation";

export default async function TenderPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const { id } = await searchParams;

  if (!id) redirect("/404");

  return <TenderPackagesComponent tenderId={id} />;
}
