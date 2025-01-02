const fs = require('fs');
const path = require('path');

// Đường dẫn file dữ liệu
const filename = path.join(__dirname, '../data/dataStudent.json');

// Đọc dữ liệu sinh viên (Async)
async function readStudents() {
  try {
    const data = await fs.promises.readFile(filename, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading student data:', err);
    return [];
  }
}

// Lưu dữ liệu sinh viên (Async)
async function saveStudents(students) {
  try {
    await fs.promises.writeFile(filename, JSON.stringify(students, null, 2), 'utf-8');
    console.log('Student data saved successfully!');
  } catch (err) {
    console.error('Error saving student data:', err);
  }
}

// Tìm sinh viên theo MSSV (Sử dụng tìm kiếm tuyến tính)
function findStudent(mssv) {
  return readStudents().then((students) => {
    for (let student of students) {
      if (student.id === mssv) return student;
    }
    return null; // Trả về null nếu không tìm thấy sinh viên
  });
}

// Thay đổi CPA của sinh viên
async function modifyCpa(mssv, newCpa) {
  const students = await readStudents();
  const student = students.find((s) => s.id === mssv);
  if (student) {
    student.cpa = parseFloat(newCpa);
    await saveStudents(students);
    return student;
  }
  return null;
}

// Sắp xếp sinh viên theo CPA (Bubble Sort)
function bubbleSort(students, compareFn) {
  const len = students.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (compareFn(students[j], students[j + 1])) {
        [students[j], students[j + 1]] = [students[j + 1], students[j]];
      }
    }
  }
}

// Tìm n sinh viên có CPA cao nhất
async function findTop(n) {
  const students = await readStudents();
  bubbleSort(students, (a, b) => a.cpa < b.cpa);
  return students.slice(0, n);
}

// Tìm n sinh viên có CPA thấp nhất
async function findBottom(n) {
  const students = await readStudents();
  bubbleSort(students, (a, b) => a.cpa > b.cpa);
  return students.slice(0, n);
}

// Tìm sinh viên bị cảnh cáo
async function findCanhCao() {
  const students = await readStudents();
  return students.filter((student) => {
    let canhCao = 0;
    if (student.cpa <= 0.5) canhCao = 3;
    else if (student.cpa <= 1.0) canhCao = 2;
    else if (student.cpa <= 1.5) canhCao = 1;
    return canhCao > 0 ? { ...student, canhCao } : null;
  });
}

// Đếm số sinh viên có CPA trong khoảng [a, b]
async function countInRange(a, b) {
  const students = await readStudents();
  return students.filter((s) => s.cpa >= a && s.cpa <= b).length;
}

// Tìm sinh viên bị đình chỉ
async function suspendedStudents(currentMonthYear) {
  const students = await readStudents();
  const [month, year] = currentMonthYear.split('/').map(Number);
  const currentTime = year + month / 12;

  return students.filter((student) => {
    const entryYear = 2000 + parseInt(student.id.slice(0, 2), 10);
    const studyDuration = currentTime - entryYear;
    const canhCao = student.cpa <= 0.5 ? 3 : student.cpa <= 1.0 ? 2 : student.cpa <= 1.5 ? 1 : 0;

    return canhCao === 3 && studyDuration > 5;
  }).length;
}

module.exports = {
  readStudents,
  saveStudents,
  findStudent,
  modifyCpa,
  findTop,
  findBottom,
  findCanhCao,
  countInRange,
  suspendedStudents,
};