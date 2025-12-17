// TestData.jsx - временный компонент для теста
import { useEffect } from "react";
import { getAll } from "../api";

export default function TestData() {
  useEffect(() => {
    const testData = async () => {
      console.log("=== Тестирование API ===");
      
      // Тест 1: Загрузка students
      console.log("1. Загружаем students:");
      const students = await getAll("students");
      console.log("Students:", students);
      console.log("Первый студент:", students[0]);
      console.log("Первый студент GroupID:", students[0]?.GroupID);
      console.log("Первый студент Group:", students[0]?.Group);
      
      // Тест 2: Загрузка groups
      console.log("\n2. Загружаем groups:");
      const groups = await getAll("groups");
      console.log("Groups:", groups);
      
      // Тест 3: Загрузка grades
      console.log("\n3. Загружаем grades:");
      const grades = await getAll("grades");
      console.log("Grades:", grades);
    };
    
    testData();
  }, []);

  return <div>Проверяем данные в консоли...</div>;
}