import { Box, VStack, Link } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <Box w="200px" minH="100vh" bg="gray.100" p={4}>
      <VStack align="start" spacing={3}>
        <NavLink to="/">
          <Link>Главная</Link>
        </NavLink>
        <NavLink to="/students">
          <Link>Студенты</Link>
        </NavLink>
        <NavLink to="/teachers">
          <Link>Учителя</Link>
        </NavLink>
        <NavLink to="/groups">
          <Link>Группы</Link>
        </NavLink>
        <NavLink to="/events">
          <Link>События</Link>
        </NavLink>
        <NavLink to="/event-participants">
          <Link>Участники событий</Link>
        </NavLink>
      </VStack>
    </Box>
  );
}
