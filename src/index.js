document.addEventListener("DOMContentLoaded", () => {
  fetchDogs();
  setUpFilter();
});

let dogs = [];

const fetchDogs = () => {
  fetch("http://localhost:3000/pups")
    .then((res) => res.json())
    .then((data) => {
      dogs = data;
      dogs.forEach((dog) => {
        renderDogNameSpans(dog);
      });
    });
};

const qS = (el) => document.querySelector(el);
const cE = (el) => document.createElement(el);

const removeAllChildNodes = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

const renderDogNameSpans = (dog) => {
  const dogBar = qS("#dog-bar");
  const eachDog = cE("span");
  eachDog.textContent = dog.name;
  eachDog.addEventListener("click", () => displaySingleDog(dog));
  dogBar.append(eachDog);
};

const toggleGoodDog = (dog) => {
  let newGoodStatus = !dog.isGoodDog;

  const goodStatus = {
    isGoodDog: newGoodStatus,
  };

  const configObjPatch = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(goodStatus),
  };

  fetch(`http://localhost:3000/pups/${dog.id}`, configObjPatch)
    .then((res) => res.json())
    .then((dogAfterChange) => {
      displaySingleDog(dogAfterChange);
    });
};

const displaySingleDog = (dog) => {
  const container = qS("#dog-info");
  removeAllChildNodes(container);

  const goodButton = cE("button");
  const dogImage = cE("img");
  const dogName = cE("h2");

  goodButton.innerText = dog.isGoodDog ? "Good Dog!" : "Bad Dog!";
  dogImage.src = dog.image;
  dogName.innerText = dog.name;

  goodButton.addEventListener("click", () => toggleGoodDog(dog));
  container.append(dogName, dogImage, goodButton);
};

const handleFilter = (e, button) => {
  if (e.target.value && button.innerText === "Filter good dogs: ON") {
    e.target.value = "Filter good dogs: OFF";
    button.innerText = "Filter good dogs: OFF";
    removeAllChildNodes(qS("#dog-bar"));
    fetchDogs();
  } else {
    e.target.value = "Filter good dogs: ON";
    button.innerText = "Filter good dogs: ON";
    const goodDogs = dogs.filter((dog) => dog.isGoodDog === true);

    removeAllChildNodes(qS("#dog-bar"));
    goodDogs.forEach(renderDogNameSpans);
  }
};

const setUpFilter = () => {
  const filterButton = qS("#good-dog-filter");
  filterButton.addEventListener("click", (e) => handleFilter(e, filterButton));
};
