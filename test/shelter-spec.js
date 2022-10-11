const { expect } = require("chai");

const Pet = require("../class/pet.js");
const Shelter = require("../class/shelter.js");
const FosterFamily = require("../class/foster-family.js");
const ForeverFamily = require("../class/forever-family.js");

describe("FosterFamily class", function () {

    it("should set last name and pet capacity on creation, and should have past pets and current pets attributes", function () {
        let family1 = new FosterFamily("Smith", 4);
        let family2 = new FosterFamily("Brown", 2);

        expect(family1.lastName).to.equal("Smith");
        expect(family2.lastName).to.equal("Brown");

        expect(family1.capacity).to.equal(4);
        expect(family2.capacity).to.equal(2);

        expect(family1.currentPets).to.deep.equal([]);
        expect(family1.pastPets).to.deep.equal([]);

        expect(family2.currentPets).to.deep.equal([]);
        expect(family2.pastPets).to.deep.equal([]);
    });


    it("should allow foster family to add and remove pets, without going over their capacity", function () {
        let family = new FosterFamily("Brown", 2);
        let rufus = new Pet("Rufus", "Dog");
        let snowstorm = new Pet("Snowstorm", "Cat");
        let fluffy = new Pet("Fluffy", "Chicken");

        family.addPet(rufus);
        expect(family.currentPets.length).to.equal(1);
        family.addPet(snowstorm);
        expect(family.currentPets.length).to.equal(2);

        expect(family.addPet.bind(family, fluffy)).to.throw(Error);
        expect(family.currentPets.length).to.equal(2);

        family.removePet(rufus);
        expect(family.currentPets.length).to.equal(1);
        expect(family.currentPets).to.include(snowstorm);

        expect(family.removePet.bind(family, rufus)).to.throw(Error);
    });
});


describe("Pet class", function() {

    it("should set name and pet type on creation", function () {
        let rufus = new Pet("Rufus", "Dog");
        let snowstorm = new Pet("Snowstorm", "Cat");

        expect(rufus.name).to.equal("Rufus");
        expect(rufus.petType).to.equal("Dog");

        expect(snowstorm.name).to.equal("Snowstorm");
        expect(snowstorm.petType).to.equal("Cat");
    });


    it("is only adoptable if it has a name, and is a cat, dog, mouse, chicken, or rabbit", function() {
        let adoptablePet1 = new Pet("Ginger", "Chicken");
        let adoptablePet2 = new Pet("Frodo", "Dog");
        let notAdoptablePet1 = new Pet();
        let notAdoptablePet2 = new Pet("Joey");
        let notAdoptablePet3 = new Pet("Ruby", "Snake");

        expect(adoptablePet1.isAdoptable()).to.be.true;
        expect(adoptablePet2.isAdoptable()).to.be.true;
        expect(notAdoptablePet1.isAdoptable()).to.be.false;
        expect(notAdoptablePet2.isAdoptable()).to.be.false;
        expect(notAdoptablePet3.isAdoptable()).to.be.false;
    })
});

describe("Shelter class", function() {

    it("should allow adoptable pets into the shelter", function() {
        let adoptablePet1 = new Pet("Ginger", "Chicken");
        let adoptablePet2 = new Pet("Frodo", "Dog");
        let shelter = new Shelter();

        shelter.addPet(adoptablePet1);

        expect(shelter.pets.length).to.equal(1);

        shelter.addPet(adoptablePet2);
        expect(shelter.pets.length).to.equal(2);

        expect(shelter.pets).to.include(adoptablePet2);
    });


    it("should not allow non-adoptable pets into the shelter", function() {
        let notAdoptablePet1 = new Pet("Joey");
        let notAdoptablePet2 = new Pet("Ruby", "Snake");
        let shelter = new Shelter();

        expect(shelter.addPet.bind(shelter, notAdoptablePet1)).to.throw(Error);
        expect(shelter.addPet.bind(shelter, notAdoptablePet2)).to.throw(Error);
    });


    it("should add an arbitrary number of pets to the shelter at once", function() {
        let pet1 = new Pet("Ginger", "Chicken");
        let pet2 = new Pet("Frodo", "Dog");
        let pet3 = new Pet("Rufus", "Dog");
        let pet4 = new Pet("Snowstorm", "Cat");

        let shelter1 = new Shelter();
        let shelter2 = new Shelter();

        Shelter.bulkAddPets(shelter1, pet1, pet2);
        expect(shelter1.pets.length).to.equal(2);

        Shelter.bulkAddPets(shelter2, pet1, pet2, pet3, pet4);
        expect(shelter2.pets.length).to.equal(4);
    });


    it("should return a short tweet describing all the pets currently in the shelter", function() {
        let pet1 = new Pet("Ginger", "Chicken");
        let pet2 = new Pet("Frodo", "Dog");
        let pet3 = new Pet("Rufus", "Dog");
        let pet4 = new Pet("Snowstorm", "Cat");
        let shelter1 = new Shelter();
        let shelter2 = new Shelter();

        let expectedResult1 = "Today we have 2 pets up for adoption: Ginger (chicken), Frodo (dog)";
        let expectedResult2 = "Today we have 4 pets up for adoption: Ginger (chicken), Frodo (dog), Rufus (dog), Snowstorm (cat)";

        Shelter.bulkAddPets(shelter1, pet1, pet2);
        expect(shelter1.printTweet()).to.equal(expectedResult1);

        Shelter.bulkAddPets(shelter2, pet1, pet2, pet3, pet4);
        expect(shelter2.printTweet()).to.equal(expectedResult2);
    });


    it("should return only the pets of a certain type", function() {
        let pet1 = new Pet("Ginger", "Chicken");
        let pet2 = new Pet("Frodo", "Dog");
        let pet3 = new Pet("Rufus", "Dog");
        let pet4 = new Pet("Snowstorm", "Cat");
        let shelter1 = new Shelter();
        let shelter2 = new Shelter();

        shelter1.addPet(pet1);
        shelter1.addPet(pet2);
        shelter1.addPet(pet3);
        shelter1.addPet(pet4);

        shelter2.addPet(pet1);

        expect(Shelter.searchFor(shelter1, "Cat")).to.have.length(1);
        expect(Shelter.searchFor(shelter1,"Cat")).to.include(pet4);

        expect(Shelter.searchFor(shelter1, "Dog")).to.have.length(2);
        expect(Shelter.searchFor(shelter1, "Dog")).to.include(pet2).and.to.include(pet3);
        expect(Shelter.searchFor(shelter1, "Dog")).to.not.include(pet1);

        expect(Shelter.searchFor(shelter2, "Chicken")).to.include(pet1);
        expect(Shelter.searchFor(shelter2, "Dog")).to.deep.equal([]);
    })
})


