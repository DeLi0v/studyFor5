import EntityPage from "../components/EntityPage";

export default function Grades() {
  return (
    <EntityPage
      title="Оценки"
      entityName="grades"
      columns={[
        {
          field: "StudentID",
          label: "Ученик",
          type: "select",
          options: "students",
          displayField: "FirstName",
          format: (value, item, relatedData) => {
            const student = relatedData.students?.find((e) => e.ID === value);
            if (!student) return "-";
            return `${student.LastName} ${student.FirstName} ${
              student.MiddleName || ""
            }`.trim();
          },
        },
        {
          field: "SubjectID", // Изменили с EventID на SubjectID
          label: "Предмет",
          type: "select",
          options: "subjects",
          displayField: "Name",
        },
        {
          field: "Score",
          label: "Оценка",
          type: "number",
        },
        {
          field: "DateGiven",
          label: "Дата",
          type: "date",
          format: (value) => {
            if (!value) return "-";
            const date = new Date(value);
            return date.toLocaleDateString("ru-RU");
          },
        },
        {
          field: "Type",
          label: "Тип оценки",
          type: "select",
          options: [
            { value: "exam", label: "Экзамен" },
            { value: "test", label: "Тест" },
            { value: "homework", label: "Домашняя работа" },
            { value: "quiz", label: "Контрольная" },
            { value: "participation", label: "Участие" },
          ],
        },
        {
          field: "GradedBy",
          label: "Преподаватель",
          type: "select",
          options: "teachers",
          displayField: "FirstName",
          format: (value, item, relatedData) => {
            const teacher = relatedData.teachers?.find((e) => e.ID === value);
            if (!teacher) return "-";
            return `${teacher.LastName} ${teacher.FirstName} ${
              teacher.MiddleName || ""
            }`.trim();
          },
        },
      ]}
    />
  );
}
