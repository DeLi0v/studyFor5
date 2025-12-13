import EntityPage from "../components/EntityPage";

export default function Groups() {
  return (
    <EntityPage
      title="Группы"
      entityName="groups"
      fields={["Name", "SpecialtyID"]}
      relations={{ specialties: { field: "SpecialtyID" } }}
      headers={{ Name: "Название", SpecialtyID: "Специальность" }}
    />
  );
}
