const categories = {
  VEGETABLE: {
    id: "vegetables",
    name: "Vegetables and legumes/beans",
  },
  GRAIN: {
    id: "grain",
    name: "Grain (cereal) foods",
  },
  MEAL: {
    id: "meal",
    name:
      "Lean meats and poultry, fish, eggs, tofu, nuts and seeds and legumes/beans",
  },
  LACTOSE: {
    id: "lactose",
    name: "Milk, yoghurt cheese and/or alternatives",
  },
};
const data = [
  // VEGETABLES
  {
    name: "Broccoli",
    category: categories.VEGETABLE,
    price: 0.25,
  },
  {
    name: "Brussels sprouts",
    category: categories.VEGETABLE,
    price: 0.31,
  },
  {
    name: "Bok choy, cabbages",
    category: categories.VEGETABLE,
    price: 0.34,
  },
  {
    name: "Cauliflower",
    category: categories.VEGETABLE,
    price: 0.15,
  },
  {
    name: "Kale",
    category: categories.VEGETABLE,
    price: 0.7,
  },
  // GRAIN
  {
    name: "Bread",
    category: categories.GRAIN,
    price: 0.2,
  },
  {
    name: "Rice",
    category: categories.GRAIN,
    price: 0.4,
  },
  {
    name: "Pasta",
    category: categories.GRAIN,
    price: 0.3,
  },

  // MEAL
  {
    name: "Beef",
    category: categories.MEAL,
    price: 5.2,
  },
  {
    name: "Lamb",
    category: categories.MEAL,
    price: 7.5,
  },
  {
    name: "Veal",
    category: categories.MEAL,
    price: 6.0,
  },
  {
    name: "Pork",
    category: categories.MEAL,
    price: 4.2,
  },
  {
    name: "Kangaroo",
    category: categories.MEAL,
    price: 10.5,
  },

  // LACTOSE
  {
    name: "Milk",
    category: categories.LACTOSE,
    price: 0.5,
  },
  {
    name: "Yoghurt",
    category: categories.LACTOSE,
    price: 0.8,
  },
  {
    name: "Cheese",
    category: categories.LACTOSE,
    price: 1.0,
  },
];
let tempTotal = 0;
let itemsTotal = 0;
let amount = 1;
let cart = [];
let buttonsDOM = [];

const table = document.getElementById('table');
const selectCat = document.querySelector('select');
const showResult = document.getElementById('showResult');


class UI {
  displayProducts(products) {
    let number = 0
    let result = "";
    const tbody = document.createElement('tbody');
    products.forEach(product => {
      number++;
      result += `
      <tr class="product" data-name=${product.name} data-id=${product.category.id} data-price=${product.price} data-number=${number}>
      <td>${product.category.name}</td>
      <td>${product.name}</td>
      <td class="td none">${amount}</td>
      <td>$${product.price}</td>
      <td><span class="delete">(-)</span><span class="select">Select</span><span data-name=${product.name} class="add">(+)</span></td>
    </tr>`;
    tbody.innerHTML = result;
    table.appendChild(tbody);
    })
  }
  filterProducts() {
    selectCat.addEventListener('click', e => {
      let products = document.querySelectorAll('.product');
      products.forEach(product => {
        product.classList.add('none');
        let category = product.dataset.id;
        let selectVal = e.target.value;
        if(selectVal == category) {
          product.classList.remove('none');
        }
        if(selectVal == '') {
          product.classList.remove('none');
        }
      })
    })
  }

