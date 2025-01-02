const fs = require('fs');
const path = require('path');

const filename = path.join(__dirname, '../data/dataStudent.json');

const numStudents = 100;

const yearOfAdmission = 2022;


class Student {
  constructor(id, name, cpa) {
    this.id = id;      
    this.name = name;  
    this.cpa = cpa;    
  }

  getWarningLevel() {
    if (this.cpa <= 0.5) return 3; 
    if (this.cpa <= 1.0) return 2;
    if (this.cpa <= 1.5) return 1; 
    return 0; 
  }

  toString() {
    const warningLevel = this.getWarningLevel();
    return `${this.id} "${this.name}" ${this.cpa} ${warningLevel > 0 ? `Cảnh cáo: ${warningLevel}` : 'Không bị cảnh cáo'}`;
  }
}

function generateStudents(num, year) {
  const students = [];

  for (let i = 0; i < num; i++) {
    const id = `${year}${(i + 1).toString().padStart(4, '0')}`; 
    const name = generateVietnameseName();  
    const cpa = parseFloat((Math.random() * 4).toFixed(2)); 

    const student = new Student(id, name, cpa); 
    students.push(student);
  }

  return students;
}

function generateVietnameseName() {
  const ho = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng'];
  const dem = ['Văn', 'Thị', 'Hồng', 'Quang', 'Minh', 'Hải', 'Thanh', 'Anh', 'Đức', 'Ngọc'];
  const ten = ['Anh', 'Bình', 'Chi', 'Dung', 'Hương', 'Khang', 'Lan', 'Minh', 'Nhân', 'Phúc'];

  const hoTen = `${ho[randomIndex(ho)]} ${dem[randomIndex(dem)]} ${ten[randomIndex(ten)]}`;
  return hoTen;
}

function randomIndex(array) {
  return Math.floor(Math.random() * array.length);
}


async function saveStudentsToFile(filename, students) {
  try {
    const data = students.map((student) => ({
      id: student.id,
      name: student.name,
      cpa: student.cpa,
    }));

    await fs.promises.writeFile(filename, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`The file ${filename} was saved successfully!`);
  } catch (err) {
    console.error('Error saving file:', err);
  }
}

const students = generateStudents(numStudents, yearOfAdmission); 
saveStudentsToFile(filename, students);