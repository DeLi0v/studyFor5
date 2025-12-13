import EntityPage from "../components/EntityPage";

export default function EventGrades() {
  return (
    <EntityPage
      title="Оценки за события"
      entityName="eventGrades"
      columns={[
        {
          field: "StudentID",
          label: "Ученик",
          options: "students",
          displayField: "ProductName",
        },
        { field: "EventID", label: "Мероприятие", options: "events" },
        { field: "Score", label: "Оценка" },
        { field: "DateGiven", label: "Дата" },
      ]}
    />
  );
}
