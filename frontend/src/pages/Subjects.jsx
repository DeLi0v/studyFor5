import EntityPage from "../components/EntityPage";

export default function Subjects() {
  return (
    <EntityPage
      title="Предметы"
      entityName="subjects"
      columns={[{ field: "Name", label: "Имя" }]}
    />
  );
}
