document.addEventListener("DOMContentLoaded", () => main());

function main() {
  fetchData().then((data) => renderData(data));
}

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

function fetchJson(url) {
  return fetch(url).then((response) => response.json());
}

function transformCategories(categories, products) {
  return categories
    .map((category) => ({
      name: category,
      products: products.filter((product) => product.category === category),
    }))
    .filter((category) => category.products.length > 0);
}

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

function renderCategoryTab(tabCaptionTemplate, category) {
  const tabCaptionId = "caption_" + category;
  const tabHeader = tabCaptionTemplate.cloneNode(true);
  tabHeader.id = tabCaptionId;
  tabHeader.querySelector("span").textContent = category;
  tabHeader.addEventListener("click", onTabHeaderClick);

  document.querySelector("#tabs-header").appendChild(tabHeader);

  return tabHeader;
}

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

function activateTabs(category) {
  document
    .querySelectorAll(".tab__body.active")
    .forEach((tab) => tab.classList.remove("active"));
  document.querySelector("#tab_" + category).classList.add("active");
}

function activateCaption() {
  document
    .querySelector(".tabs__header")
    .firstElementChild.classList.add("active");
}
