export interface IStudentModel {
  studentNo: number;
  studentName: string;
  program: string;
}

export class StudentModel implements IStudentModel {
  studentNo: number;
  studentName: string;
  program: string;

  constructor(studentNo: number = 0, studentName: string = "", program: string = "") {
    this.studentNo = studentNo;
    this.studentName = studentName;
    this.program = program;
  }
}