const filters = document.querySelector('#filters');

filters.addEventListener('input', filterGoods);

function filterGoods() {
  const
    developer = filters.querySelector('#developer').value,
    connection = [...filters.querySelectorAll('#connection input:checked')].map(n => n.value),
    color = [...filters.querySelectorAll('#color input:checked')].map(n => n.value),
    form = [...filters.querySelectorAll('#form input:checked')].map(n => n.value),
    face = [...filters.querySelectorAll('#face input:checked')].map(n => n.value),
    priceMin = document.querySelector('#price-min').value,
    priceMax = document.querySelector('#price-max').value;

  outputGoods(DATA.filter(n => (
    (!developer || n.developer === developer) &&
    (!color.length || color.includes(n.color)) &&
    (!connection.length || connection.includes(n.connection)) &&
    (!form.length || form.includes(n.form)) &&
    (!face.length || face.includes(n.face)) &&
    (!priceMin || priceMin <= n.cost) &&
    (!priceMax || priceMax >= n.cost)
  )));
}

function outputGoods(goods) {
  document.getElementById('goods').innerHTML = goods.map(n => `
    <div class="single-goods">
      <h3>${n.name}</h3>
      <img src="${n.image}">
      <p>Цена: ${n.cost}</p>
      <button class="add-to-cart" data-art="${n.name}">Купить</button>
    </div>
  `).join('');
}

const DATA = [
  {
    "color" : "black",
    "name" : " Logitech G102",
    "cost" : 2850,
    "developer" : "Logitech",
    "image" : "https://c.dns-shop.ru/thumb/st4/fit/0/0/aa89e564bd6581cc019681e3cee72f62/a131f53a2c5644d07b7d535eb3a2743917b33abbafd1ee834f00442d4003bc90.jpg.webp",
    "connection": "wire",
    "form" : "simm",
    "face" : "glossy"
  },
  {
    "color" : "white",
    "name" : "A4Tech Bloody W60 Max",
    "cost" : 3299,
    "developer" : "Bloody",
    "image" : "https://micro-line.ru/images/detailed/1334/1405069_v01_b.jpg",
    "connection": "wire",
    "form" : "assim",
    "face" : "mat"
  },
  {
    "color" : "pink",
    "name" : "Razer Orochi V2, Quartz",
    "cost" : 4841,
    "developer" : "Razer",
    "image" : "https://avatars.mds.yandex.net/get-mpic/7552302/img_id3942244028165498203.jpeg/optimize",
    "connection": "wireless",
    "form" : "simm",
    "face" : "mat"
  },
  {
    "color" : "black",
    "name" : "Zowie EC2-CW",
    "cost" : 23990,
    "developer" : "Zowie",
    "image" : "https://shop.benq.ru/upload/iblock/83e/wnfcibnqate3g8gc5bzrkoniv5ub2nn2.png",
     "connection": "wireless",
     "form" : "asimm",
     "face" : "glossy"
  }
];

outputGoods(DATA);

function toNum(str) {
  const num = Number(str.replace(/ /g, ""));
  return num;
}

function toCurrency(num) {
  const format = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(num);
  return format;
}

const cardAddArr = Array.from(document.querySelectorAll(".card__add"));
const cart__num = document.querySelector("#cart_num");
const cart = document.querySelector("#cart");
const popup = document.querySelector(".popup");
const popupClose = document.querySelector("#popup_close");
const body = document.body;
const popupContainer = document.querySelector("#popup_container");
const popupProductList = document.querySelector("#popup_product_list");
const popupCost = document.querySelector("#popup_cost");
const popupDiscount = document.querySelector("#popup_discount");
const popupCostDiscount = document.querySelector("#popup_cost_discount");

cart.addEventListener("click", (e) => {
  e.preventDefault();
  popup.classList.add("popup--open");
  body.classList.add("lock");
});

