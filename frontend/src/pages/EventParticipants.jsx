import EntityPage from "../components/EntityPage";
import { useEffect, useState } from "react";
import { getAll } from "../api/index";
import { Select } from "@chakra-ui/react";

const ParticipantTypeS = [
  { value: "teacher", label: "Учитель" },
  { value: "student", label: "Ученик" },
  { value: "parent", label: "Родитель" },
  { value: "group", label: "Класс" },
];

export default function EventParticipants() {
  const [events, setEvents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const formatParticipantName = (participant, type) => {
    if (!participant) return "";
    switch (type) {
      case "teacher":
      case "student":
      case "parent":
        return `${participant.LastName || ""} ${participant.FirstName || ""} ${participant.MiddleName || ""}`.trim();
      case "group":
        return participant.Name || participant.Number || `Группа ${participant.ID}`;
      default:
        return "";
    }
  };

  const getEventName = (eventId) => {
    const event = events.find((e) => e.ID === parseInt(eventId));
    return event ? event.Name || event.Title || `Мероприятие ${event.ID}` : "-";
  };

  const handleFormChange = (field, value, formValues, setForm) => {
    if (field === "ParticipantType") {
      setForm((prev) => ({ ...prev, ParticipantID: "" }));
    }
  };

  if (isLoading) return <div>Загрузка данных...</div>;

  return (
    <EntityPage
      title="Участники событий"
      entityName="event-participants"
      columns={[
        {
          field: "EventID",
          label: "Мероприятие",
          type: "select",
          required: true,
          // ВАЖНО: parse должен возвращать число или null
          parse: (value) => value === "" || value === null ? null : Number(value),
          render: (item) => getEventName(item.EventID),
          renderInForm: (value, onChange) => (
            <Select
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
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
          field: "ParticipantType",
          label: "Тип участника",
          type: "select",
          required: true,
          parse: (value) => value === "" || value === null ? null : value,
          render: (item) => {
            const type = ParticipantTypeS.find((t) => t.value === item.ParticipantType);
            return type ? type.label : item.ParticipantType;
          },
          renderInForm: (value, onChange) => (
            <Select value={value || ""} onChange={(e) => onChange(e.target.value)}>
              <option value="">Выберите тип</option>
              {ParticipantTypeS.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          ),
        },
        {
          field: "ParticipantID",
          label: "Участник",
          type: "select",
          required: true,
          parse: (value) => value === "" || value === null ? null : Number(value),
          render: (item) => {
            const participants = getParticipantsByType(item.ParticipantType);
            const participant = participants.find((p) => p.ID === parseInt(item.ParticipantID));
            return formatParticipantName(participant, item.ParticipantType) || "-";
          },
          renderInForm: (value, onChange, formValues) => {
            const participants = getParticipantsByType(formValues?.ParticipantType);
            return (
              <Select
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                isDisabled={!formValues?.ParticipantType}
              >
                <option value="">Выберите участника</option>
                {participants.map((p) => (
                  <option key={p.ID} value={p.ID}>
                    {formatParticipantName(p, formValues?.ParticipantType)}
                  </option>
                ))}
              </Select>
            );
          },
        },
      ]}
      onFormChange={handleFormChange}
    />
  );
}