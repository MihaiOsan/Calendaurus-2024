import React, { useState } from "react";
import { ICalendarEntry } from "../types";
import { EmptySlotButton } from "./EmptySlotButton";
import { PopulatedSlotButton } from "./PopulatedSlotButton";

type SlotProp = {
  details?: ICalendarEntry;
  refetchAllEntries: () => void;
};

export const Slot = (props: SlotProp) => {
  const { details, refetchAllEntries } = props;
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  return !details ? (
    <EmptySlotButton
      openModal={openModal}
      onCloseModal={handleCloseModal}
      handleOpenModal={handleOpenModal}
      refetchAllEntries={refetchAllEntries}
    />
  ) : (
    <PopulatedSlotButton
      details={details}
      handleClickOpenModal={handleOpenModal}
      openModal={openModal}
      handleCloseModal={handleCloseModal}
      refetchAllEntries={refetchAllEntries}
    />
  );
};
