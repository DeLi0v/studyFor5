import EntityPage from "../components/EntityPage";

export default function Teachers() {
  return (
    <EntityPage
      title="Должности"
      entityName="positions"
      fields={["Name"]}
      relations={{}}
      headers={{
        Name: "Наименование",
      }}
    />
  );
}
