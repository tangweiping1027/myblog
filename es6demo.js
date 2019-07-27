class Person {
  constructor(name) {
    this.name = name;
    this.age = 23423;
    this.aaa = 12345678;
  }
  height() {
    console.log(this.aaa);
  }
  static weight() {
    console.log(2);
    console.log(this.age);
  }
  static age = 3333;
}
class Student extends Person {
  constructor(name, age) {
    super();
    this.age = age;
  }
  height() {
    super.height();
  }
  static weight() {
    super.weight();
    console.log(super.age);
  }
  static age = 44444;
}

let student = new Student("fdsa", 1111);
// Student.weight();
student.height();
