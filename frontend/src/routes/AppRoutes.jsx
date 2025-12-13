import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Students from "../pages/Students";
import Teachers from "../pages/Teachers";
import Groups from "../pages/Groups";
import Events from "../pages/Events";
import EventParticipants from "../pages/EventParticipants";
import Sidebar from "../components/Sidebar";
import Dashboard from "../pages/Dashboard";
import { Box, Flex } from "@chakra-ui/react";

export default function AppRoutes() {
  return (
    <Router>
      <Flex>
        <Sidebar />
        <Box flex="1" p={4}>
          <Routes>
          <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/events" element={<Events />} />
            <Route path="/event-participants" element={<EventParticipants />} />
          </Routes>
        </Box>
      </Flex>
    </Router>
  );
}
