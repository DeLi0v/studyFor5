// TeacherPage.jsx
import EntityPage from "../components/EntityPage";

export default function Parents() {
  return (
    <EntityPage
      title="Родители"
      entityName="parents"
      columns={[
        { field: "FirstName", label: "Имя",required: true, },
        { field: "LastName", label: "Фамилия",required: true, },
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
      ]}
    />
  );
}
