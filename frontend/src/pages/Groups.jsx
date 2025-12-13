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
        { field: "AdmissionDate", label: "Дата поступления" },
        { field: "ClassTeacherID", label: "Классный руководитель" },
      ]}
      relations={{
        teachers: {
          field: "ClassTeacherID",
          displayField: "FirstName",
        },
      }}
    />
  );
}
