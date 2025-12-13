import { useEffect, useState } from "react";
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { getAll } from "../api";

export default function Groups() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    getAll("groups")
      .then((data) => setGroups(Array.isArray(data) ? data : data.groups || []))
      .catch(console.error);
  }, []);

  return (
    <Box p={6}>
      <Heading mb={4}>Группы</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Название</Th>
            <Th>Классный руководитель</Th>
          </Tr>
        </Thead>
        <Tbody>
          {groups.map((g) => (
            <Tr key={g.ID}>
              <Td>{g.ID}</Td>
              <Td>{g.Name}</Td>
              <Td>{g.ClassTeacher?.FirstName || "-"}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
