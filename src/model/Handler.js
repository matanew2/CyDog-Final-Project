class Handler {
  constructor(name, id, dog) {
    this.name = name;
    this.id = id;
    this.dog = dog;
  }

  convertToJson() {
    return JSON.stringify(this);
  }
}

module.exports = Handler;
