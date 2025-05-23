import { TenderLot } from "@bidpro-frontend/shared";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useTranslations } from "next-intl";

export default function TenderLotBidModal(props: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tenderLot: TenderLot | null;
  price: string | null;
}) {
  const { isOpen, onOpenChange, tenderLot, price } = props;
  const t = useTranslations("TenderLot");

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {tenderLot?.title}
            </ModalHeader>
            <ModalBody>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                pulvinar risus non risus hendrerit venenatis. Pellentesque sit
                amet hendrerit risus, sed porttitor quam.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                pulvinar risus non risus hendrerit venenatis. Pellentesque sit
                amet hendrerit risus, sed porttitor quam.
              </p>
              <p>
                Magna exercitation reprehenderit magna aute tempor cupidatat
                consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                aliqua enim laboris do dolor eiusmod. Et mollit incididunt nisi
                consectetur esse laborum eiusmod pariatur proident Lorem eiusmod
                et. Culpa deserunt nostrud ad veniam.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="ghost" onPress={onClose}>
                {t("actions.close")}
              </Button>
              <Button color="primary" onPress={onClose}>
                {t("actions.bid.label")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
