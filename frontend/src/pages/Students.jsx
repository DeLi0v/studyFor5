// TeacherPage.jsx
import EntityPage from "../components/EntityPage";

export default function Students() {
  return (
    <EntityPage
      title="Ученики"
      entityName="students"
      columns={[
        { field: "FirstName", label: "Имя" },
        { field: "LastName", label: "Фамилия" },
        { field: "MiddleName", label: "Отчество" },
        { field: "Phone", label: "Телефон", displayMask: "+7 (###) ###-##-##",},
        { field: "Email", label: "Email" },
        { field: "GroupID", label: "Класс", type: "select", options: "groups", displayTemplate: "{Number}",},
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
