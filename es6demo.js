class Person {
  constructor(name) {
    this.name = name;
    this.age = 23423;
  }
  height() {
    console.log(1);
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
Student.weight();
student.height();
