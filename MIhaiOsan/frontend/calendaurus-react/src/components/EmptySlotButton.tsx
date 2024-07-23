import { Add } from "@mui/icons-material";
import { Card, IconButton } from "@mui/material";
import { EventModal } from "./EventModal";

type EmptySlotProps = {
  openModal: boolean;
  onCloseModal: () => void;
  handleOpenModal: () => void;
  refetchAllEntries: () => void;
};

export const EmptySlotButton = ({
  openModal,
  onCloseModal,
  handleOpenModal,
  refetchAllEntries,
}: EmptySlotProps) => {
  return (
    <Card
      sx={{
        border: "1px #1976d2",
        backgroundColor: "transparent",
        width: "10rem",
        height: "4rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <IconButton
        sx={{
          color: "#1976d2",
          fontSize: "1.5rem",
        }}
        onClick={handleOpenModal}
      >
        <Add fontSize="inherit" />
      </IconButton>
      <EventModal
        open={openModal}
        onClose={onCloseModal}
        refetchAllEntries={refetchAllEntries}
      />
    </Card>
  );
};
