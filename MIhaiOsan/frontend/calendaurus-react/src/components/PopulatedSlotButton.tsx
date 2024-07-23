import {
  Box,
  Card,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { ICalendarEntry } from "../types";
import { Delete, Edit, MoreVert } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { EventModal } from "./EventModal";
import { useMsal } from "@azure/msal-react";
import { useMutation } from "react-query";
import { deleteCalendarEntryMutation } from "../api/deleteCalendarEntry";

export type PopulatedButtonProps = {
  details: ICalendarEntry;
  openModal: boolean;
  handleClickOpenModal: () => void;
  handleCloseModal: () => void;
  refetchAllEntries: () => void;
};

export const PopulatedSlotButton = ({
  details,
  openModal,
  handleClickOpenModal,
  handleCloseModal,
  refetchAllEntries,
}: PopulatedButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const { instance } = useMsal();
  const openMenu = Boolean(anchorEl);

  const { mutate: onDelete } = useMutation({
    mutationFn: (id: string) => deleteCalendarEntryMutation(instance, id),
  });

  useEffect(() => {
    if (openModal) {
      setTooltipOpen(false);
    }
  }, [openModal]);

  const handleDelete = (id: string) => {
    onDelete(id, {
      onSuccess: () => {
        refetchAllEntries && refetchAllEntries();
        setAnchorEl(null);
      },
    });
  };

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setTooltipOpen(false);
  };

  const handleCloseMenu = (event: React.MouseEvent<HTMLElement>) => {
    const action = event.currentTarget.textContent;
    if (action === "Edit") {
      handleClickOpenModal();
    } else if (action === "Delete") {
      handleDelete(details.id!);
    }
    setAnchorEl(null);
  };

  const handleType = (type: number | string) => {
    if (type === "0" || type === 0) return "Lecture";
    if (type === "1" || type === 1) return "Lab";
    return "Seminar";
  };

  const handleTypeColor = (type: number | string) => {
    if (type === "0" || type === 0) return "#de2f2f";
    if (type === "1" || type === 1) return "#1976d2";
    return "#d98004";
  };

  const handleCardClick = () => {
    setTooltipOpen((prev) => !prev);
  };

  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="subtitle1">
            {handleType(details.type)}: {details.title}
          </Typography>
          <Typography variant="body2">Location: {details.location}</Typography>
          <Typography variant="body2">Time: {details.timestamp}</Typography>
        </Box>
      }
      arrow
      open={tooltipOpen && !openMenu}
      onClose={() => setTooltipOpen(false)}
      sx={{ bgcolor: "rgba(255, 255, 255, 0.8)", color: "#000" }}
    >
      <Card
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: handleTypeColor(details.type),
          color: "#fff",
          width: "9.4rem",
          height: "3.4rem",
          padding: "0.3rem",
          borderRadius: "8px",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          },
        }}
        onClick={handleCardClick}
      >
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "calc(100% - 2rem)",
          }}
        >
          <Typography variant="button" noWrap>
            {handleType(details.type)}: {details.title}
          </Typography>
          <div />
          <Typography variant="caption" noWrap>
            {details.location}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton
            sx={{
              color: "#fff",
            }}
            onClick={handleClickMenu}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={openMenu}
            onClose={handleCloseMenu}
            onClick={handleCloseMenu}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleCloseMenu}>
              <ListItemIcon>
                <Edit fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleCloseMenu}>
              <ListItemIcon>
                <Delete fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
          <EventModal
            open={openModal}
            onClose={handleCloseModal}
            details={details}
            operationType="updateEntry"
          />
        </Box>
      </Card>
    </Tooltip>
  );
};
