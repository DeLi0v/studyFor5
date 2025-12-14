// EventParticipants.jsx - ПОЛНЫЙ КОД
import EntityPage from "../components/EntityPage";
import { useEffect, useState } from "react";
import { getAll } from "../api/index";
import { Select } from "@chakra-ui/react";

// Константы с типами участников
const PARTICIPANT_TYPES = [
  { value: "teacher", label: "Учитель" },
  { value: "student", label: "Ученик" },
  { value: "parent", label: "Родитель" },
  { value: "group", label: "Класс" },
];

export default function EventParticipants() {
  // Состояние для загрузки данных
  const [events, setEvents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка всех необходимых данных
  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsRes, teachersRes, studentsRes, parentsRes, groupsRes] =
          await Promise.all([
            getAll("events"),
            getAll("teachers"),
            getAll("students"),
            getAll("parents"),
            getAll("groups"),
          ]);

        setEvents(eventsRes || []);
        setTeachers(teachersRes || []);
        setStudents(studentsRes || []);
        setParents(parentsRes || []);
        setGroups(groupsRes || []);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Функция для получения списка участников по типу
  const getParticipantsByType = (type) => {
    switch (type) {
      case "teacher":
        return teachers;
      case "student":
        return students;
      case "parent":
        return parents;
      case "group":
        return groups;
      default:
        return [];
    }
  };

  // Функция для форматирования имени участника
  const formatParticipantName = (participant, type) => {
    if (!participant) return "";

    switch (type) {
      case "teacher":
      case "student":
      case "parent":
        return `${participant.LastName || ""} ${participant.FirstName || ""} ${participant.MiddleName || ""
          }`.trim();
      case "group":
        return (
          participant.Name || participant.Number || `Группа ${participant.ID}`
        );
      default:
        return "";
    }
  };

  // Функция для получения названия мероприятия
  const getEventName = (eventId) => {
    const event = events.find((e) => e.ID === parseInt(eventId));
    return event ? event.Name || event.Title || `Мероприятие ${event.ID}` : "-";
  };

  // Функция-колбэк для обработки изменений в форме
  const handleFormChange = (field, value, formValues, setForm) => {
    // Если изменился тип участника, сбрасываем выбранного участника
    if (field === "participant_type") {
      setForm((prev) => ({ ...prev, participant_id: "" }));
    }
  };

  // Если данные еще загружаются, показываем спиннер
  if (isLoading) {
    return <div>Загрузка данных...</div>;
  }

  return (
    <EntityPage
      title="Участники событий"
      entityName="event-participants"
      columns={[
        {
          field: "event_id",
          label: "Мероприятие",
          type: "select",
          required: true,
          // Рендер в таблице
          render: (item) => getEventName(item.event_id),
          // Рендер в форме
          renderInForm: (value, onChange) => (
            <Select
              value={value || ""}
              onChange={(e) =>
                onChange(e.target.value ? Number(e.target.value) : null)
              }

            >
              <option value="">Выберите мероприятие</option>
              {events.map((event) => (
                <option key={event.ID} value={event.ID}>
                  {event.Name || event.Title || `Мероприятие ${event.ID}`}
                </option>
              ))}
            </Select>
          ),
        },
        {
          field: "participant_type",
          label: "Тип участника",
          required: true,
          // Рендер в таблице
          render: (item) => {
            const type = PARTICIPANT_TYPES.find(
              (t) => t.value === item.participant_type
            );
            return type ? type.label : item.participant_type;
          },
          // Рендер в форме
          renderInForm: (value, onChange) => (
            <Select
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
            >
              <option value="">Выберите тип</option>
              {PARTICIPANT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          ),
        },
        {
          field: "participant_id",
          label: "Участник",
          type: "select",
          required: true,
          // Рендер в таблице
          render: (item) => {
            const participants = getParticipantsByType(item.participant_type);
            const participant = participants.find(
              (p) => p.ID === parseInt(item.participant_id)
            );
            return (
              formatParticipantName(participant, item.participant_type) || "-"
            );
          },
          // Рендер в форме (зависит от выбранного типа)
          renderInForm: (value, onChange, formValues) => {
            const participants = getParticipantsByType(
              formValues?.participant_type
            );

            return (
              <Select
                value={value || ""}
                onChange={(e) =>
                  onChange(e.target.value ? Number(e.target.value) : null)
                }

                isDisabled={!formValues?.participant_type}
              >
                <option value="">Выберите участника</option>
                {participants.map((participant) => (
                  <option key={participant.ID} value={participant.ID}>
                    {formatParticipantName(
                      participant,
                      formValues?.participant_type
                    )}
                  </option>
                ))}
              </Select>
            );
          },
        },
      ]}
      // ПЕРЕДАЕМ КОЛБЭК ДЛЯ ОБРАБОТКИ ИЗМЕНЕНИЙ ФОРМЫ
      onFormChange={handleFormChange}
    />
  );
}
