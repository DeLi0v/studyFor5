import EntityPage from "../components/EntityPage";

export default function Specialties() {
  return (
    <EntityPage
      title="Специальности"
      entityName="specialties"
      columns={[{ field: "Name", label: "Имя" }]}
    />
  );
}
