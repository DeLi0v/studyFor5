import { useEffect, useState } from "react";
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { getAll } from "../api";

export default function EventParticipants() {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    getAll("event-participants")
      .then((data) => setParticipants(Array.isArray(data) ? data : data.eventParticipants || []))
      .catch(console.error);
  }, []);

  return (
    <Box p={6}>
      <Heading mb={4}>Участники событий</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Студент</Th>
            <Th>Событие</Th>
          </Tr>
        </Thead>
        <Tbody>
          {participants.map((p) => (
            <Tr key={`${p.StudentID}-${p.EventID}`}>
              <Td>{p.ID}</Td>
              <Td>{p.Student?.FirstName || "-"}</Td>
              <Td>{p.Event?.Name || "-"}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
