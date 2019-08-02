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
  }
  static age = 44444;
}

let student = new Student("fdsa", 1111);
// Student.weight();
student.height();

// 节流
function throttle(fn, delay) {
  let timer = null;
  return function() {
    let args = arguments;
    let _this = this;
    if (timer == null) {
      setTimeout(() => {
        fn.apply(_this, args);
        clearTimeout(timer);
        timer = null;
      }, delay);
    }
  };
}

// 防抖

function debounce(fn, wait) {
  let timer = null;
  return function() {
    let _this = this;
    let args = arguments;
    if (timer != null) {
      clearTimeout(timer);
    }
    setTimeout(() => {
      fn.apply(_this, wait);
    }, wait);
  };
}

// 继承
// function Person() {
//   this.name = "xiaowang"
//   this.sex = "man"
// }

// function Student() {
//   Person.call(this)
// }

// function exten(Target, Origin) {
//   function F() {}
//   F.prototype = Origin.prototype
//   Target.prototype = new F()
//   Target.constructor = Target
// }

// exten(Student, Person)

// let student = new Student()
// console.log(student.name)
