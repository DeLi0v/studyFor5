import EntityPage from "../components/EntityPage";

export default function Rooms() {
  return (
    <EntityPage
      title="Кабинеты"
      entityName="rooms"
      columns={[
        { field: "Number", label: "Номер" },
        { field: "Floor", label: "Этаж", type: "number" },
      ]}
    />
  );
}
