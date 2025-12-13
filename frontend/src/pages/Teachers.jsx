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
        { field: "Phone", label: "Телефон" },
        { field: "Email", label: "Email" },
        { field: "PositionID", label: "Должность" },
        { field: "SpecialtyID", label: "Специальность" },
      ]}
      relations={{
        positions: {
          field: "PositionID",
          displayField: "Name",
          displayFieldInTable: "Name", // Поле для отображения в таблице
        },
        specialties: {
          field: "SpecialtyID",
          displayField: "Name",
          displayFieldInTable: "Name", // Поле для отображения в таблице
        },
      }}
    />
  );
}