popupClose.addEventListener("click", (e) => {
  e.preventDefault();
  popup.classList.remove("popup--open");
  body.classList.remove("lock");
});

class Product {
  imageSrc;
  name;
  price;
  priceDiscount;
  constructor(card) {
    this.imageSrc = card.querySelector(".card__image").children[0].src;
    this.name = card.querySelector(".card__title").innerText;
    this.price = card.querySelector(".card__price--common").innerText;
    this.priceDiscount = card.querySelector(".card__price--discount").innerText;
  }
}

const cardAddArr = Array.from(document.querySelectorAll(".card__add"));
const cartNum = document.querySelector("#cart_num");

class Cart {
  products;
  constructor() {
    this.products = [];
  }
  get count() {
    return this.products.length;
  }
  addProduct(product) {
    this.products.push(product);
  }
  removeProduct(index) {
    this.products.splice(index, 1);
  }
  get cost() {
    const prices = this.products.map((product) => {
      return toNum(product.price);
    });
    const sum = prices.reduce((acc, num) => {
      return acc + num;
    }, 0);
    return sum;
  }
  get costDiscount() {
    const prices = this.products.map((product) => {
      return toNum(product.priceDiscount);
    });
    const sum = prices.reduce((acc, num) => {
      return acc + num;
    }, 0);
    return sum;
  }
  get discount() {
    return this.cost - this.costDiscount;
  }
}

const myCart = new Cart();

if (localStorage.getItem("cart") == null) {
  localStorage.setItem("cart", JSON.stringify(myCart));
}

const savedCart = JSON.parse(localStorage.getItem("cart"));
myCart.products = savedCart.products;
cartNum.textContent = myCart.count;

myCart.products = cardAddArr.forEach((cardAdd) => {
  cardAdd.addEventListener("click", (e) => {
    e.preventDefault();
    const card = e.target.closest(".card");
    const product = new Product(card);
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    myCart.products = savedCart.products;
    myCart.addProduct(product);
    localStorage.setItem("cart", JSON.stringify(myCart));
    cartNum.textContent = myCart.count;
  });
});

function popupContainerFill() {
  popupProductList.innerHTML = null;
  const savedCart = JSON.parse(localStorage.getItem("cart"));
  myCart.products = savedCart.products;
  const productsHTML = myCart.products.map((product) => {
    const productItem = document.createElement("div");
    productItem.classList.add("popup__product");

    const productWrap1 = document.createElement("div");
    productWrap1.classList.add("popup__product-wrap");
    const productWrap2 = document.createElement("div");
    productWrap2.classList.add("popup__product-wrap");

    const productImage = document.createElement("img");
    productImage.classList.add("popup__product-image");
    productImage.setAttribute("src", product.imageSrc);

    const productTitle = document.createElement("h2");
    productTitle.classList.add("popup__product-title");
    productTitle.innerHTML = product.name;

    const productPrice = document.createElement("div");
    productPrice.classList.add("popup__product-price");
    productPrice.innerHTML = toCurrency(toNum(product.priceDiscount));

    const productDelete = document.createElement("button");
    productDelete.classList.add("popup__product-delete");
    productDelete.innerHTML = "✖";

    productDelete.addEventListener("click", () => {
      myCart.removeProduct(product);
      localStorage.setItem("cart", JSON.stringify(myCart));
      popupContainerFill();
    });

    productWrap1.appendChild(productImage);
    productWrap1.appendChild(productTitle);
    productWrap2.appendChild(productPrice);
    productWrap2.appendChild(productDelete);
    productItem.appendChild(productWrap1);
    productItem.appendChild(productWrap2);

    return productItem;
  });

  productsHTML.forEach((productHTML) => {
    popupProductList.appendChild(productHTML);
  });

  popupCost.value = toCurrency(myCart.cost);
  popupDiscount.value = toCurrency(myCart.discount);
  popupCostDiscount.value = toCurrency(myCart.costDiscount);
}