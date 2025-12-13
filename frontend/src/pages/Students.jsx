import EntityPage from "../components/EntityPage";

export default function Students() {
  return (
    <EntityPage
      title="Ученики"
      entityName="students"
      fields={[
        "FirstName",
        "LastName",
        "MiddleName",
        "Phone",
        "Email",
        "GroupID",
      ]}
      relations={{ groups: { field: "GroupID" } }}
      headers={{
        FirstName: "Имя",
        LastName: "Фамилия",
        MiddleName: "Отчество",
        Phone: "Телефон",
        Email: "Почта",
        GroupID: "Группа",
      }}
    />
  );
}
