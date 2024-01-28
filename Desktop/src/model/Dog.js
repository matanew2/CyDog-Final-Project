class Dog {
    constructor(name, breed) {
        this.name = name;
        this.breed = breed;
    }

    convertToJson() {
        return JSON.stringify(this);
    }
}

