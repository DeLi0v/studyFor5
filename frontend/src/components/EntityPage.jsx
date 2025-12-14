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
  columns = [],
  relations = {},
  onFormChange = () => { },
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

  // Новое состояние для хранения информации о конкретных ошибках полей
  const [fieldErrors, setFieldErrors] = useState({});

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
      // Для select полей конвертируем в число (ID) или null
      if (column.type === "select") {
        processedValue = value === "" ? null : Number(value);
      }
      // Применяем парсинг если есть
      else if (column.parse) {
        processedValue = column.parse(value);
      }
      // Для чисел конвертируем в число
      else if (type === "number" || column.type === "number") {
        processedValue = value === "" ? null : Number(value);
      }
    }

    setForm((prev) => {
      const newForm = { ...prev, [name]: value };
      // Вызываем callback при изменении формы
      onFormChange(name, value, newForm, setForm);
      return newForm;
    });

    // Очищаем ошибку для этого поля при изменении
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCustomChange = (field, value) => {
    setForm((prev) => {
      const newForm = { ...prev, [field]: value };
      // Вызываем callback при изменении формы
      onFormChange(field, value, newForm, setForm);
      return newForm;
    });

    // Очищаем ошибку для этого поля при изменении
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Функция для парсинга ошибок от бэкенда
  const parseBackendErrors = (errorData) => {
    const errors = {};

    // Если ошибка в формате: { "field": "error message" }
    if (errorData && typeof errorData === "object") {
      Object.entries(errorData).forEach(([key, value]) => {
        // Проверяем разные форматы ошибок
        if (
          key.toLowerCase().includes("field") ||
          key.toLowerCase().includes("error") ||
          columns.find((col) => col.field === key)
        ) {
          // Ищем поле в columns
          const column = columns.find(
            (col) =>
              col.field === key || col.field.toLowerCase() === key.toLowerCase()
          );

          if (column) {
            errors[column.field] =
              typeof value === "string" ? value : JSON.stringify(value);
          } else {
            // Если не нашли точное совпадение, пробуем по частичному совпадению
            for (const col of columns) {
              if (
                key.toLowerCase().includes(col.field.toLowerCase()) ||
                col.field.toLowerCase().includes(key.toLowerCase())
              ) {
                errors[col.field] =
                  typeof value === "string" ? value : JSON.stringify(value);
                break;
              }
            }
          }
        }
      });
    }

    // Если ошибка в формате: "field: error message" или "FieldName: error"
    else if (typeof errorData === "string") {
      // Пытаемся найти упоминания полей в тексте ошибки
      columns.forEach((col) => {
        if (
          errorData.toLowerCase().includes(col.field.toLowerCase()) ||
          errorData.toLowerCase().includes(col.label.toLowerCase())
        ) {
          errors[col.field] = errorData;
        }
      });
    }

    return errors;
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
    const missingFields = columns
      .filter(c => c.required)
      .filter(c => form[c.field] === null || form[c.field] === "" || form[c.field] === undefined);

    const isCreate = !current;

    if (missingFields.length) {
      const errors = {};
      missingFields.forEach(f => {
        errors[f.field] = "Поле обязательно для заполнения";
      });

      setFieldErrors(errors);
      setInvalidFields(missingFields.map(f => f.field));
      setFormError("Заполните обязательные поля");
      return; // ❌ СТОП
    }

    try {
      const payload = {};

      // Собираем только измененные поля
      columns.forEach(({ field, parse, type }) => {
        const originalValue = current ? current[field] : undefined;

        // нормализуем значение из формы
        let processedValue =
          form[field] === "" || form[field] === undefined
            ? null
            : form[field];

        // parse (если есть)
        if (parse && processedValue !== null) {
          processedValue = parse(processedValue);
        } else if (type === "select") {
          // Для select полей всегда конвертируем в число или null
          if (processedValue === "" || processedValue === null) {
            processedValue = null;
          } else {
            processedValue = Number(processedValue);
          }
        } else if (
          type === "number" &&
          processedValue !== null &&
          processedValue !== ""
        ) {
          processedValue = Number(processedValue);
        } else if (type === "date" && processedValue) {
          // Для дат преобразуем в формат ISO (с временем)
          // "2025-12-31" -> "2025-12-31T00:00:00Z"
          if (processedValue.includes("T")) {
            // Уже в ISO формате
            processedValue = processedValue;
          } else {
            // Добавляем время для Go time.Time
            processedValue = `${processedValue}T00:00:00Z`;
          }
        }

        if ((!isCreate && processedValue !== undefined) || (isCreate)) {
          payload[field] = processedValue;
        }

      });

      console.log("Отправляемые данные:", payload);
      console.log("Типы данных в payload:", Object.keys(payload).map(key => ({
        field: key,
        value: payload[key],
        type: typeof payload[key]
      })));

      // Очищаем предыдущие ошибки
      setFieldErrors({});
      setFormError(null);
      setInvalidFields([]);

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
      setError(null);
    } catch (err) {
      console.error("Ошибка сохранения:", err);
      console.error("Ответ сервера:", err.response?.data);

      const errorData = err.response?.data;
      let errorMessage =
        "Ошибка при сохранении данных. Проверьте поля и попробуйте снова.";

      // Парсим ошибки от бэкенда
      const parsedErrors = parseBackendErrors(errorData);

      if (Object.keys(parsedErrors).length > 0) {
        // Устанавливаем конкретные ошибки полей
        setFieldErrors(parsedErrors);

        // Подсвечиваем все проблемные поля
        setInvalidFields(Object.keys(parsedErrors));

        // Формируем общее сообщение об ошибке
        const fieldNames = Object.keys(parsedErrors)
          .map((field) => {
            const column = columns.find((col) => col.field === field);
            return column ? column.label : field;
          })
          .join(", ");

        errorMessage = `Ошибка в полях: ${fieldNames}. Проверьте введенные данные.`;
      } else {
        // Если не удалось распарсить конкретные поля, показываем общую ошибку
        if (typeof errorData === "string") {
          errorMessage = errorData;
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.error) {
          errorMessage = errorData.error;
        }
        setInvalidFields(columns.map((c) => c.field));
      }

      setFormError(errorMessage);
    }
  };

  const handleEdit = (item) => {
    // Очищаем ошибки при открытии формы редактирования
    setFieldErrors({});
    setInvalidFields([]);
    setFormError(null);

    setCurrent(item);
    const initialForm = {};

    columns.forEach(({ field, format, type, options }) => {
      let value = item[field] ?? "";

      if (type === "date" && value) {
        if (typeof value === "string" && value.includes("T")) {
          value = value.substring(0, 10); // "2025-03-10"
        }
      } else if (format && !(type === "select" && typeof options === "string")) {
        value = format(value);
      }

      initialForm[field] = value;
    });

    setForm(initialForm);
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

  // Функция для проверки, есть ли ошибка у конкретного поля
  const getFieldError = (field) => {
    return fieldErrors[field];
  };

  // Функция для определения цвета рамки поля
  const getBorderColor = (field) => {
    if (fieldErrors[field]) {
      return "red.500"; // Красная рамка для полей с ошибкой
    }
    if (invalidFields.includes(field)) {
      return "orange.500"; // Оранжевая рамка если все поля подсвечены
    }
    return undefined; // Стандартный цвет
  };

  const renderCell = (item, column) => {
    const { field, render, format, type, displayTemplate, options } = column;

    if (
      item[field] === null ||
      item[field] === undefined ||
      item[field] === ""
    ) {
      return "-";
    }

    // 1. Кастомный рендер
    if (render) return render(item, relatedData);

    let value = item[field];

    if (column.displayMask && value) {
      const digits = String(value).replace(/\D/g, "");
      return applyMask(digits, column.displayMask) ?? "-";
    }

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

      // 2a. Используем шаблон если есть
      if (displayTemplate) {
        let result = displayTemplate;
        // Заменяем все {fieldName} на значения
        Object.keys(relatedItem).forEach((key) => {
          const val = relatedItem[key] || "";
          // Регулярное выражение для поиска {key} в шаблоне
          const regex = new RegExp(`\\{${key}\\}`, "g");
          result = result.replace(regex, val);
        });
        // Очищаем оставшиеся {field} если таких полей нет в данных
        result = result.replace(/\{[^}]+\}/g, "");
        return result.trim() || "-";
      }

      // 2b. Используем format функцию если есть (для обратной совместимости)
      if (format) {
        if (format.length === 3) {
          return format(value, item, relatedData) ?? "-";
        } else if (format.length === 1) {
          return format(value) ?? "-";
        }
      }

      // 2c. Стандартное отображение
      const displayField = column.displayField || "Name";
      return relatedItem[displayField] || "-";
    }

    // 3. Для select с опциями из массива (как Weekday)
    if (type === "select" && Array.isArray(options)) {
      const selectedOption = options.find(opt => opt.value === value);
      return selectedOption ? selectedOption.label : value ?? "-";
    }

    // 4. Форматирование обычных полей
    if (format) {
      return format(value) ?? "-";
    }

    // 5. Форматирование по типу
    if (type === "time" && value) {
      const timeStr = String(value);
      if (timeStr.includes("T")) {
        const date = new Date(timeStr);
        return date.toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      } else if (timeStr.match(/^\d{2}:\d{2}/)) {
        return timeStr;
      } else if (timeStr.match(/^\d{1,2}:\d{2}:\d{2}/)) {
        return timeStr.substring(0, 5) ?? "-";
      }
    }

    if (type === "date" && value) {
      const dateStr = String(value);
      if (dateStr.includes("T")) {
        const date = new Date(dateStr);
        return date.toLocaleDateString("ru-RU");
      }
      return value ?? "-";
    }

    return value ?? "-";
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
      displayTemplate,
    } = column;

    const fieldError = getFieldError(field);
    const borderColor = getBorderColor(field);
    const value = form[field] || "";

    // Если есть кастомный рендер для формы, используем его
    if (renderInForm) {
      return (
        <FormControl mb={3} key={field} isInvalid={!!fieldError}>
          <FormLabel>{label}</FormLabel>
          {renderInForm(
            value,
            (newValue) => handleCustomChange(field, newValue),
            form,
            relatedData
          )}
          {fieldError && (
            <Alert status="error" mt={1} fontSize="sm" p={2}>
              <AlertIcon boxSize="12px" />
              {fieldError}
            </Alert>
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
        <FormControl mb={3} key={field} isInvalid={!!fieldError}>
          <FormLabel>{label}</FormLabel>
          <Input
            name={field}
            value={displayValue}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              handleCustomChange(field, rawValue);
            }}
            borderColor={borderColor}
            placeholder={phoneMask}
          />
          {fieldError && (
            <Alert status="error" mt={1} fontSize="sm" p={2}>
              <AlertIcon boxSize="12px" />
              {fieldError}
            </Alert>
          )}
        </FormControl>
      );
    }

    // Select с опциями из массива (как Weekday)
    if (type === "select" && Array.isArray(options)) {
      return (
        <FormControl mb={3} key={field} isInvalid={!!fieldError}>
          <FormLabel>{label}</FormLabel>
          <Select
            name={field}
            value={value}
            onChange={handleChange}
            borderColor={borderColor}
          >
            <option value="">Выберите</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          {fieldError && (
            <Alert status="error" mt={1} fontSize="sm" p={2}>
              <AlertIcon boxSize="12px" />
              {fieldError}
            </Alert>
          )}
        </FormControl>
      );
    }

    // Select с опциями из связанной сущности (как TeacherID, GroupID и т.д.)
    if (type === "select" && typeof options === "string") {
      const entityName = options;
      const relatedItems = relatedData[entityName] || [];
      const displayFieldName = displayField || "Name";

      return (
        <FormControl mb={3} key={field} isInvalid={!!fieldError}>
          <FormLabel>{label}</FormLabel>
          <Select
            name={field}
            value={value}
            onChange={handleChange}
            borderColor={borderColor}
          >
            <option value="">Выберите</option>
            {relatedItems.map((item) => {
              // Определяем текст для отображения в опции
              let displayText = item[displayFieldName] || `ID: ${item.ID}`;

              // Если есть displayTemplate, используем его
              if (displayTemplate) {
                let result = displayTemplate;
                Object.keys(item).forEach((key) => {
                  const val = item[key] || "";
                  const regex = new RegExp(`\\{${key}\\}`, "g");
                  result = result.replace(regex, val);
                });
                // Очищаем оставшиеся {field}
                result = result.replace(/\{[^}]+\}/g, "");
                displayText = result.trim() || item[displayFieldName] || `ID: ${item.ID}`;
              }

              return (
                <option key={item.ID} value={item.ID}>
                  {displayText}
                </option>
              );
            })}
          </Select>
          {fieldError && (
            <Alert status="error" mt={1} fontSize="sm" p={2}>
              <AlertIcon boxSize="12px" />
              {fieldError}
            </Alert>
          )}
        </FormControl>
      );
    }

    // Стандартные типы полей
    const inputProps = {
      name: field,
      value: value,
      onChange: handleChange,
      borderColor: borderColor,
    };

    switch (type) {
      case "number":
        return (
          <FormControl mb={3} key={field} isInvalid={!!fieldError}>
            <FormLabel>{label}</FormLabel>
            <Input type="number" {...inputProps} />
            {fieldError && (
              <Alert status="error" mt={1} fontSize="sm" p={2}>
                <AlertIcon boxSize="12px" />
                {fieldError}
              </Alert>
            )}
          </FormControl>
        );

      case "email":
        return (
          <FormControl mb={3} key={field} isInvalid={!!fieldError}>
            <FormLabel>{label}</FormLabel>
            <Input type="email" {...inputProps} />
            {fieldError && (
              <Alert status="error" mt={1} fontSize="sm" p={2}>
                <AlertIcon boxSize="12px" />
                {fieldError}
              </Alert>
            )}
          </FormControl>
        );

      case "date":
        return (
          <FormControl mb={3} key={field} isInvalid={!!fieldError}>
            <FormLabel>{label}</FormLabel>
            <Input type="date" {...inputProps} />
            {fieldError && (
              <Alert status="error" mt={1} fontSize="sm" p={2}>
                <AlertIcon boxSize="12px" />
                {fieldError}
              </Alert>
            )}
          </FormControl>
        );

      case "time":
        return (
          <FormControl mb={3} key={field} isInvalid={!!fieldError}>
            <FormLabel>{label}</FormLabel>
            <Input type="time" {...inputProps} step="300" />
            {fieldError && (
              <Alert status="error" mt={1} fontSize="sm" p={2}>
                <AlertIcon boxSize="12px" />
                {fieldError}
              </Alert>
            )}
          </FormControl>
        );

      default:
        return (
          <FormControl mb={3} key={field} isInvalid={!!fieldError}>
            <FormLabel>{label}</FormLabel>
            <Input {...inputProps} />
            {fieldError && (
              <Alert status="error" mt={1} fontSize="sm" p={2}>
                <AlertIcon boxSize="12px" />
                {fieldError}
              </Alert>
            )}
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
          setFieldErrors({}); // Очищаем ошибки при закрытии
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{current ? "Редактировать" : "Добавить"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {columns.map(renderFormField)}

            {formError && !Object.keys(fieldErrors).length && (
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
                setFieldErrors({});
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
