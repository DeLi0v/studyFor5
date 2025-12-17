import { useEffect, useState, useMemo } from "react";
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
  const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });

  const [fieldErrors, setFieldErrors] = useState({});

  // Функция для безопасного преобразования значения в строку
  const safeString = (value) => {
    if (value === null || value === undefined) return "";
    return String(value);
  };

  // ИСПРАВЛЕННАЯ: Функция для извлечения цифр из телефона
  const extractPhoneDigits = (value, returnNumber = false) => {
    if (!value) return returnNumber ? null : "";
    const str = safeString(value);
    // Убираем все нецифры
    const digits = str.replace(/\D/g, "");

    // Если ничего не осталось, возвращаем пустую строку или null
    if (!digits) return returnNumber ? null : "";

    // Если номер начинается с 8, меняем на 7
    let processedDigits = digits;
    if (digits.startsWith('8')) {
      processedDigits = '7' + digits.substring(1);
    }

    // Возвращаем либо строку, либо число
    return returnNumber ? Number(processedDigits) : processedDigits;
  };

  // Улучшенная функция для нормализации значения (из формы в БД)
  const normalizeValue = (value, column) => {
    const { type, parse } = column;

    // Если значение пустое - возвращаем null
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    // Если есть parse функция, используем ее
    if (parse) {
      try {
        return parse(value);
      } catch (err) {
        console.error(`Ошибка в parse функции для поля ${column.field}:`, err);
        return value;
      }
    }

    // Автоматическая нормализация по типу
    switch (type) {
      case "select":
        // Для select проверяем, является ли options массивом
        if (Array.isArray(column.options)) {
          // Проверяем тип значений в options
          if (column.options.length > 0) {
            const firstOption = column.options[0];
            // Если значения в options - числа, преобразуем в число
            if (typeof firstOption.value === 'number') {
              const num = Number(value);
              return isNaN(num) ? null : num;
            }
            // Если значения - строки, оставляем как строку
            return value;
          }
          return value;
        }
        // Для select с связанными сущностями (по ID) преобразуем в число
        const num = Number(value);
        return isNaN(num) ? null : num;

      case "number":
        const numVal = Number(value);
        return isNaN(numVal) ? null : numVal;

      case "phone":
        // Для телефона извлекаем только цифры как число
        return extractPhoneDigits(value, true);

      case "date":
        // Для дат преобразуем в формат ISO
        const dateStr = safeString(value);
        if (dateStr && !dateStr.includes("T")) {
          return `${dateStr}T00:00:00Z`;
        }
        return dateStr;

      default:
        return value;
    }
  };

  // Улучшенная функция для денормализации значения (из БД в форму)
  const denormalizeValue = (value, column) => {
    if (value === null || value === undefined) {
      return "";
    }

    const { type, format } = column;

    // Если есть format функция, используем ее
    if (format) {
      try {
        return format(value);
      } catch (err) {
        console.error(`Ошибка в format функции для поля ${column.field}:`, err);
        return value;
      }
    }

    const strValue = safeString(value);

    switch (type) {
      case "date":
        // Из ISO формата в "YYYY-MM-DD" для input
        if (strValue.includes("T")) {
          return strValue.substring(0, 10);
        }
        return strValue;

      case "time":
        // Из "HH:MM:SS" в "HH:MM" для input
        return strValue.length > 5 ? strValue.substring(0, 5) : strValue;

      case "phone":
        // Для телефона возвращаем как есть (цифры)
        return strValue;

      default:
        return strValue;
    }
  };

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

  // Сортировка данных
  const sortedData = useMemo(() => {
    if (!sortConfig.field) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const handleSort = (field) => {
    setSortConfig(current => {
      if (current.field === field) {
        return {
          field,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return {
        field,
        direction: 'asc'
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const column = columns.find((col) => col.field === name);

    // Для select полей с кастомным renderInForm может приходить пустая строка
    let processedValue = value;
    if (column?.type === "select" && value === "") {
      processedValue = null;
    }

    setForm((prev) => {
      const newForm = { ...prev, [name]: processedValue };
      onFormChange(name, processedValue, newForm, setForm);
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

    if (errorData && typeof errorData === "object") {
      Object.entries(errorData).forEach(([key, value]) => {
        const column = columns.find((col) => col.field === key);
        if (column) {
          errors[column.field] = typeof value === "string" ? value : JSON.stringify(value);
        }
      });
    }

    return errors;
  };

  // ИСПРАВЛЕННАЯ: Улучшенная функция для маски телефона
  const applyPhoneMask = (value, mask = "+7 (###) ###-##-##") => {
    const digits = extractPhoneDigits(value, false); // Получаем строку с цифрами
    if (!digits) return "";

    let result = "";
    let digitIndex = 0;
    const digitsStr = String(digits);

    // Удаляем первую цифру если она 7 (она уже в маске)
    let digitsToUse = digitsStr;
    if (digitsStr.startsWith('7')) {
      digitsToUse = digitsStr.substring(1);
    }

    for (let i = 0; i < mask.length && digitIndex < digitsToUse.length; i++) {
      if (mask[i] === "#") {
        result += digitsToUse[digitIndex];
        digitIndex++;
      } else {
        result += mask[i];
      }
    }

    return result;

  };

  // ИСПРАВЛЕННАЯ функция handleSubmit
  const handleSubmit = async () => {
    console.log("Текущая форма перед отправкой:", form);

    // Валидация обязательных полей в форме
    const missingFields = [];
    columns.forEach(column => {
      if (column.required) {
        const value = form[column.field];
        if (value === null || value === "" || value === undefined) {
          missingFields.push(column.field);
        }
      }
    });

    if (missingFields.length > 0) {
      const errors = {};
      missingFields.forEach(field => {
        const column = columns.find(c => c.field === field);
        errors[field] = `Поле "${column?.label || field}" обязательно для заполнения`;
      });
      setFieldErrors(errors);
      setInvalidFields(missingFields);
      setFormError("Заполните обязательные поля");
      return;
    }

    try {
      const payload = {};
      let hasChanges = false;

      // Подготовка данных для отправки
      columns.forEach((column) => {
        const { field } = column;
        const formValue = form[field];

        // Нормализуем значение
        const processedValue = normalizeValue(formValue, column);

        // ДЛЯ СОЗДАНИЯ: добавляем все поля
        if (!current) {
          payload[field] = processedValue;
          hasChanges = true;
          return;
        }

        // ДЛЯ РЕДАКТИРОВАНИЯ: проверяем изменения
        const originalValue = current[field];
        const normalizedOriginal = normalizeValue(originalValue, column);

        console.log(`Поле ${field}:`, {
          formValue,
          processedValue,
          originalValue,
          normalizedOriginal,
          changed: JSON.stringify(processedValue) !== JSON.stringify(normalizedOriginal)
        });

        // Если значение изменилось, добавляем в payload
        if (JSON.stringify(processedValue) !== JSON.stringify(normalizedOriginal)) {
          payload[field] = processedValue;
          hasChanges = true;
        }
      });

      // Если нет изменений (при редактировании)
      if (current && !hasChanges) {
        setFormError("Нет изменений для сохранения");
        return;
      }

      console.log("Отправляемые данные:", payload);

      // Проверка: все ли обязательные поля есть в payload для создания
      if (!current) {
        const requiredColumns = columns.filter(c => c.required);
        const missingRequired = requiredColumns.filter(col => {
          const value = payload[col.field];
          return value === null || value === undefined || value === "";
        });

        if (missingRequired.length > 0) {
          const errors = {};
          missingRequired.forEach(col => {
            errors[col.field] = "Поле обязательно для заполнения";
          });
          setFieldErrors(errors);
          setFormError("Не все обязательные поля заполнены");
          return;
        }
      }

      // Очищаем ошибки
      setFieldErrors({});
      setFormError(null);
      setInvalidFields([]);

      let result;
      if (current) {
        result = await update(entityName, current.ID, payload);
      } else {
        result = await create(entityName, payload);
      }

      console.log("Результат сохранения:", result);

      // Перезагружаем данные
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
      let errorMessage = "Ошибка при сохранении данных. Проверьте поля и попробуйте снова.";

      const parsedErrors = parseBackendErrors(errorData);
      if (Object.keys(parsedErrors).length > 0) {
        setFieldErrors(parsedErrors);
        setInvalidFields(Object.keys(parsedErrors));
        const fieldNames = Object.keys(parsedErrors)
          .map((field) => {
            const column = columns.find((col) => col.field === field);
            return column ? column.label : field;
          })
          .join(", ");
        errorMessage = `Ошибка в полях: ${fieldNames}. Проверьте введенные данные.`;
      } else if (typeof errorData === "string") {
        errorMessage = errorData;
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.error) {
        errorMessage = errorData.error;
      }

      setFormError(errorMessage);
    }
  };

  const handleEdit = (item) => {
    setFieldErrors({});
    setInvalidFields([]);
    setFormError(null);

    setCurrent(item);
    const initialForm = {};

    columns.forEach((column) => {
      const { field, defaultValue } = column;
      const value = item[field] ?? (defaultValue !== undefined ? defaultValue : "");
      initialForm[field] = denormalizeValue(value, column);
    });

    console.log("Форма для редактирования:", initialForm);
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
      setError("Ошибка при удалении записи, остальная информация отображается.");
    }
  };

  const getFieldError = (field) => {
    return fieldErrors[field];
  };

  const getBorderColor = (field) => {
    if (fieldErrors[field]) {
      return "red.500";
    }
    if (invalidFields.includes(field)) {
      return "orange.500";
    }
    return undefined;
  };

  const renderCell = (item, column) => {
    const { field, render, type, displayTemplate, options, displayMask } = column;

    // Кастомный рендер
    if (render) return render(item, relatedData);

    const value = item[field];
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    // Поле с маской для отображения - ИСПРАВЛЕННЫЙ КОД
    if (displayMask && value) {
      if (type === "phone") {
        const maskedValue = applyPhoneMask(value, displayMask);
        console.log(`Phone masking: ${value} -> ${maskedValue}`);
        return maskedValue || "-";
      }

      // Для других типов с маской
      const digits = safeString(value).replace(/\D/g, "");
      let result = "";
      let digitIndex = 0;
      for (let i = 0; i < displayMask.length && digitIndex < digits.length; i++) {
        if (displayMask[i] === "#") {
          result += digits[digitIndex];
          digitIndex++;
        } else {
          result += displayMask[i];
        }
      }
      return result || "-";
    }

    // Select с опциями из связанной сущности
    if (type === "select" && typeof options === "string") {
      const entityName = options;
      const relatedItems = relatedData[entityName] || [];
      const relatedItem = relatedItems.find((r) => r.ID === value);

      if (!relatedItem) return `ID: ${value}`;

      if (displayTemplate) {
        let result = displayTemplate;
        Object.keys(relatedItem).forEach((key) => {
          const val = safeString(relatedItem[key]);
          result = result.replace(new RegExp(`\\{${key}\\}`, "g"), val);
        });
        result = result.replace(/\{[^}]+\}/g, "");
        return result.trim() || "-";
      }

      const displayField = column.displayField || "Name";
      return safeString(relatedItem[displayField]) || "-";
    }

    // Select с опциями из массива
    if (type === "select" && Array.isArray(options)) {
      const selectedOption = options.find(opt => opt.value === value);
      return selectedOption ? selectedOption.label : safeString(value);
    }

    // Форматирование по типу
    if (type === "time" && value) {
      const str = safeString(value);
      if (str.includes("T")) {
        const date = new Date(str);
        return date.toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      }
      return str.length > 5 ? str.substring(0, 5) : str;
    }

    if (type === "date" && value) {
      const str = safeString(value);
      if (str.includes("T")) {
        const date = new Date(str);
        return date.toLocaleDateString("ru-RU");
      }
      return str;
    }

    return safeString(value);
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
      required = false,
    } = column;

    const fieldError = getFieldError(field);
    const borderColor = getBorderColor(field);
    const value = form[field] !== undefined ? form[field] : "";

    // Кастомный рендер для формы
    if (renderInForm) {
      return (
        <FormControl mb={3} key={field} isInvalid={!!fieldError} isRequired={required}>
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

    // Поле с маской (телефон) - ИСПРАВЛЕННЫЙ ВАРИАНТ
    if (type === "phone" || mask) {
      const phoneMask = mask || "+7 (###) ###-##-##";
      const displayValue = applyPhoneMask(value, phoneMask);

      return (
        <FormControl mb={3} key={field} isInvalid={!!fieldError} isRequired={required}>
          <FormLabel>{label}</FormLabel>
          <Input
            name={field}
            value={displayValue}
            onChange={(e) => {
              const inputValue = e.target.value;
              // Извлекаем цифры из введенного значения как строку
              const digits = extractPhoneDigits(inputValue, false);
              handleCustomChange(field, digits);
            }}
            onBlur={(e) => {
              // При потере фокуса форматируем номер
              const digits = extractPhoneDigits(value, false);
              if (digits) {
                const formatted = applyPhoneMask(digits, phoneMask);
                // Обновляем display value
                e.target.value = formatted;
                // Также обновляем состояние
                handleCustomChange(field, digits);
              }
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

    // Select с опциями из массива
    if (type === "select" && Array.isArray(options)) {
      return (
        <FormControl mb={3} key={field} isInvalid={!!fieldError} isRequired={required}>
          <FormLabel>{label}</FormLabel>
          <Select
            name={field}
            value={value || ""}
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

    // Select с опциями из связанной сущности
    if (type === "select" && typeof options === "string") {
      const entityName = options;
      const relatedItems = relatedData[entityName] || [];
      const displayFieldName = displayField || "Name";

      return (
        <FormControl mb={3} key={field} isInvalid={!!fieldError} isRequired={required}>
          <FormLabel>{label}</FormLabel>
          <Select
            name={field}
            value={value || ""}
            onChange={handleChange}
            borderColor={borderColor}
          >
            <option value="">Выберите</option>
            {relatedItems.map((item) => {
              let displayText = safeString(item[displayFieldName]) || `ID: ${item.ID}`;

              if (displayTemplate) {
                let result = displayTemplate;
                Object.keys(item).forEach((key) => {
                  const val = safeString(item[key]);
                  result = result.replace(new RegExp(`\\{${key}\\}`, "g"), val);
                });
                result = result.replace(/\{[^}]+\}/g, "");
                displayText = result.trim() || safeString(item[displayFieldName]) || `ID: ${item.ID}`;
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

    // Стандартные поля
    const inputProps = {
      name: field,
      value: safeString(value),
      onChange: handleChange,
      borderColor: borderColor,
    };

    switch (type) {
      case "number":
        return (
          <FormControl mb={3} key={field} isInvalid={!!fieldError} isRequired={required}>
            <FormLabel>{label}</FormLabel>
            <Input
              type="number"
              {...inputProps}
              value={value === "" ? "" : value}
            />
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
          <FormControl mb={3} key={field} isInvalid={!!fieldError} isRequired={required}>
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
          <FormControl mb={3} key={field} isInvalid={!!fieldError} isRequired={required}>
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
          <FormControl mb={3} key={field} isInvalid={!!fieldError} isRequired={required}>
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
          <FormControl mb={3} key={field} isInvalid={!!fieldError} isRequired={required}>
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

  // Функция для отображения иконки сортировки
  const renderSortIcon = (field) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
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
                <Th
                  key={c.field}
                  onClick={() => handleSort(c.field)}
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                >
                  {c.label}{renderSortIcon(c.field)}
                </Th>
              ))}
              <Th>Действия</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedData.length ? (
              sortedData.map((item) => (
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
          setFieldErrors({});
        }}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{current ? "Редактировать" : "Добавить"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {columns.map(renderFormField)}

            {formError && !Object.keys(fieldErrors).length && (
              <Alert status="error" mt={4}>
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
