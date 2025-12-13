import { useEffect, useState } from "react";
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { getAll } from "../api";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    getAll("teachers")
      .then((data) => setTeachers(Array.isArray(data) ? data : data.teachers || []))
      .catch(console.error);
  }, []);

  return (
    <Box p={6}>
      <Heading mb={4}>Учителя</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Имя</Th>
            <Th>Фамилия</Th>
            <Th>Специальность</Th>
          </Tr>
        </Thead>
        <Tbody>
          {teachers.map((t) => (
            <Tr key={t.ID}>
              <Td>{t.ID}</Td>
              <Td>{t.FirstName}</Td>
              <Td>{t.LastName}</Td>
              <Td>{t.Specialty?.Name || "-"}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
