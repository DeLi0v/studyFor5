// StudentRelationsCustom.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Button,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import { getAll, create, update, remove } from "../api/index";

export default function StudentRelationsCustom() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [current, setCurrent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [form, setForm] = useState({
    StudentID: "",
    ParentID: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [relationsRes, studentsRes, parentsRes] = await Promise.all([
        getAll("student-relations"),
        getAll("students"),
        getAll("parents"),
      ]);

      setData(relationsRes || []);
      setStudents(studentsRes || []);
      setParents(parentsRes || []);
    } catch (err) {
      console.error(err);
      setError("Ошибка при загрузке данных");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        StudentID: parseInt(form.StudentID),
        ParentID: parseInt(form.ParentID),
      };

      // Проверяем, существует ли уже такая связь
      const exists = data.find(
        (item) =>
          item.StudentID === payload.StudentID &&
          item.ParentID === payload.ParentID
      );

      if (exists && !current) {
        setFormError("Такая связь уже существует");
        return;
      }

      if (current) {
        // Для обновления нужно передать оба ID в URL
        await update(
          `student-relations/${current.StudentID}/${current.ParentID}`,
          payload
        );
      } else {
        await create("student-relations", payload);
      }

      await loadData();
      onClose();
      resetForm();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || "Ошибка при сохранении");
    }
  };

  const handleEdit = (item) => {
    setCurrent(item);
    setForm({
      StudentID: item.StudentID?.toString() || "",
      ParentID: item.ParentID?.toString() || "",
    });
    setFormError(null);
    onOpen();
  };

  const handleDelete = async (studentId, parentId) => {
    if (!window.confirm("Удалить связь?")) return;
    try {
      await remove(`student-relations/${studentId}/${parentId}`);
      setData((prev) =>
        prev.filter(
          (item) =>
            !(item.StudentID === studentId && item.ParentID === parentId)
        )
      );
    } catch (err) {
      console.error(err);
      setError("Ошибка при удалении связи");
    }
  };

  const resetForm = () => {
    setCurrent(null);
    setForm({ StudentID: "", ParentID: "" });
    setFormError(null);
  };

  const formatStudentName = (student) => {
    if (!student) return "-";
    return `${student.LastName} ${student.FirstName} ${
      student.MiddleName || ""
    }`.trim();
  };

  const formatParentName = (parent) => {
    if (!parent) return "-";
    return `${parent.LastName} ${parent.FirstName} ${
      parent.MiddleName || ""
    }`.trim();
  };

  return (
    <Box p={6}>
      <Heading mb={4}>Связи учеников и родителей</Heading>

      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Button colorScheme="blue" mb={4} onClick={onOpen}>
        Добавить связь
      </Button>

      {loading ? (
        <Spinner size="xl" mt={10} />
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID ученика</Th>
              <Th>Ученик</Th>
              <Th>ID родителя</Th>
              <Th>Родитель</Th>
              <Th>Действия</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.length ? (
              data.map((item, index) => {
                const student = students.find((s) => s.ID === item.StudentID);
                const parent = parents.find((p) => p.ID === item.ParentID);

                return (
                  <Tr key={`${item.StudentID}-${item.ParentID}-${index}`}>
                    <Td>{item.StudentID}</Td>
                    <Td>{formatStudentName(student)}</Td>
                    <Td>{item.ParentID}</Td>
                    <Td>{formatParentName(parent)}</Td>
                    <Td>
                      <Button
                        size="sm"
                        colorScheme="yellow"
                        mr={2}
                        onClick={() => handleEdit(item)}
                      >
                        Ред.
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() =>
                          handleDelete(item.StudentID, item.ParentID)
                        }
                      >
                        Удалить
                      </Button>
                    </Td>
                  </Tr>
                );
              })
            ) : (
              <Tr>
                <Td colSpan={5} textAlign="center">
                  Данные отсутствуют
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          resetForm();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {current ? "Редактировать связь" : "Добавить связь"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Ученик</FormLabel>
              <Select
                name="StudentID"
                value={form.StudentID}
                onChange={handleChange}
                isDisabled={!!current} // Не позволяем менять ученика при редактировании
              >
                <option value="">Выберите ученика</option>
                {students.map((student) => (
                  <option key={student.ID} value={student.ID}>
                    {formatStudentName(student)}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Родитель</FormLabel>
              <Select
                name="ParentID"
                value={form.ParentID}
                onChange={handleChange}
                isDisabled={!!current} // Не позволяем менять родителя при редактировании
              >
                <option value="">Выберите родителя</option>
                {parents.map((parent) => (
                  <option key={parent.ID} value={parent.ID}>
                    {formatParentName(parent)}
                  </option>
                ))}
              </Select>
            </FormControl>

            {formError && (
              <Alert status="error" mt={2}>
                <AlertIcon />
                {formError}
              </Alert>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Сохранить
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onClose();
                resetForm();
              }}
            >
              Отмена
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
