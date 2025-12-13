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
        {
          field: "PositionID",
          label: "Должность",
          render: (item, relatedData) => {
            // Если хочешь кастомное отображение
            const pos = relatedData.positions?.find(
              (p) => p.ID === item.position_id
            );
            return pos ? `${pos.Name}` : "-";
          },
        },

        {
          field: "specialty_id",
          label: "Специальность",
          render: (item, relatedData) => {
            const spec = relatedData.specialties?.find(
              (s) => s.ID === item.specialty_id
            );
            return spec?.Name || "-";
          },
        },
      ]}
      relations={{
        positions: { field: "position_id" },
        specialties: { field: "specialty_id" },
      }}
    />
  );
}
