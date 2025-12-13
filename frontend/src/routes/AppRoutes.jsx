import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Dashboard from "../pages/Dashboard";

import Students from "../pages/Students";
import Teachers from "../pages/Teachers";
import Events from "../pages/Events";
import Groups from "../pages/Groups";
import Grades from "../pages/Grades";
import EventGrades from "../pages/EventGrades";
import EventParticipants from "../pages/EventParticipants";
import Parents from "../pages/Parents";
import Positions from "../pages/Positions";
import Lessons from "../pages/Lessons";
import Rooms from "../pages/Rooms";
import Specialties from "../pages/Specialties";
import Subjects from "../pages/Subjects";
import StudentRelations from "../pages/StudentRelations";

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
            <Route path="/grades" element={<Grades />} />
            <Route path="/events" element={<Events />} />
            <Route path="/event-grades" element={<EventGrades />} />
            <Route path="/event-participants" element={<EventParticipants />} />
            <Route path="/parents" element={<Parents />} />
            <Route path="/positions" element={<Positions />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/specialties" element={<Specialties />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/student-relations" element={<StudentRelations />} />
          </Routes>
        </Box>
      </Flex>
    </Router>
  );
}
