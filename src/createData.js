const fs = require('fs');
const path = require('path');

// Đường dẫn file JSON đầu ra
const filename = path.join(__dirname, '../data/dataStudent.json');

// Số lượng sinh viên cần tạo
const numStudents = 100;

// Năm vào trường
const yearOfAdmission = 2022;

// Lớp sinh viên
class Student {
  constructor(id, name, cpa) {
    this.id = id;      // Mã số sinh viên
    this.name = name;  // Tên sinh viên
    this.cpa = cpa;    // Điểm CPA
  }

  // Phương thức tính mức cảnh cáo
  getWarningLevel() {
    if (this.cpa <= 0.5) return 3; // Cảnh cáo mức 3
    if (this.cpa <= 1.0) return 2; // Cảnh cáo mức 2
    if (this.cpa <= 1.5) return 1; // Cảnh cáo mức 1
    return 0; // Không bị cảnh cáo
  }

  // Hiển thị thông tin sinh viên dưới dạng chuỗi
  toString() {
    const warningLevel = this.getWarningLevel();
    return `${this.id} "${this.name}" ${this.cpa} ${warningLevel > 0 ? `Cảnh cáo: ${warningLevel}` : 'Không bị cảnh cáo'}`;
  }
}

// Hàm tạo danh sách sinh viên
function generateStudents(num, year) {
  const students = [];

  for (let i = 0; i < num; i++) {
    const id = `${year}${(i + 1).toString().padStart(4, '0')}`; // ID có dạng "20220001", "20220002", ...
    const name = generateVietnameseName(); // Tên UTF-8 tiếng Việt
    const cpa = parseFloat((Math.random() * 4).toFixed(2)); // CPA từ 0.00 đến 4.00

    const student = new Student(id, name, cpa); // Tạo sinh viên bằng lớp `Student`
    students.push(student);
  }

  return students;
}

// Hàm tạo tên tiếng Việt ngẫu nhiên
function generateVietnameseName() {
  const ho = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng'];
  const dem = ['Văn', 'Thị', 'Hồng', 'Quang', 'Minh', 'Hải', 'Thanh', 'Anh', 'Đức', 'Ngọc'];
  const ten = ['Anh', 'Bình', 'Chi', 'Dung', 'Hương', 'Khang', 'Lan', 'Minh', 'Nhân', 'Phúc'];

  const hoTen = `${ho[randomIndex(ho)]} ${dem[randomIndex(dem)]} ${ten[randomIndex(ten)]}`;
  return hoTen;
}

// Hàm chọn chỉ mục ngẫu nhiên
function randomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

// Ghi dữ liệu sinh viên vào file JSON (Async)
async function saveStudentsToFile(filename, students) {
  try {
    // Chuyển đổi danh sách đối tượng `Student` sang JSON
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

// Tạo và lưu danh sách sinh viên
const students = generateStudents(numStudents, yearOfAdmission); // Truyền tham số yearOfAdmission
saveStudentsToFile(filename, students);