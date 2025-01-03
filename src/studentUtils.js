const fs = require('fs');
const path = require('path');

const filename = path.join(__dirname, '../data/dataStudent.json');

async function readStudents() {
  try {
    const data = await fs.promises.readFile(filename, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading student data:', err);
    return [];
  }
}

async function saveStudents(students) {
  try {
    await fs.promises.writeFile(filename, JSON.stringify(students, null, 2), 'utf-8');
    console.log('Student data saved successfully!');
  } catch (err) {
    console.error('Error saving student data:', err);
  }
}

function findStudent(mssv) {
  return readStudents().then((students) => {
    for (let student of students) {
      if (student.id === mssv) return student;
    }
    return null; 
  });
}

function binarySearch(students, mssv) {
  let left = 0; 
  let right = students.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2); 
    if (students[mid].id === mssv) {  
      return students[mid];
    } else if (students[mid].id < mssv) {
      left = mid + 1; 
    } else {
      right = mid - 1;
    }
  }
  return null; 
}

async function modifyCpa(mssv, newCpa) {
  const students = await readStudents();
  students.sort((a, b) => a.id.localeCompare(b.id)); 
  const student = binarySearch(students, mssv); 
  if (student) {
    student.cpa = parseFloat(newCpa);
    await saveStudents(students);
    return student;
  }
  return null;
}

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

async function findTop(n) {
  const students = await readStudents();
  bubbleSort(students, (a, b) => a.cpa < b.cpa);
  return students.slice(0, n);
}

async function findBottom(n) {
  const students = await readStudents();
  bubbleSort(students, (a, b) => a.cpa > b.cpa);
  return students.slice(0, n);
}

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

async function countInRange(a, b) {
  const students = await readStudents();

  students.sort((s1, s2) => s1.cpa - s2.cpa);

  const low = binarySearch(students, a, true);
  const high = binarySearch(students, b, false);

  return high - low;
}

function binarySearch(arr, value, findLower) {
  let left = 0, right = arr.length;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid].cpa < value || (findLower && arr[mid].cpa === value)) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left;
}

async function suspendedStudents(currentMonthYear) {
  const students = await readStudents();
  const [month, year] = currentMonthYear.split('/').map(Number);
  const currentTime = year + month / 12;
  
  const studentsByEntryYear = new Map();

  students.forEach((student) => {
    const entryYear = parseInt(student.id.slice(0, 4), 10);
    if (!studentsByEntryYear.has(entryYear)) {
      studentsByEntryYear.set(entryYear, []);
    }
    studentsByEntryYear.get(entryYear).push(student);
  });

  let suspendedCount = 0;
  studentsByEntryYear.forEach((studentList) => {
    studentList.forEach((student) => {
      const entryYear = parseInt(student.id.slice(0, 4), 10);
      const studyDuration = currentTime - entryYear;
      const canhCao = student.cpa <= 0.5 ? 3 : student.cpa <= 1.0 ? 2 : student.cpa <= 1.5 ? 1 : 0;

      if (canhCao === 3 && studyDuration > 5) {
        suspendedCount++;
      }
    });
  });

  return suspendedCount;
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