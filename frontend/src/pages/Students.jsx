// TeacherPage.jsx
import EntityPage from "../components/EntityPage";

export default function Students() {
  return (
    <EntityPage
      title="Ученики"
      entityName="students"
      columns={[
        { field: "FirstName", label: "Имя", required: true, },
        { field: "LastName", label: "Фамилия", required: true, },
        { field: "MiddleName", label: "Отчество" },
        {
          field: "Phone",
          label: "Телефон",
          type: "phone",
          mask: "+7 (###) ###-##-##",
          displayMask: "+7 (###) ###-##-##",
        },
        { field: "Email", label: "Email" },
        { field: "GroupID", label: "Класс", type: "select", options: "groups", displayTemplate: "{Number}", required: true, },
      ]}
      relations={{
        groups: {
          field: "GroupID",
          displayField: "Класс",
        },
      }}
    />
  );
}
