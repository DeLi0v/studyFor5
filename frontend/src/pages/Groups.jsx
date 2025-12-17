// TeacherPage.jsx
import EntityPage from "../components/EntityPage";

export default function Groups() {
  return (
    <EntityPage
      title="Классы"
      entityName="groups"
      columns={[
        { field: "Number", label: "Номер", required: true, },
        { field: "Parallel", label: "Параллель", required: true, type: "number"},
        { field: "AdmissionDate", label: "Дата поступления", type: "date", required: true, },
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
