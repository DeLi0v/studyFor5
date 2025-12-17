// TeacherPage.jsx
import EntityPage from "../components/EntityPage";

export default function Lessons() {
  return (
    <EntityPage
      title="Уроки"
      entityName="lessons"
      columns={[
        {
          field: "GroupID",
          label: "Класс",
          options: "groups",
          type: "select",
          displayTemplate: "{Number}",
          required: true,
        },
        {
          field: "SubjectID",
          label: "Предмет",
          options: "subjects",
          type: "select",
          displayTemplate: "{Name}",
          required: true,
        },
        {
          field: "TeacherID",
          label: "Учитель",
          options: "teachers",
          type: "select",
          required: true,
          displayTemplate: "{LastName} {FirstName} {MiddleName}",
          // Кастомный рендер для формы с отображением специальности
          renderInForm: (value, onChange, form, relatedData) => {
            const teachers = relatedData.teachers || [];
            const specialties = relatedData.specialties || [];

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
                  <option value="">Выберите учителя</option>
                  {teachers.map(teacher => {
                    const fullName = `${teacher.LastName || ''} ${teacher.FirstName || ''} ${teacher.MiddleName || ''}`.trim();

                    // Находим специальность по ID
                    let specialtyName = "";
                    if (teacher.SpecialtyID) {
                      const specialty = specialties.find(s => s.ID === teacher.SpecialtyID);
                      specialtyName = specialty ? `(${specialty.Name})` : "";
                    }

                    const displayText = specialtyName
                      ? `${fullName} ${specialtyName}`
                      : fullName;

                    return (
                      <option key={teacher.ID} value={teacher.ID}>
                        {displayText}
                      </option>
                    );
                  })}
                </select>
              </div>
            );
          },
          // Кастомный рендер для таблицы
          render: (item, relatedData) => {
            // Если урок уже содержит Teacher с информацией
            if (item.Teacher) {
              const teacher = item.Teacher;
              const fullName = `${teacher.LastName || ''} ${teacher.FirstName || ''} ${teacher.MiddleName || ''}`.trim();

              // Пробуем найти специальность в relatedData если в Teacher она не загружена
              if (teacher.SpecialtyID && (!teacher.Specialty || !teacher.Specialty.Name)) {
                const specialty = relatedData.specialties?.find(s => s.ID === teacher.SpecialtyID);
                if (specialty && specialty.Name) {
                  return (
                    <div>
                      <div>{fullName}</div>
                      <div style={{ fontSize: '0.8em', color: '#666' }}>{specialty.Name}</div>
                    </div>
                  );
                }
              }

              return fullName;
            }

            // Если Teacher не загружен в уроке, ищем в relatedData
            const teacher = relatedData.teachers?.find(t => t.ID === item.TeacherID);
            if (!teacher) return `Учитель #${item.TeacherID}`;

            const fullName = `${teacher.LastName || ''} ${teacher.FirstName || ''} ${teacher.MiddleName || ''}`.trim();

            // Добавляем специальность если есть
            if (teacher.SpecialtyID) {
              const specialty = relatedData.specialties?.find(s => s.ID === teacher.SpecialtyID);
              if (specialty) {
                return (
                  <div>
                    <div>{fullName}</div>
                    <div style={{ fontSize: '0.8em', color: '#666' }}>{specialty.Name}</div>
                  </div>
                );
              }
            }

            return fullName;
          },
        },
        {
          field: "RoomID",
          label: "Кабинет",
          options: "rooms",
          type: "select",
          displayTemplate: "{Number}",
          required: true,
        },
        {
          field: "Weekday",
          label: "День недели",
          type: "select",
          options: [
            { value: 1, label: "Понедельник" },
            { value: 2, label: "Вторник" },
            { value: 3, label: "Среда" },
            { value: 4, label: "Четверг" },
            { value: 5, label: "Пятница" },
            { value: 6, label: "Суббота" },
            { value: 7, label: "Воскресенье" },
          ],
          required: true,
        },
        {
          field: "TimeStart",
          label: "Время начала",
          required: true,
          type: "time",
          format: (value) => {
            if (!value) return "-";
            return String(value).substring(0, 5);
          },
        },
        {
          field: "TimeEnd",
          required: true,
          label: "Время окончания",
          type: "time",
          format: (value) => {
            if (!value) return "-";
            return String(value).substring(0, 5);
          },
        },
        { field: "EndDate", label: "Дата завершения", type: "date", required: true, },
      ]}
      // Добавляем загрузку специальностей
      relations={{
        specialties: {
          field: "SpecialtyID",
          displayField: "Name",
        },
      }}
    />
  );
}