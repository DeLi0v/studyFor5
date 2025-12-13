import { useEffect, useState } from "react";
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
  Input,
  Select,
  useDisclosure,
} from "@chakra-ui/react";

// ======= Заглушка API (замените на свой API) =======
const mockData = {
  employees: [
    { ID: 1, FirstName: "Пётр", LastName: "Петров", PositionID: 1 },
    { ID: 2, FirstName: "Анна", LastName: "Иванова", PositionID: 2 },
  ],
  positions: [
    { ID: 1, Name: "Учитель" },
    { ID: 2, Name: "Директор" },
  ],
};

const getAll = async (entity) => {
  return new Promise((resolve) =>
    setTimeout(() => resolve(mockData[entity]), 200)
  );
};
const create = async (entity, payload) => {
  mockData[entity].push({ ID: Date.now(), ...payload });
};
const update = async (entity, id, payload) => {
  const idx = mockData[entity].findIndex((e) => e.ID === id);
  if (idx >= 0)
    mockData[entity][idx] = { ...mockData[entity][idx], ...payload };
};
const remove = async (entity, id) => {
  mockData[entity] = mockData[entity].filter((e) => e.ID !== id);
};
// ===================================================

export default function EntityPage({
  title,
  entityName,
  columns = [], // [{ field, label, type?, render? }]
  relations = {}, // { positions: { field: "PositionID", displayField: "Name" } }
}) {
  const [data, setData] = useState([]);
  const [relatedData, setRelatedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [invalidFields, setInvalidFields] = useState([]);
  const [current, setCurrent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [form, setForm] = useState({});

  useEffect(() => {
    setLoading(true);
    const relatedPromises = Object.keys(relations).map((key) => getAll(key));

    Promise.all([getAll(entityName), ...relatedPromises])
      .then(([mainRes, ...relatedRes]) => {
        setData(Array.isArray(mainRes) ? mainRes : []);
        const relData = {};
        Object.keys(relations).forEach((key, i) => {
          relData[key] = Array.isArray(relatedRes[i]) ? relatedRes[i] : [];
        });
        setRelatedData(relData);
      })
      .catch((err) => {
        console.error(err);
        setError("Ошибка при загрузке данных");
      })
      .finally(() => setLoading(false));
  }, [entityName, relations]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {};
      columns.forEach(({ field }) => {
        const relKey = Object.keys(relations).find(
          (k) => relations[k].field === field
        );
        if (relKey)
          payload[field] = form[field] === "" ? null : Number(form[field]);
        else payload[field] = form[field] ?? null;
      });

      if (current) await update(entityName, current.ID, payload);
      else await create(entityName, payload);

      const res = await getAll(entityName);
      setData(Array.isArray(res) ? res : []);
      onClose();
      setCurrent(null);
      setForm({});
      setFormError(null);
      setInvalidFields([]);
      setError(null);
    } catch (err) {
      console.error(err);
      setFormError("Ошибка при сохранении данных");
      setInvalidFields(columns.map((c) => c.field));
    }
  };

  const handleEdit = (item) => {
    setInvalidFields([]);
    setCurrent(item);
    const initialForm = {};
    columns.forEach(({ field }) => {
      const relKey = Object.keys(relations).find(
        (k) => relations[k].field === field
      );
      initialForm[field] = relKey ? item[field] || "" : item[field] || "";
    });
    setForm(initialForm);
    setFormError(null);
    onOpen();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить запись?")) return;
    try {
      await remove(entityName, id);
      setData((prev) => prev.filter((d) => d.ID !== id));
    } catch (err) {
      console.error(err);
      setError("Ошибка при удалении записи");
    }
  };

  const renderCell = (item, { field, render }) => {
    if (render) return render(item, relatedData);

    const relKey = Object.keys(relations).find(
      (k) => relations[k].field === field
    );
    if (relKey) {
      const relatedItem = relatedData[relKey]?.find(
        (r) => r.ID === item[field]
      );
      return relatedItem
        ? relatedItem[relations[relKey].displayField || "Name"]
        : "-";
    }

    return item[field] ?? "-";
  };

  return (
    <Box p={6}>
      <Heading mb={4}>{title}</Heading>
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <Button colorScheme="blue" mb={4} onClick={onOpen}>
        Добавить
      </Button>
      {loading ? (
        <Spinner size="xl" mt={10} />
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              {columns.map((c) => (
                <Th key={c.field}>{c.label}</Th>
              ))}
              <Th>Действия</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.length ? (
              data.map((item) => (
                <Tr key={item.ID}>
                  <Td>{item.ID}</Td>
                  {columns.map((c) => (
                    <Td key={c.field}>{renderCell(item, c)}</Td>
                  ))}
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
                      onClick={() => handleDelete(item.ID)}
                    >
                      Удалить
                    </Button>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={columns.length + 2} textAlign="center">
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
          setCurrent(null);
          setForm({});
          setFormError(null);
          setInvalidFields([]);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{current ? "Редактировать" : "Добавить"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {columns.map((c) => {
              const relKey = Object.keys(relations).find(
                (k) => relations[k].field === c.field
              );
              const isInvalid = invalidFields.includes(c.field);

              if (relKey) {
                return (
                  <FormControl mb={3} key={c.field}>
                    <FormLabel>{c.label}</FormLabel>
                    <Select
                      name={c.field}
                      value={form[c.field] || ""}
                      onChange={handleChange}
                      borderColor={isInvalid ? "red.500" : undefined}
                    >
                      <option value="">Выберите</option>
                      {Array.isArray(relatedData[relKey]) &&
                        relatedData[relKey].map((r) => (
                          <option key={r.ID} value={r.ID}>
                            {r[relations[relKey].displayField || "Name"] || "-"}
                          </option>
                        ))}
                    </Select>
                  </FormControl>
                );
              }

              return (
                <FormControl mb={3} key={c.field}>
                  <FormLabel>{c.label}</FormLabel>
                  <Input
                    name={c.field}
                    value={form[c.field] || ""}
                    onChange={handleChange}
                    borderColor={isInvalid ? "red.500" : undefined}
                  />
                </FormControl>
              );
            })}

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
                setCurrent(null);
                setForm({});
                setFormError(null);
                setInvalidFields([]);
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

// ======= Использование компонента =======
export function App() {
  const columns = [
    { field: "FirstName", label: "Имя" },
    { field: "LastName", label: "Фамилия" },
    {
      field: "PositionID",
      label: "Должность",
      render: (item, relatedData) => {
        const pos = relatedData.positions?.find(
          (p) => p.ID === item.PositionID
        );
        return pos ? pos.Name : "-";
      },
    },
  ];

  const relations = {
    positions: { field: "PositionID", displayField: "Name" },
  };

  return (
    <EntityPage
      title="Сотрудники"
      entityName="employees"
      columns={columns}
      relations={relations}
    />
  );
}
