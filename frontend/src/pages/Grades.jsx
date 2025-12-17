// Grades.jsx - исправленная версия
import EntityPage from "../components/EntityPage";

const GRADE_TYPES = [
  { value: "exam", label: "Экзамен" },
  { value: "test", label: "Тест" },
  { value: "homework", label: "Домашняя работа" },
  { value: "quiz", label: "Контрольная" },
  { value: "participation", label: "Участие" },
];

export default function Grades() {
  return (
    <EntityPage
      title="Оценки"
      entityName="grades"
      columns={[
        {
          field: "Type",
          label: "Тип оценки",
          type: "select",
          options: GRADE_TYPES,
          required: true,
          defaultValue: "test",
          render: (item) => {
            const type = GRADE_TYPES.find(t => t.value === item.Type);
            return type ? type.label : item.Type;
          },
        },
        {
          field: "StudentID",
          label: "Ученик",
          type: "select",
          options: "students",
          displayTemplate: "{LastName} {FirstName} {MiddleName}",
          required: true,
          renderInForm: (value, onChange, form, relatedData) => {
            const students = relatedData.students || [];
            const groups = relatedData.groups || [];

            return (
              <div>
                <select
                  value={value || ""}
                  onChange={(e) => onChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <option value="">Выберите ученика</option>
                  {students.map(student => (
                    <option key={student.ID} value={student.ID}>
                      {student.LastName} {student.FirstName} {student.MiddleName || ""}
                      {student.Group ? ` (${student.Group.Number})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            );
          },
        },
        {
          field: "Class",
          label: "Класс",
          render: (item, relatedData) => {
            console.log("Class render - item:", item);

            // Вариант 1: если студент загружен вместе с оценкой (через Preload)
            if (item.Student && item.Student.Group && item.Student.Group.Number) {
              return item.Student.Group.Number;
            }

            // Вариант 2: если есть только ID студента, ищем в relatedData
            if (item.StudentID) {
              // Ищем студента в relatedData
              const student = relatedData.students?.find(s => s.ID === item.StudentID);

              if (student) {
                if (student.Group && student.Group.Number) {
                  return student.Group.Number;
                }

                if (student.GroupID) {
                  const group = relatedData.groups?.find(g => g.ID === student.GroupID);
                  return group ? group.Number : `Класс #${student.GroupID}`;
                }
              }
            }

            return "-";
          },
          renderInForm: () => null,
        },
        {
          field: "SubjectID",
          label: "Предмет",
          type: "select",
          options: "subjects",
          displayField: "Name",
          required: true,
        },
        {
          field: "Score",
          label: "Оценка",
          type: "number",
          required: true,
          min: 1,
          max: 5,
        },
        {
          field: "DateGiven",
          label: "Дата",
          type: "date",
          required: true,
          defaultValue: new Date().toISOString().split('T')[0],
          format: (value) => {
            if (!value) return "-";
            const date = new Date(value);
            return date.toLocaleDateString("ru-RU");
          },
        },
        {
          field: "GradedBy",
          label: "Преподаватель",
          type: "select",
          options: "teachers",
          displayField: "FirstName",
          displayTemplate: "{LastName} {FirstName} {MiddleName}",
          required: true,
        },
      ]}
      relations={{
        groups: {
          field: "GroupID",
          displayField: "Number",
        },
      }}
      // Добавим отладочный вывод
      onFormChange={(field, value, formData, setForm) => {
        console.log("Form change - field:", field, "value:", value);
      }}
    />
  );
}