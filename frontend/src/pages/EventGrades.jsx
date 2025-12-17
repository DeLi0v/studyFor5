import EntityPage from "../components/EntityPage";

export default function EventGrades() {
  return (
    <EntityPage
      title="Оценки за события"
      entityName="eventGrades"
      columns={[
        {
          field: "ParticipantID",
          label: "Участник",
          type: "select",
          options: "students",
          required: true,
          displayField: "FirstName",
          displayTemplate: "{LastName} {FirstName} {MiddleName}",
        },
        {
          field: "EventID",
          label: "Мероприятие",
          type: "select",
          options: "events",
          required: true,
          displayField: "Name",
        },
        {
          field: "Score",
          label: "Оценка",
          type: "number",
          required: true,
        },
        {
          field: "DateGiven",
          label: "Дата",
          type: "date",
          required: true,
        },
      ]}
    />
  );
}