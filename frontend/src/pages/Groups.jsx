// TeacherPage.jsx
import EntityPage from "../components/EntityPage";

export default function Groups() {
  return (
    <EntityPage
      title="Классы"
      entityName="groups"
      columns={[
        { field: "Number", label: "Номер" },
        { field: "Parallel", label: "Параллель" },
        { field: "AdmissionDate", label: "Дата поступления", type: "date"},
        {
          field: "ClassTeacherID",
          label: "Классный руководитель",
          options: "teachers",
          type: "select",
          displayTemplate: "{LastName} {FirstName} {MiddleName}",
        },
      ]}
    />
  );
}
