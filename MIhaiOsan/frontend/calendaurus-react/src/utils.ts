import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getDayHour = (isoString: string) => {
  const localDate = dayjs(isoString).tz(dayjs.tz.guess());
  const day = localDate.format("Do MMMM");
  const hour = localDate.hour();
  return { day, hour };
};

export const getUser = () => {
  const storedUser = sessionStorage.getItem("user");
  const serializedUser = storedUser !== null ? JSON.parse(storedUser) : {};
  const name = serializedUser !== null ? serializedUser.name : "";
  return name;
};
