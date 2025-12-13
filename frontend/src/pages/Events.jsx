import { useEffect, useState } from "react";
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { getAll } from "../api";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getAll("events")
      .then((data) => setEvents(Array.isArray(data) ? data : data.events || []))
      .catch(console.error);
  }, []);

  return (
    <Box p={6}>
      <Heading mb={4}>События</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Название</Th>
            <Th>Дата</Th>
          </Tr>
        </Thead>
        <Tbody>
          {events.map((e) => (
            <Tr key={e.ID}>
              <Td>{e.ID}</Td>
              <Td>{e.Name}</Td>
              <Td>{e.Date}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