  getPlusButtons() {
    let table = document.querySelector('#table')
    const buttonsPlus = [...table.querySelectorAll('.add')];
    buttonsDOM = buttonsPlus;
    buttonsPlus.forEach(button => {
      let id = button.dataset.name;
      let inCart = cart.find(item => item.name === id);
      button.addEventListener('click', event => {
        let cartItem = {...Storage.getProduct(id), amount: 1};
        cart = [...cart, cartItem];
        Storage.saveCart(cart);
        this.addCartItem(cartItem);
      })
    })
  }
  setCartValues(cart) {
    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    })
    console.log(parseFloat(tempTotal.toFixed(2)));
    console.log(itemsTotal); 
  }
  addCartItem(product) {
  let newTr = document.createElement('tr');
  newTr.dataset.name = product.name
  newTr.dataset.price = product.price
  newTr.classList.add('prodCart');
  newTr.innerHTML = `
      <td>${product.category.name}</td>
      <td>${product.name}</td>
      <td class="td">${product.amount}</td>
      <td>$${product.price}</td>
      <td><span class="delete">(-)</span><span class="select">Remove</span><span data-name=${product.name} class="add">(+)</span></td>`;
    showResult.appendChild(newTr);
    this.addAmount()
    this.removeAmount()
    this.removeElementFromCart()
  }
  setupAPP() {
    cart = Storage.getCart();
    this.populateCart(cart);
  }
  populateCart(cart) {
    cart.forEach(item => this.addCartItem(item));
  }
  clearElementCart() {
    let selectBtn = showResult.querySelectorAll('.select');
    selectBtn.forEach(btn => {
      btn.addEventListener('click', e => {
        let element = e.target.parentElement.parentElement;
        let name = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML;
        console.log(name);
        showResult.removeChild(element);
        let cart = Storage.getCart();
        console.log(cart);
        let item = cart.find(cart => cart.name == name);
        let i = cart.indexOf(item);
        cart.splice(i, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
      })
    })
  }
  removeElementFromCart() {
    let table = document.querySelector('#table')
    let deleteBtns = table.querySelectorAll('.delete');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        let cart = Storage.getCart();
        let name = e.target.parentElement.parentElement.dataset.name;
        let prodCart = showResult.querySelectorAll('.prodCart');
          prodCart.forEach(prod=>{
            let id = prod.dataset.name;
          if(name == id) {
            showResult.removeChild(prod)
          }
        })
        let inCart = cart.find(item=> item.name == name);
        let i = cart.indexOf(inCart);
        cart.splice(i,1);
        localStorage.setItem('cart', JSON.stringify(cart));
      })
    })
  }
  addAmount() {
    let addAmountBtns = showResult.querySelectorAll('.add');
    addAmountBtns.forEach(btn=>{
      btn.addEventListener('click',(e)=>{
        let parent = e.target.parentElement.parentElement;
        let price = parent.dataset.price
        let name = parent.querySelector('.td').previousElementSibling;
        let amount = parent.querySelector('.td');
        amount.innerHTML++;
        this.setCost(parent)
        let cartItem = cart.find(item=> item.name == name.innerHTML);
        cartItem.amount++;
        cartItem.price = (cartItem.amount * price).toFixed(2);
        localStorage.setItem('cart',JSON.stringify(cart))
      })
    })
  }
  removeAmount() {
    let cart = Storage.getCart();
    let removeAmountBtns = showResult.querySelectorAll('.delete');
    removeAmountBtns.forEach(btn=>{
      btn.addEventListener('click',(e)=>{
        let parent = e.target.parentElement.parentElement;
        let name = parent.querySelector('.td').previousElementSibling;
        let price = parent.dataset.price
        let amount = parent.querySelector('.td');
        amount.innerHTML--;
        if(amount.innerHTML == 0){
          showResult.removeChild(parent)
        }
        this.setCost(parent)
        let cartItem = cart.find(item=> item.name == name.innerHTML);
        cartItem.amount--;
        cartItem.price = (cartItem.amount * price).toFixed(2);
        if(cartItem.amount == 0){
          let i = cart.indexOf(cartItem);
          cart.splice(i,1);
        }
        localStorage.setItem('cart',JSON.stringify(cart))

      })
    })
  }
  setCost(parent) {
    let amount = parent.querySelector('.td');
    let price = parent.dataset.price;
    let cost = parent.querySelector('.td').nextElementSibling;
    cost.innerHTML = '$' +(Number(price)*Number(amount.innerHTML)).toFixed(2);
  }
}

class Storage {
  static saveProducts(products) {
  localStorage.setItem('products', JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.name === id);
  }
  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const ui = new UI();
  ui.setupAPP();
  ui.displayProducts(data);
  ui.filterProducts();
  Storage.saveProducts(data);
  ui.getPlusButtons();
  ui.clearElementCart();
  ui.removeElementFromCart();
  ui.addAmount();
  ui.removeAmount()
})


