const readline = require('readline');
const utils = require('./studentUtils');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function showHelp() {
  console.log('\nDanh sách lệnh:');
  console.log('  list                     - Hiển thị danh sách sinh viên');
  console.log('  find <mssv>              - Tìm sinh viên theo MSSV');
  console.log('  modify cpa <mssv> <cpa>  - Cập nhật CPA của sinh viên');
  console.log('  findtop <n>              - Tìm n sinh viên có CPA cao nhất');
  console.log('  findbottom <n>           - Tìm n sinh viên có CPA thấp nhất');
  console.log('  findcanhcao              - Tìm sinh viên bị cảnh cáo');
  console.log('  cnt <a> <b>              - Đếm số sinh viên có CPA trong khoảng [a, b]');
  console.log('  suspended <mm/yyyy>      - Tìm số sinh viên bị đình chỉ');
  console.log('  exit                     - Thoát chương trình\n');
}

async function prompt() {
  rl.question('>> Nhập lệnh: ', async (command) => {
    const [action, ...args] = command.trim().split(' ');

    switch (action) {
      case 'list': {
        const students = await utils.readStudents();
        students.forEach((s) => console.log(`${s.id} ${s.name}`));
        break;
      }

      case 'find': {
        const mssv = args[0];
        const student = await utils.findStudent(mssv);
        if (student) {
          let canhcao = 0;
          if (student.cpa <= 0.5) canhcao = 3;
          else if (student.cpa <= 1.0) canhcao = 2;
          else if (student.cpa <= 1.5) canhcao = 1;
          console.log(`${student.id} "${student.name}" ${student.cpa} ${canhcao > 0 ? `Cảnh cáo: ${canhcao}` : 'Không bị cảnh cáo'}`);
        } else {
          console.log('Không tìm thấy sinh viên.');
        }
        break;
      }

      case 'modify': {
        if (args[0] === 'cpa') {
          const mssv = args[1];
          const newCpa = args[2];
          const updatedStudent = await utils.modifyCpa(mssv, newCpa);
          if (updatedStudent) {
            console.log(`Cập nhật CPA: ${updatedStudent.id} ${updatedStudent.cpa}`);
          } else {
            console.log('Không tìm thấy sinh viên.');
          }
        } else {
          console.log('Lệnh không hợp lệ. Hãy dùng: modify cpa <mssv> <cpa>');
        }
        break;
      }

      case 'findtop': {
        const n = parseInt(args[0], 10);
        const topStudents = await utils.findTop(n);
        topStudents.forEach((s) => console.log(s.id));
        break;
      }

      case 'findbottom': {
        const n = parseInt(args[0], 10);
        const bottomStudents = await utils.findBottom(n);
        bottomStudents.forEach((s) => console.log(s.id));
        break;
      }

      case 'findcanhcao': {
        const warnedStudents = await utils.findCanhCao();
        warnedStudents.forEach((s) => console.log(`${s.id} ${s.name} CPA: ${s.cpa} Mức cảnh cáo: ${s.canhCao}`));
        break;
      }

      case 'cnt': {
        const [a, b] = args.map(parseFloat);
        const count = await utils.countInRange(a, b);
        console.log(`Số sinh viên trong khoảng CPA [${a}, ${b}]: ${count}`);
        break;
      }

      case 'suspended': {
        const currentMonthYear = args[0];
        const suspendedCount = await utils.suspendedStudents(currentMonthYear);
        console.log(`Số sinh viên bị đình chỉ: ${suspendedCount}`);
        break;
      }

      case 'help': {
        showHelp();
        break;
      }

      case 'exit': {
        console.log('Thoát chương trình.');
        rl.close();
        return;
      }

      default: {
        console.log('Lệnh không hợp lệ. Nhập "help" để xem danh sách lệnh.');
      }
    }

    prompt(); // Lặp lại để chờ lệnh tiếp theo
  });
}

console.log('Hệ thống quản lý sinh viên ĐHBK Hà Nội');
showHelp();
prompt();