document.addEventListener("DOMContentLoaded", () => main());

function main() {
  const readProduct = readJson("js/products.json");
  const readCategories = readJson("js/categories.json");

  Promise.all([readCategories, readProduct]).then(([categories, products]) => {
    renderCategories(getTabsObj(categories, products));
  });
}

function readJson(uri) {
  return fetch(uri).then((response) => response.json());
}

//////////////////////////////////////////////////////////////////////////////
////////////////////////////Отрисовка табов одной категории///////////////////////
function renderTabs(categoryObj, index) {
  categoryObj.products.forEach(function (item) {
    document.getElementById(
      `category-${index + 1}`
    ).innerHTML += `<li class="products__bar-list-item">${item.productName}</li>`;
  });
}

///////////////////////////////////////////////////////////////////////
////////////////////////////Рендеринг категорий////////////////////////
function renderCategories(tabsArray) {
  tabsArray.forEach(function (item, index) {
    document.querySelector(
      ".products__nav-list_js"
    ).innerHTML += `<li class="products__nav-list-item">
  <button type="button" class="product__button">${item.categoryName}</button>
</li>`;
    document.querySelector(
      ".products__bar_js"
    ).innerHTML += `<ul id="category-${item.categoryId}" class="products__bar-list hidden-item"></ul>`;

    renderTabs(tabsArray[index], index);
  });
  document
    .querySelectorAll(".products__bar-list")[0]
    .classList.remove("hidden-item");
  document
    .querySelectorAll(".product__button")[0]
    .classList.add("product__btn-active_js");
  buttonClick();
}

/////////////////////////////Получить финальный объект/////////////////////////////////////
function getTabsObj(categories, products) {
  categories.forEach(function (item) {
    item.products = products.filter((i) => i.categoryId === item.categoryId);
  });
  return categories;
}
///////////////////////////////////////////////////////////////////////////
///////////////////////////Нажатие на вкладку//////////////////////////////
function buttonClick() {
  const buttons = [...document.querySelectorAll(".product__button")];
  const tabList = [...document.querySelectorAll(".products__bar-list")];
  buttons.forEach(function (button) {
    button.addEventListener("click", () => {
      document
        .querySelector(".product__btn-active_js")
        .classList.remove("product__btn-active_js");
      event.target.classList.add("product__btn-active_js");
      document.querySelectorAll(".products__bar-list").forEach(function (item) {
        if (!item.classList.contains("hidden-item")) {
          item.classList.add("hidden-item");
        }
      });
      for (let i = 0; i < tabList.length; i++) {
        if (buttons[i].classList.contains("product__btn-active_js")) {
          tabList[i].classList.remove("hidden-item");
        }
      }
    });
  });
}
