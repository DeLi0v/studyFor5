// TeacherPage.jsx
import EntityPage from "../components/EntityPage";

export default function Events() {
  return (
    <EntityPage
      title="События"
      entityName="events"
      columns={[
        { field: "Type", label: "Тип" },
        { field: "Name", label: "Наименование" },
        { field: "Description", label: "Описание" },
        {
          field: "RoomID",
          label: "Кабинет",
          options: "rooms",
          type: "select",
          displayTemplate: "{Number}"
        },
        { field: "EventDate", label: "Дата проведения", type: "date" },
        {
          field: "TimeStart",
          label: "Время начала",
          type: "time",
          format: (value) => {
            if (!value) return "-";
            // Преобразуем "14:30:00" в "14:30"
            return String(value).substring(0, 5);
          },
        },
        {
          field: "TimeEnd",
          label: "Время окончания",
          type: "time",
          format: (value) => {
            if (!value) return "-";
            return String(value).substring(0, 5);
          },
        },
      ]}
    />
  );
}
