import {
  ChevronLeft,
  ChevronRight,
  Logout,
  Settings,
  Search,
  Download,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EventModal } from "./EventModal";
import { useMsal } from "@azure/msal-react";
import { getUser } from "../utils";
import { downloadIcal } from "../api/getIcal";

export type HeaderProps = {
  changeWeek: (direction: string) => void;
  refetchAllEntries: () => void;
  handleSearch: (terms: string[]) => void;
};

export const Header = (props: HeaderProps) => {
  const { instance } = useMsal();
  const { changeWeek, refetchAllEntries, handleSearch } = props;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [searchField, setSearchField] = useState("");
  const [searchType, setSearchType] = useState("");

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = (event: any) => {
    setOpenModal(false);
  };

  const handleFieldChange = (e: any) => {
    setSearchField(e.target.value);
  };

  const handleSearchTypeChange = (e: any) => {
    setSearchType(e.target.value);
  };

  useEffect(() => {
    handleSearch([searchField, searchType]);
  }, [searchField, searchType, handleSearch]);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDownloadIcal = async () => {
    try {
      await downloadIcal(instance);
    } catch (error) {
      console.error("Error downloading iCal file", error);
    }
  };

  const handleClose = (event: any) => {
    setAnchorEl(null);
    if (event.currentTarget.textContent === "SignOut") {
      //navigate("/");
      instance.logoutPopup({
        postLogoutRedirectUri: "/",
        mainWindowRedirectUri: "/",
      });
      sessionStorage.clear();
    } else if (event.currentTarget.textContent === "Download iCal") {
      handleDownloadIcal();
    }
  };

  return (
    <Box style={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
      <Box style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <Button
          variant="outlined"
          onClick={() => {
            changeWeek("previous");
          }}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            changeWeek("next");
          }}
        >
          <ChevronRight />
        </Button>
        <TextField
          variant="outlined"
          placeholder="Search"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ marginLeft: 2 }}
          value={searchField}
          onChange={handleFieldChange}
        />
        <FormControl
          variant="outlined"
          size="small"
          sx={{ marginLeft: 2, width: "7rem" }}
        >
          <InputLabel>Type</InputLabel>
          <Select
            label="Type"
            value={searchType}
            onChange={handleSearchTypeChange}
          >
            <MenuItem value={""}>ANY</MenuItem>
            <MenuItem value={"0"}>LECTURE</MenuItem>
            <MenuItem value={"1"}>LAB</MenuItem>
            <MenuItem value={"2"}>SEMINAR</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box style={{ display: "flex", gap: 5 }}>
        <Button
          variant="outlined"
          onClick={() => {
            changeWeek("today");
          }}
        >
          TODAY
        </Button>
        <Button variant="contained" onClick={handleOpenModal}>
          New Event
        </Button>
        <EventModal
          open={openModal}
          onClose={handleCloseModal}
          refetchAllEntries={refetchAllEntries}
        />
        <IconButton onClick={handleClick}>
          <Settings />
        </IconButton>
      </Box>
      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        <MenuItem onClick={handleClose}>{getUser()}</MenuItem>
        <MenuItem onClick={handleClose}>Download iCal</MenuItem>
        <MenuItem onClick={handleClose}>
          <Logout />
          SignOut
        </MenuItem>
      </Menu>
    </Box>
  );
};
