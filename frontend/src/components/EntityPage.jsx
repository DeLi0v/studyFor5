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
  columns = [], // [
  //   {
  //     field,
  //     label,
  //     type?: "text" | "number" | "phone" | "email" | "date" | "select",
  //     render?: (item, relatedData) => ReactNode,
  //     renderInForm?: (value, onChange, relatedData) => ReactNode,
  //     format?: (value) => any, // Функция форматирования для отображения
  //     parse?: (value) => any, // Функция парсинга для отправки в БД
  //     mask?: string, // Маска для ввода (например, "+7 (###) ###-##-##")
  //     options?: { value: any, label: string }[] | string, // Для select: массив или имя связанной сущности
  //     displayField?: string, // Поле для отображения в select для связанных сущностей
  //   }
  // ]
  relations = {}, // Опционально, можно указывать в columns через options
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

  // Собираем все связанные сущности из columns
  const extractRelationsFromColumns = () => {
    const extractedRelations = { ...relations };

    columns.forEach((col) => {
      if (col.options && typeof col.options === "string") {
        const entityName = col.options;
        if (!extractedRelations[entityName]) {
          extractedRelations[entityName] = {
            field: col.field,
            displayField: col.displayField || "Name",
          };
        }
      }
    });

    return extractedRelations;
  };

  // Загрузка данных
  useEffect(() => {
    setLoading(true);
    const allRelations = extractRelationsFromColumns();
    const relatedPromises = Object.keys(allRelations).map((key) => getAll(key));

    Promise.all([getAll(entityName), ...relatedPromises])
      .then(([mainRes, ...relatedRes]) => {
        setData(Array.isArray(mainRes) ? mainRes : []);
        const relData = {};
        Object.keys(allRelations).forEach((key, i) => {
          relData[key] = Array.isArray(relatedRes[i]) ? relatedRes[i] : [];
        });
        setRelatedData(relData);
      })
      .catch((err) => {
        console.error(err);
        setError("Ошибка при загрузке данных");
      })
      .finally(() => setLoading(false));
  }, [entityName, JSON.stringify(relations || {}), JSON.stringify(columns)]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    let processedValue = value;

    // Находим конфигурацию столбца
    const column = columns.find((col) => col.field === name);

    if (column) {
      // Применяем парсинг если есть
      if (column.parse) {
        processedValue = column.parse(value);
      }
      // Для чисел конвертируем в число
      else if (type === "number" || column.type === "number") {
        processedValue = value === "" ? null : Number(value);
      }
    }

    setForm((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleCustomChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const applyMask = (value, mask) => {
    if (!value) return "";

    let result = "";
    let valueIndex = 0;

    for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
      if (mask[i] === "#") {
        if (/[0-9]/.test(value[valueIndex])) {
          result += value[valueIndex];
          valueIndex++;
        } else {
          break;
        }
      } else {
        result += mask[i];
      }
    }

    return result;
  };

  const handleSubmit = async () => {
    try {
      const payload = {};

      columns.forEach(({ field, parse, type }) => {
        let value = form[field] ?? null;

        // Применяем парсинг если есть
        if (parse && value !== null) {
          value = parse(value);
        }
        // Для чисел конвертируем в число
        else if (type === "number" && value !== null && value !== "") {
          value = Number(value);
        }
        // Для пустых значений в select отправляем null
        else if (type === "select" && value === "") {
          value = null;
        }

        payload[field] = value;
      });

      if (current) {
        await update(entityName, current.ID, payload);
      } else {
        await create(entityName, payload);
      }

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

    columns.forEach(({ field, format }) => {
      let value = item[field] ?? "";

      // Применяем форматирование если есть
      if (format) {
        value = format(value);
      }

      initialForm[field] = value;
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

  const renderCell = (item, column) => {
    const { field, render, format, type } = column;

    // Если есть кастомный рендер, используем его
    if (render) return render(item, relatedData);

    let value = item[field];

    // 2. Для связанных сущностей
    if (
      type === "select" &&
      column.options &&
      typeof column.options === "string"
    ) {
      const entityName = column.options;
      const relatedItems = relatedData[entityName];
      const relatedItem = relatedItems?.find((r) => r.ID === value);

      if (!relatedItem) return "-";

      // 2a. Используем format функцию если есть
      if (format) {
        if (format.length === 3) {
          return format(value, item, relatedData) ?? "-";
        } else if (format.length === 1) {
          return format(value) ?? "-";
        }
      }

      // 2b. Используем шаблон если есть
      if (displayTemplate) {
        let result = displayTemplate;
        Object.keys(relatedItem).forEach((key) => {
          const val = relatedItem[key] || "";
          result = result.replace(new RegExp(`\\{${key}\\}`, "g"), val);
        });
        return result;
      }
      // 2c. Стандартное отображение
      const displayField = column.displayField || "Name";
      return relatedItem[displayField] || "-";
    }

    // Для телефона применяем стандартное форматирование
    else if (type === "phone" && value) {
      const phoneStr = String(value);
      if (phoneStr.length === 11) {
        value = `+7 (${phoneStr.slice(1, 4)}) ${phoneStr.slice(
          4,
          7
        )}-${phoneStr.slice(7, 9)}-${phoneStr.slice(9)}`;
      }
    }
    // Для email добавляем ссылку
    else if (type === "email" && value) {
      value = (
        <a href={`mailto:${value}`} style={{ color: "#3182CE" }}>
          {value}
        </a>
      );
    }
    // Для select находим связанную сущность
    else if (
      type === "select" &&
      column.options &&
      typeof column.options === "string"
    ) {
      const entityName = column.options;
      const relatedItems = relatedData[entityName];
      const relatedItem = relatedItems?.find((r) => r.ID === value);
      const displayField = column.displayField || "Name";
      value = relatedItem ? relatedItem[displayField] : "-";
    }

    return value;
  };

  const renderFormField = (column) => {
    const {
      field,
      label,
      type = "text",
      renderInForm,
      mask,
      options,
      displayField,
    } = column;
    const isInvalid = invalidFields.includes(field);
    const value = form[field] || "";

    // Если есть кастомный рендер для формы, используем его
    if (renderInForm) {
      return (
        <FormControl mb={3} key={field}>
          <FormLabel>{label}</FormLabel>
          {renderInForm(
            value,
            (newValue) => handleCustomChange(field, newValue),
            relatedData
          )}
        </FormControl>
      );
    }

    // Поле с маской (телефон)
    if (type === "phone" || mask) {
      const phoneMask = mask || "+7 (###) ###-##-##";
      const displayValue = value
        ? applyMask(String(value).replace(/\D/g, ""), phoneMask)
        : "";

      return (
        <FormControl mb={3} key={field}>
          <FormLabel>{label}</FormLabel>
          <Input
            name={field}
            value={displayValue}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              handleCustomChange(field, rawValue);
            }}
            borderColor={isInvalid ? "red.500" : undefined}
            placeholder={phoneMask}
          />
        </FormControl>
      );
    }

    // Select с опциями из массива
    if (type === "select" && Array.isArray(options)) {
      return (
        <FormControl mb={3} key={field}>
          <FormLabel>{label}</FormLabel>
          <Select
            name={field}
            value={value}
            onChange={handleChange}
            borderColor={isInvalid ? "red.500" : undefined}
          >
            <option value="">Выберите</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>
      );
    }

    // Select с опциями из связанной сущности
    if (type === "select" && typeof options === "string") {
      const entityName = options;
      const relatedItems = relatedData[entityName] || [];
      const displayFieldName = displayField || "Name";

      return (
        <FormControl mb={3} key={field}>
          <FormLabel>{label}</FormLabel>
          <Select
            name={field}
            value={value}
            onChange={handleChange}
            borderColor={isInvalid ? "red.500" : undefined}
          >
            <option value="">Выберите</option>
            {relatedItems.map((item) => (
              <option key={item.ID} value={item.ID}>
                {item[displayFieldName]}
              </option>
            ))}
          </Select>
        </FormControl>
      );
    }

    // Стандартные типы полей
    const inputProps = {
      name: field,
      value: value,
      onChange: handleChange,
      borderColor: isInvalid ? "red.500" : undefined,
    };

    switch (type) {
      case "number":
        return (
          <FormControl mb={3} key={field}>
            <FormLabel>{label}</FormLabel>
            <Input type="number" {...inputProps} />
          </FormControl>
        );

      case "email":
        return (
          <FormControl mb={3} key={field}>
            <FormLabel>{label}</FormLabel>
            <Input type="email" {...inputProps} />
          </FormControl>
        );

      case "date":
        return (
          <FormControl mb={3} key={field}>
            <FormLabel>{label}</FormLabel>
            <Input type="date" {...inputProps} />
          </FormControl>
        );

      default:
        return (
          <FormControl mb={3} key={field}>
            <FormLabel>{label}</FormLabel>
            <Input {...inputProps} />
          </FormControl>
        );
    }
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
            {columns.map(renderFormField)}

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
