import EntityPage from "../components/EntityPage";

export default function Rooms() {
  return (
    <EntityPage
      title="Кабинеты"
      entityName="rooms"
      columns={[
        { field: "Number", label: "Номер",required: true, },
        { field: "Floor", label: "Этаж", type: "number",required: true, },
      ]}
    />
  );
}
