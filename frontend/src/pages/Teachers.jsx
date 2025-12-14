// TeacherPage.jsx
import EntityPage from "../components/EntityPage";

export default function Teachers() {
  return (
    <EntityPage
      title="Учителя"
      entityName="teachers"
      columns={[
        { field: "FirstName", label: "Имя" },
        { field: "LastName", label: "Фамилия" },
        { field: "MiddleName", label: "Отчество" },
        {
          field: "Phone",
          label: "Телефон",
          type: "phone",
          displayMask: "+7 (###) ###-##-##",
        },
        { field: "Email", label: "Email", type: "email" },
        {
          field: "PositionID",
          label: "Должность",
          options: "positions",
          type: "select",
        },
        {
          field: "SpecialtyID",
          label: "Специальность",
          options: "specialties",
          type: "select",
        },
      ]}
      relations={{
        positions: {
          field: "PositionID",
        },
        specialties: {
          field: "SpecialtyID",
        },
      }}
    />
  );
}
