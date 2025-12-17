// Events.jsx
import EntityPage from "../components/EntityPage";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";

const EVENT_TYPES = [
  { value: "event", label: "Событие" },
  { value: "testing", label: "Тестирование" },
];

export default function Events() {
  return (
    <EntityPage
      title="События"
      entityName="events"
      columns={[
        { field: "Name", label: "Наименование", required: true },
        { field: "Description", label: "Описание" },
        {
          field: "RoomID",
          label: "Кабинет",
          type: "select",
          options: "rooms",
          displayTemplate: "{Number}",
        },
        { field: "EventDate", label: "Дата проведения", type: "date", required: true },
        {
          field: "TimeStart",
          label: "Время начала",
          type: "time",
          format: (value) => value ? String(value).substring(0, 5) : "-",
        },
        {
          field: "TimeEnd",
          label: "Время окончания",
          type: "time",
          format: (value) => value ? String(value).substring(0, 5) : "-",
        },
      ]}
    />
  );
}