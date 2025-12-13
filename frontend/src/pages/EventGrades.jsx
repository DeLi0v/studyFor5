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
          displayField: "FirstName",
          format: (value, item, relatedData) => {
            const res = relatedData.students?.find((e) => e.ID === value);
            if (!res) return "-";
            return `${res.LastName} ${res.FirstName} ${res.MiddleName}`;
          },
        },
        { field: "EventID", label: "Мероприятие", options: "events" },
        { field: "Score", label: "Оценка" },
        { field: "DateGiven", label: "Дата" },
      ]}
      relations={{
        students: {
          field: "StudentID",
          displayField: "FirstName",
          displayFieldInTable: "FirstName",
        },
      }}
    />
  );
}
