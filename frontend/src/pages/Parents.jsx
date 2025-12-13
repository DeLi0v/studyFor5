// TeacherPage.jsx
import EntityPage from "../components/EntityPage";

export default function Parents() {
  return (
    <EntityPage
      title="Родители"
      entityName="parents"
      columns={[
        { field: "FirstName", label: "Имя" },
        { field: "LastName", label: "Фамилия" },
        { field: "MiddleName", label: "Отчество" },
        {
          field: "Phone",
          label: "Телефон",
          type: "phone",
        },
        { field: "Email", label: "Email", type: "email" },
      ]}
    />
  );
}
