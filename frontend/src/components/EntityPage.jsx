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
import { getAll, create, update, remove } from "../api/index";

export default function EntityPage({
  title,
  entityName,
  columns = [], // [{ field, label, type?, render? }]
  relations = {}, // {
  //   positions: {
  //     field: "PositionID",
  //     displayField: "Name",
  //     displayFieldInTable: "PositionName" // новое поле
  //   }
  // }
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

  // Загрузка данных
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

      // Преобразуем данные формы в payload для отправки
      columns.forEach(({ field }) => {
        // Проверяем, является ли поле связанной сущностью
        const relKey = Object.keys(relations).find(
          (k) => relations[k].field === field
        );

        if (relKey) {
          // Для связанных сущностей отправляем ID (число или null)
          payload[field] = form[field] === "" ? null : Number(form[field]);
        } else {
          // Для обычных полей отправляем как есть
          payload[field] = form[field] ?? null;
        }
      });

      if (current) {
        await update(entityName, current.ID, payload);
      } else {
        await create(entityName, payload);
      }

      // Обновляем данные после сохранения
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
      setFormError(
        "Ошибка при сохранении данных. Проверьте поля и попробуйте снова."
      );
      setInvalidFields(columns.map((c) => c.field));
    }
  };

  const handleEdit = (item) => {
    setInvalidFields([]);
    setCurrent(item);
    const initialForm = {};

    columns.forEach(({ field }) => {
      // Проверяем, является ли поле связанной сущностью
      const relKey = Object.keys(relations).find(
        (k) => relations[k].field === field
      );

      if (relKey) {
        // Для связанных сущностей устанавливаем ID как значение
        initialForm[field] = item[field] || "";
      } else {
        // Для обычных полей устанавливаем значение из записи
        initialForm[field] = item[field] || "";
      }
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
      setError(
        "Ошибка при удалении записи, остальная информация отображается."
      );
    }
  };

  const renderCell = (item, { field, render }) => {
    // Если есть кастомный рендер, используем его
    if (render) return render(item, relatedData);

    // Проверяем, является ли поле связанной сущностью
    const relKey = Object.keys(relations).find(
      (k) => relations[k].field === field
    );

    if (relKey) {
      const relationConfig = relations[relKey];
      const relatedItem = relatedData[relKey]?.find(
        (r) => r.ID === item[field]
      );

      if (!relatedItem) return "-";

      // Если указано поле для отображения в таблице, используем его
      if (
        relationConfig.displayFieldInTable &&
        relatedItem[relationConfig.displayFieldInTable]
      ) {
        return relatedItem[relationConfig.displayFieldInTable];
      }

      // Иначе используем поле для отображения или "Name" по умолчанию
      const displayField = relationConfig.displayField || "Name";
      return relatedItem[displayField] || "-";
    }

    // Для обычных полей возвращаем значение
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

              // Если поле является связанной сущностью, показываем select
              if (relKey) {
                const relationConfig = relations[relKey];
                const displayField = relationConfig.displayField || "Name";

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
                            {r[displayField] || "-"} (ID: {r.ID})
                          </option>
                        ))}
                    </Select>
                  </FormControl>
                );
              }

              // Обычные поля (input)
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
