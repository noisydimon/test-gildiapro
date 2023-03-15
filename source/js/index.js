//1-Слушатель на  отрисовку страницы//
document.addEventListener("DOMContentLoaded", () => main());

//2-Главная функция (вызов в 1)//
function main() {
  fetchData().then((data) => renderData(data));
}

//3-Функция получения объектов из json при помощи промисов (вызов в 2)//
function fetchData() {
  const fetchCategories = fetchJson(
    "https://dummyjson.com/products/categories"
  );
  const fetchProducts = fetchJson("https://dummyjson.com/products");

  return Promise.all([fetchCategories, fetchProducts]).then(
    ([categories, productsResponse]) =>
      transformCategories(categories, productsResponse.products)
  );
}
//4-Функция обработки json (вызов в 3)//
function fetchJson(url) {
  return fetch(url).then((response) => response.json());
}
//5-Функция создания нового объекта из 2-х что вернулись из проммиса (вызов в 3)//
//map - создаю в массиве объекты с name - категории
//и products - фильтруем те объекты которые совпадают названиями категорий
//отфильтровали объекты где кол-во продуктов больше 0
function transformCategories(categories, products) {
  return categories
    .map((category) => ({
      name: category,
      products: products.filter((product) => product.category === category),
    }))
    .filter((category) => category.products.length > 0);
}
//6-Функция отрисовки вкладок и полей с продуктами (вызов в 2)//
//находим шаблоны и для каждой категории отрисовываем вкладки и продукты
function renderData(data) {
  const tabCaptionTemplate = document.querySelector("#tab-caption-template");
  const tabBodyTemplate = document.querySelector("#tab-body-template");

  data.forEach((category) => {
    renderCategoryTab(tabCaptionTemplate, category.name);
    renderProducts(tabBodyTemplate, category.name, category.products);
  });

  tabCaptionTemplate.remove();
  tabBodyTemplate.remove();

  activateTabs(data[0].name);
  activateCaption();
}
//7-Функция отрисовки вкладок (вызов в 6)//
function renderCategoryTab(tabCaptionTemplate, category) {
  const tabCaptionId = "caption_" + category;
  const tabHeader = tabCaptionTemplate.cloneNode(true);
  tabHeader.id = tabCaptionId;
  tabHeader.querySelector("span").textContent = category;
  tabHeader.addEventListener("click", onTabHeaderClick);

  document.querySelector("#tabs-header").appendChild(tabHeader);

  return tabHeader;
}

//8-Функция отрисовки полей с продуктами (вызов в 6)//
function renderProducts(tabBodyTemplate, category, products) {
  const tabBodyId = "tab_" + category;

  const tabBody = tabBodyTemplate.cloneNode(true);
  tabBody.id = tabBodyId;

  const productTemplate = tabBody.querySelector(".product-template");
  products.forEach((product) => {
    const productNode = productTemplate.cloneNode(true);
    productNode.classList.remove("product-template");
    productNode.querySelector(".product__title").textContent = product.title;
    productNode.querySelector(".product__img").src = product.thumbnail;
    tabBody.appendChild(productNode);
  });
  productTemplate.remove();

  document.querySelector("#tab__body-container").appendChild(tabBody);

  return tabBody;
}
//9-Функция слушателя  (вызов в 7)//
function onTabHeaderClick(event) {
  const tabCaption = event.target.closest(".tabs__header__caption");
  if (!tabCaption) return;

  document
    .querySelectorAll(".tabs__header__caption.active")
    .forEach((caption) => caption.classList.remove("active"));
  tabCaption.classList.add("active");

  const tabHeaderId = event.target.closest(".tabs__header__caption").id;
  const category = tabHeaderId.split("_")[1];

  activateTabs(category);
}
//10-Функция активации вкладки и поля с продуктами  (вызов в 9 и в 6)//
function activateTabs(category) {
  document
    .querySelectorAll(".tab__body.active")
    .forEach((tab) => tab.classList.remove("active"));
  document.querySelector("#tab_" + category).classList.add("active");
}
//10-Функция активации отрисовки  (вызов в 9 и в 6)//
function activateCaption() {
  document
    .querySelector(".tabs__header")
    .firstElementChild.classList.add("active");
}
