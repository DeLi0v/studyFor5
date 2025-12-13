import { useEffect, useState } from "react";
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { getAll } from "../api";

export default function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    getAll("students")
      .then((data) => setStudents(Array.isArray(data) ? data : data.students || []))
      .catch(console.error);
  }, []);

  return (
    <Box p={6}>
      <Heading mb={4}>Студенты</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Имя</Th>
            <Th>Фамилия</Th>
            <Th>Группа</Th>
          </Tr>
        </Thead>
        <Tbody>
          {students.map((s) => (
            <Tr key={s.ID}>
              <Td>{s.ID}</Td>
              <Td>{s.FirstName}</Td>
              <Td>{s.LastName}</Td>
              <Td>{s.Group?.Name || "-"}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
