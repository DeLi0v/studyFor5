import EntityPage from "../components/EntityPage";

export default function EventParticipants() {
  return (
    <EntityPage
      title="Участники событий"
      entityName="event-participants"
      fields={["StudentID", "EventID"]}
      relations={{
        students: { field: "StudentID" },
        events: { field: "EventID" },
      }}
      headers={{ StudentID: "Студент", EventID: "Событие" }}
    />
  );
}
