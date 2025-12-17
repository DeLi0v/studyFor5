import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { getAll } from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    groups: 0,
    upcomingEvents: 0,
    allEvents: 0,
  });
  const [loading, setLoading] = useState(true);

  // Функция для фильтрации предстоящих событий
  const filterUpcomingEvents = (events) => {
    const currentDateTime = new Date();

    return events.filter(event => {
      if (!event.EventDate) return false;

      try {
        // Создаем полную дату и время события
        let eventDateTime;

        if (event.TimeStart) {
          // Если есть время начала, объединяем с датой
          const dateStr = event.EventDate.split('T')[0];
          eventDateTime = new Date(`${dateStr}T${event.TimeStart}`);
        } else {
          // Если времени нет, используем только дату (начало дня)
          eventDateTime = new Date(event.EventDate);
          eventDateTime.setHours(0, 0, 0, 0);
        }

        return eventDateTime >= currentDateTime;
      } catch (error) {
        console.error(`Ошибка обработки события ${event.ID}:`, error);
        return false;
      }
    });
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [students, teachers, groups, events] = await Promise.all([
          getAll("students"),
          getAll("teachers"),
          getAll("groups"),
          getAll("events"),
        ]);

        const upcomingEvents = filterUpcomingEvents(events);

        setStats({
          students: students.length,
          teachers: teachers.length,
          groups: groups.length,
          upcomingEvents: upcomingEvents.length,
          allEvents: events.length,
        });
      } catch (err) {
        console.error("Ошибка при загрузке статистики:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box p={6}>
        <Heading mb={6}>Добро пожаловать в систему управления школой</Heading>
        <Text>Загрузка статистики...</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Heading mb={6}>Добро пожаловать в систему управления школой</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <Stat>
          <StatLabel>Ученики</StatLabel>
          <StatNumber>{stats.students}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Учителя</StatLabel>
          <StatNumber>{stats.teachers}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Классы</StatLabel>
          <StatNumber>{stats.groups}</StatNumber>
        </Stat>
        <Tooltip
          label={`Всего событий: ${stats.allEvents}. Показаны только предстоящие.`}
          placement="top"
          hasArrow
        >
          <Stat cursor="help">
            <StatLabel>Предстоящие события</StatLabel>
            <StatNumber>{stats.upcomingEvents}</StatNumber>
          </Stat>
        </Tooltip>
      </SimpleGrid>
    </Box>
  );
}