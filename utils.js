const dayjs = require('dayjs');

const students = [
    { name: "Sonia", birth: "2019-14-05" },
    { name: "Antoine", birth: "2000-12-05" },
    { name: "Alice", birth: "1990-14-09" },
    { name: "Sophie", birth: "2001-10-02" },
    { name: "Bernard", birth: "1980-21-08" }
];

function addStudent(name, birth) {
    students.push({ name, birth });
}

function deleteStudent(name) {
    const index = students.findIndex(student => student.name === name);
    if (index !== -1) {
        students.splice(index, 1);
    }
}

function formatBirthdate(birthdate) {
    return dayjs(birthdate).format('DD/MM/YYYY');
}

module.exports = {
    students,
    addStudent,
    deleteStudent,
    formatBirthdate
};
