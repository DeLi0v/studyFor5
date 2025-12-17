import { Box, VStack, Link } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <Box w="200px" minH="100vh" bg="gray.100" p={4}>
      <VStack align="start" spacing={3}>
        <Link as={NavLink} to="/">
          Главная
        </Link>

        <Link as={NavLink} to="/students">
          Ученики
        </Link>
        <Link as={NavLink} to="/groups">
          Классы
        </Link>
        <Link as={NavLink} to="/teachers">
          Учителя
        </Link>

        <Link as={NavLink} to="/lessons">
          Уроки
        </Link>
        <Link as={NavLink} to="/events">
          События
        </Link>
        <Link as={NavLink} to="/event-participants">
          Участники событий
        </Link>

        <Link as={NavLink} to="/grades">
          Оценки
        </Link>
        {/* <Link as={NavLink} to="/event-grades">
          Оценки за события
        </Link> */}

        <Link as={NavLink} to="/parents">
          Родители
        </Link>

        <Link as={NavLink} to="/subjects">
          Предметы
        </Link>
        <Link as={NavLink} to="/rooms">
          Кабинеты
        </Link>
        <Link as={NavLink} to="/positions">
          Должности
        </Link>
        <Link as={NavLink} to="/specialties">
          Специальности
        </Link>

        <Link as={NavLink} to="/student-relations">
          Связи студенты-родители
        </Link>

        {/* <Link as={NavLink} to="/test-data">
          Тест API
        </Link> */}
      </VStack>
    </Box>
  );
}