describe("Forever Family class", function() {

    it("inherits from the FosterFamily class, and includes adoptionExpenses and expensesPaid attributes", function() {
        let foreverFamily = new ForeverFamily("Smith", 4);
        let fosterFamily = new FosterFamily("Siddiqui", 2);

        expect(foreverFamily.adoptionExpenses).to.equal(0);
        expect(foreverFamily.expensesPaid).to.equal(0);

        expect(fosterFamily.adoptionExpenses).to.be.undefined;
        expect(fosterFamily.expensesPaid).to.be.undefined;

        expect(foreverFamily instanceof ForeverFamily).to.be.true;
        expect(foreverFamily instanceof FosterFamily).to.be.true;
        expect(fosterFamily instanceof FosterFamily).to.be.true;
        expect(fosterFamily instanceof ForeverFamily).to.be.false;
    })
})


describe("Shelter adoption end-to-end adoption tests", function() {

    it("allows a family to take in a new pet if they have capacity", function() {
        let shelter = new Shelter();
        let fosterFamily = new FosterFamily("Brown", 2);
        let pet1 = new Pet("Fluffy", "Dog");
        let pet2 = new Pet("Scruffy", "Cat");
        let pet3 = new Pet("Fluffy", "Dog");

        shelter.addPet(pet1);
        shelter.addPet(pet2);
        shelter.addPet(pet3);

        shelter.doAdoption(fosterFamily, pet1);
        expect(shelter.pets).to.have.length(2);
        expect(shelter.pets).to.not.include(pet1);
        expect(fosterFamily.currentPets).to.include(pet1);

        shelter.doAdoption(fosterFamily, pet2);
        expect(shelter.pets).to.have.length(1);
        expect(shelter.pets).to.not.include(pet2);
        expect(fosterFamily.currentPets).to.include(pet2);
    });


    it("does not allow a family to take in a new pet if they will go over capacity", function() {
        let shelter = new Shelter();
        let fosterFamily = new FosterFamily("Brown", 2);
        let pet1 = new Pet("Fluffy", "Dog");
        let pet2 = new Pet("Scruffy", "Cat");
        let pet3 = new Pet("Fluffy", "Dog");

        shelter.addPet(pet1);
        shelter.addPet(pet2);
        shelter.addPet(pet3);

        shelter.doAdoption(fosterFamily, pet1);
        expect(shelter.pets).to.have.length(2);
        expect(shelter.pets).to.not.include(pet1);
        expect(fosterFamily.currentPets).to.include(pet1);

        shelter.doAdoption(fosterFamily, pet2);
        expect(shelter.pets).to.have.length(1);
        expect(shelter.pets).to.not.include(pet2);
        expect(fosterFamily.currentPets).to.include(pet2);

        expect(() => shelter.doAdoption.call(fosterFamily, pet3)).to.throw(
            Error
        );

        expect(shelter.pets).to.have.length(1);
        expect(shelter.pets).to.include(pet3);
        expect(fosterFamily.currentPets).to.not.include(pet3);
    });


    it("charges a forever family a $25 fee for adoption expenses", function() {
        let shelter = new Shelter();
        let foreverFamily = new ForeverFamily("Smith", 4);
        let pet1 = new Pet("Fluffy", "Dog");
        let pet2 = new Pet("Scruffy", "Cat");
        let pet3 = new Pet("Fluffy", "Dog");

        shelter.addPet(pet1);
        shelter.addPet(pet2);
        shelter.addPet(pet3);

        shelter.doAdoption(foreverFamily, pet1);
        expect(shelter.pets).to.have.length(2);
        expect(shelter.pets).to.not.include(pet1);
        expect(foreverFamily.currentPets).to.include(pet1);
        expect(foreverFamily.adoptionExpenses).to.equal(25);

        shelter.doAdoption(foreverFamily, pet2);
        expect(shelter.pets).to.have.length(1);
        expect(shelter.pets).to.not.include(pet2);
        expect(foreverFamily.currentPets).to.include(pet2);
        expect(foreverFamily.adoptionExpenses).to.equal(50);
    });
});
