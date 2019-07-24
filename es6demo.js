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
    super(); //代表父类的构造函数
    this.age = age;
  }
  height() {
    super.height(); //指向父类的原型对象
  }
  static weight() {
    super.weight(); //指向父类
    console.log(super.age);
  }
  static age = 44444;
}

let student = new Student("fdsa", 1111);
Student.weight();
student.height();
