// TeacherPage.jsx
import EntityPage from "../components/EntityPage";

export default function Lessons() {
  return (
    <EntityPage
      title="Уроки"
      entityName="lessons"
      columns={[
        {
          field: "GroupID",
          label: "Класс",
          options: "groups",
          type: "select",
        },
        {
          field: "SubjectID",
          label: "Предмет",
          options: "subjects",
          type: "select",
        },
        {
          field: "TeacherID",
          label: "Учитель",
          options: "teachers",
          type: "select",
        },
        {
          field: "RoomID",
          label: "Кабинет",
          options: "rooms",
          type: "select",
        },
        {
          field: "Weekday",
          label: "День недели",
          type: "select",
          options: [
            { value: 1, label: "Понедельник" },
            { value: 2, label: "Вторник" },
            { value: 3, label: "Среда" },
            { value: 4, label: "Четверг" },
            { value: 5, label: "Пятница" },
            { value: 6, label: "Суббота" },
            { value: 7, label: "Воскресенье" },
          ],
        },
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
        { field: "EndDate", label: "Дата завершения", type: "date" },
      ]}
    />
  );
}
