import EntityPage from "../components/EntityPage";

export default function EventGrades() {
  return (
    <EntityPage
      title="Оценки за события"
      entityName="eventGrades"
      fields={["StudentID", "EventID", "Grade"]}
      relations={{
        students: { field: "StudentID" },
        events: { field: "EventID" },
      }}
      headers={{ StudentID: "Студент", EventID: "Событие", Grade: "Оценка" }}
    />
  );
}
