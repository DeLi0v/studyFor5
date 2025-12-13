import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { getAll } from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    groups: 0,
    events: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, teachers, groups, events] = await Promise.all([
          getAll("students"),
          getAll("teachers"),
          getAll("groups"),
          getAll("events"),
        ]);

        setStats({
          students: students.length,
          teachers: teachers.length,
          groups: groups.length,
          events: events.length,
        });
      } catch (err) {
        console.error("Ошибка при загрузке статистики:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box p={6}>
      <Heading mb={6}>Добро пожаловать в систему управления школой</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <Stat>
          <StatLabel>Студенты</StatLabel>
          <StatNumber>{stats.students}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Учителя</StatLabel>
          <StatNumber>{stats.teachers}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Группы</StatLabel>
          <StatNumber>{stats.groups}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>События</StatLabel>
          <StatNumber>{stats.events}</StatNumber>
        </Stat>
      </SimpleGrid>
    </Box>
  );
}
