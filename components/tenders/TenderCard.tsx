import { Tender } from "@bidpro-frontend/shared";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Link,
  Spinner,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function TenderCard(tender: Tender) {
  const t = useTranslations("Tender");
  const router = useRouter();

  return (
    <Card
      className="w-[400px] border-[1px] border-gray-200"
      shadow="none"
      isPressable
      onPress={() => {
        const locale = window.location.pathname.split("/")[1];
        router.push(`/${locale}/tender?id=${tender.id}`);
      }}
    >
      <CardHeader className="flex gap-3">
        <Image
          alt="logo"
          height={40}
          radius="sm"
          src={tender.image}
          width={40}
        />
        <div className="flex flex-col items-start gap-1">
          <p className="font-medium">{tender.name}</p>
          <p className="font-extralight text-sm">{tender.description}</p>
        </div>
      </CardHeader>
      <Divider className="bg-gray-100" />
      <CardBody>
        {tender.numberOfProcessingLots > 0 && (
          <p className="text-primary font-light">
            {t("number-of-processing-lots", {
              count: tender.numberOfProcessingLots,
            })}
          </p>
        )}
        {tender.numberOfProcessingLots === 0 && (
          <p className="font-extralight">{t("no-processing-lots")}</p>
        )}
      </CardBody>
    </Card>
  );
}
