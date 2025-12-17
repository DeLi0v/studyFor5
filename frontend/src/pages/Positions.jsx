import EntityPage from "../components/EntityPage";

export default function Positions() {
  return (
    <EntityPage
      title="Должности"
      entityName="positions"
      columns={[{ field: "Name", label: "Наименование",required: true, }]}
    />
  );
}
