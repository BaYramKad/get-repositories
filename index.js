const contentList = document.querySelector('.content__list');
const contentListAdded = document.querySelector('.content__list-added');
const contentSearchInput = document.querySelector('.content__search-input');

const fragment = document.createDocumentFragment();

let repositories = JSON.parse(window.localStorage.getItem('repositories')) || [];

const deleteRepo = (element, target) => {
  repositories.forEach((rep) => {
    if (element.id === rep.id) {
      target.closest('.content__list-info').remove();
    }
  });
  repositories = repositories.filter((item) => item.id !== element.id);
  localStorage.setItem('repositories', JSON.stringify(repositories));
};

const addSpan = (element) => {
  contentSearchInput.value = '';
  contentList.innerHTML = '';
  const addedElement = document.createElement('li');
  const spanName = document.createElement('span');
  const spanOwner = document.createElement('span');
  const spanStars = document.createElement('span');
  const deleteBtn = document.createElement('button');
  addedElement.classList.add('content__list-info');
  addedElement.id = element.id;

  spanName.textContent = `Name: ${element.name}`;
  spanOwner.textContent = `Owner: ${element.owner.login}`;
  spanStars.textContent = `Stars: ${element.stargazers_count}`;
  addedElement.appendChild(spanName);
  addedElement.appendChild(spanOwner);
  addedElement.appendChild(spanStars);
  addedElement.appendChild(deleteBtn);
  fragment.appendChild(addedElement);
  contentListAdded.appendChild(fragment);

  deleteBtn.addEventListener('click', (event) => {
    deleteRepo(element, event.target);
  });
};

const addRepoToList = (element) => {
  addSpan(element);
  repositories.push(element);
  localStorage.setItem('repositories', JSON.stringify(repositories));
};

window.addEventListener('load', () => {
  if (repositories.length) {
    repositories.forEach((rep) => {
      addSpan(rep);
    });
  }
});

const renderRepositories = (data) => {
  data.forEach((rep) => {
    let contentListChild = document.createElement('li');
    contentListChild.textContent = rep.name;
    contentList.appendChild(contentListChild);
    contentListChild.addEventListener('click', () => addRepoToList(rep));
  });
};

const getRepositories = async (str) => {
  const url = `https://api.github.com/search/repositories?q=${str}&per_page=5`;
  const response = await fetch(url);
  const { items } = await response.json();
  return items;
};

function debounce(callback) {
  let timeout;
  return function () {
    const fnCall = () => callback.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, 500);
  };
}

async function search(event) {
  const value = event.target.value.trim();
  if (!value) {
    contentList.innerHTML = '';
    return;
  }
  contentList.innerHTML = '';
  const data = await getRepositories(value);
  renderRepositories(data);
}

const debouncedCall = debounce(search);

contentSearchInput.addEventListener('keyup', (event) => {
  debouncedCall(event);
});
