import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  FormControlLabel,
} from "@mui/material";
import { StaticDateTimePicker } from "@mui/x-date-pickers";
import React, { useState } from "react";
import { useMutation } from "react-query";
import {
  postCalendarEntryMutation,
  postRecurringCalendarEntryMutation,
} from "../api/postCalendarEntry";
import { ICalendarEntry } from "../types";
import { useMsal } from "@azure/msal-react";
import dayjs from "dayjs";
import { putCalendarEntryMutation } from "../api/putCalendarEntry";

type EventModalProps = {
  open: boolean;
  details?: ICalendarEntry;
  operationType?: string;
  onClose: (e?: any) => void;
  refetchAllEntries?: () => void;
};

export const EventModal = (props: EventModalProps) => {
  const { open, details, operationType, onClose, refetchAllEntries } = props;
  const { instance } = useMsal();
  const editMode = !!details;

  const [activityType, setActivityType] = useState(
    editMode ? details.type : "0"
  );
  const [title, setTitle] = useState(editMode ? details.title : "");
  const [location, setLocation] = useState(editMode ? details.location : "");
  const [selectedDateTime, setSelectedDateTime] = useState(
    editMode ? details.timestamp : new Date().toISOString()
  );
  const [endTime, setEndTime] = useState(
    editMode ? details.endTime : dayjs().add(2, "hour").toISOString()
  );

  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState("weekly");
  const [recurrenceCount, setRecurrenceCount] = useState(2);

  const handleClose = (e: any) => {
    onClose(e);
    setIsRecurring(false);
    setRecurrenceCount(2);
    setRecurrenceType("weekly");
  };

  const { data, mutate: onPost } = useMutation({
    mutationFn: (entry: ICalendarEntry) =>
      isRecurring
        ? postRecurringCalendarEntryMutation(
            instance,
            entry,
            recurrenceType,
            recurrenceCount
          )
        : postCalendarEntryMutation(instance, entry),
  });

  const { data: editData, mutate: onPut } = useMutation({
    mutationFn: (entry: ICalendarEntry) =>
      putCalendarEntryMutation(instance, details?.id!, entry),
  });

  const handleTitleChange = (e: any) => {
    setTitle(e.target.value);
  };

  const handleLocationChange = (e: any) => {
    setLocation(e.target.value);
  };

  const handleTypeChange = (e: any) => {
    setActivityType(e.target.value);
  };

  const handleDateTimeChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const newDate = dayjs(date).minute(0).second(0);
      setSelectedDateTime(newDate.toISOString());
      setEndTime(newDate.add(2, "hour").toISOString());
    }
  };

  const handleRecurrenceTypeChange = (e: any) => {
    setRecurrenceType(e.target.value);
  };

  const handleRecurrenceCountChange = (e: any) => {
    setRecurrenceCount(e.target.value);
  };

  const handleSubmit = async () => {
    const newDate = new Date().toISOString();
    const newEntry: ICalendarEntry = {
      title: title,
      type: activityType,
      location: location,
      timestamp: selectedDateTime,
      endTime: endTime,
      createdTimeUtc: newDate,
      updatedTimeUtc: newDate,
    };

    if (!editMode) {
      onPost(newEntry, {
        onSuccess: () => {
          refetchAllEntries && refetchAllEntries();
          handleClose(true);
        },
      });
    } else {
      newEntry.id = details.id;
      newEntry.createdTimeUtc = details.createdTimeUtc;
      newEntry.userId = details.userId;
      onPut(newEntry, {
        onSuccess: () => {
          refetchAllEntries && refetchAllEntries();
          handleClose(true);
        },
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{editMode ? "Edit event" : "Create new event"}</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "row", columnGap: "10px" }}
      >
        <Box display={"flex"} flexDirection={"column"} gap={2}>
          <TextField
            label="Title"
            variant="standard"
            value={title}
            onChange={handleTitleChange}
          />

          <FormControl>
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              value={activityType}
              onChange={handleTypeChange}
            >
              <MenuItem value={0}>LECTURE</MenuItem>
              <MenuItem value={1}>LAB</MenuItem>
              <MenuItem value={2}>SEMINAR</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Location"
            variant="standard"
            value={location}
            onChange={handleLocationChange}
          />

          {!editMode && (
            <FormControlLabel
              control={
                <Switch
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  name="recurrence"
                  color="primary"
                />
              }
              label="Recurring Event"
            />
          )}

          {isRecurring && !editMode && (
            <>
              <FormControl>
                <InputLabel>Recurrence Type</InputLabel>
                <Select
                  label="Recurrence Type"
                  value={recurrenceType}
                  onChange={handleRecurrenceTypeChange}
                >
                  <MenuItem value={"weekly"}>Weekly</MenuItem>
                  <MenuItem value={"biweekly"}>Every Other Week</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Number of Occurrences"
                variant="standard"
                type="number"
                value={recurrenceCount}
                onChange={handleRecurrenceCountChange}
              />
            </>
          )}
        </Box>
        <StaticDateTimePicker
          ampm={false}
          views={["day", "hours"]}
          slotProps={{
            toolbar: { hidden: true },
            actionBar: () => ({ actions: [] }),
          }}
          sx={{
            ".MuiTimeClock-root": {
              marginTop: "2rem",
            },
            ".MuiDateCalendar-root": {
              marginTop: "2rem",
            },
          }}
          value={dayjs(selectedDateTime)}
          onChange={handleDateTimeChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {editMode ? "Save changes" : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
