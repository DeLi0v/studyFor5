import EntityPage from "../components/EntityPage";

export default function Teachers() {
  return (
    <EntityPage
      title="Учителя"
      entityName="teachers"
      columns={[
        { field: "FirstName", label: "Имя", required: true },
        { field: "LastName", label: "Фамилия", required: true },
        { field: "MiddleName", label: "Отчество" },
        {
          field: "Phone",
          label: "Телефон",
          type: "phone",
          mask: "+7 (###) ###-##-##",
          displayMask: "+7 (###) ###-##-##",
          required: true,
        },
        { field: "Email", label: "Email", type: "email" },
        {
          field: "PositionID",
          label: "Должность",
          options: "positions",
          type: "select",
          required: true,
        },
        {
          field: "SpecialtyID",
          label: "Специальность",
          options: "specialties",
          type: "select",
          required: true,
        },
      ]}
      relations={{
        positions: { field: "PositionID" },
        specialties: { field: "SpecialtyID" },
      }}
    />
  );
}