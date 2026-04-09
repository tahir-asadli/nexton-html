const EVENTS = {
  CART_UPDATED: 'cart-updated',
  PRODUCT_ADDED: 'product-added',
  OPEN_CART_DRAWER: 'open-cart-drawer',
  CLOSE_CART_DRAWER: 'close-cart-drawer'
}

const VARIABLES = {
  cart: ['1']
}

document.getElementById('add-to-cart')?.addEventListener('click', (event) => {
  const target = event.currentTarget;
  target.disabled = true;
  setTimeout(() => {
    VARIABLES.cart.push('Product name')
    document.dispatchEvent(new CustomEvent(EVENTS.CART_UPDATED, {
      bubbles: true
    }));
    target.disabled = false;
  }, 500)
});

// document.addEventListener(EVENTS.PRODUCT_ADDED, () => {
//   document.dispatchEvent(new CustomEvent(EVENTS.PRODUCT_ADDED, {
//     bubbles: true
//   }));
// })

class SearchBar extends HTMLElement {
  constructor() {
    super();
    this.handleInput = this.handleInput.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.form = this.querySelector('form');
    this.input = this.form.querySelector('input[name="q"]');
    this.clearButton = this.form.querySelector('[data-clear]');
  }

  connectedCallback() {
    this.input.addEventListener('input', this.handleInput);
    this.clearButton.addEventListener('click', this.handleClear);
    if (this.input.value.trim() !== '') {
      this.clearButton.classList.remove('hidden');
      this.classList.add('search-active');
    } else {
      this.clearButton.classList.add('hidden');
      this.classList.remove('search-active');
    }
  }

  disconnectedCallback() {
    this.clearButton?.removeEventListener('click', this.handleClearButtonClick);
  }

  handleInput() {
    if (this.input.value.trim() !== '') {
      this.clearButton.classList.remove('hidden');
    } else {
      this.clearButton.classList.add('hidden');
    }
  }

  handleClear() {
    this.input.value = '';
    this.clearButton.classList.add('hidden');
    this.input.focus();
  }
}
customElements.define('search-bar', SearchBar);

class CartButton extends HTMLElement {
  constructor() {
    super();
    this.cartCount = this.querySelector('[data-cart-count]');
    this.updateCart = this.updateCart.bind(this);
  }

  connectedCallback() {
    this.updateCart(this, true)
    document.addEventListener(EVENTS.CART_UPDATED, this.updateCart)
  }

  disconnectedCallback() {
    document.removeEventListener(EVENTS.CART_UPDATED, this.updateCart);
  }

  updateCart(self, initial = false) {
    this.cartCount.textContent = VARIABLES.cart.length ? VARIABLES.cart.length : '';
    if (initial !== true) {
      this.cartCount.classList.add('animate-cart');
      setTimeout(() => {
        this.cartCount.classList.remove('animate-cart');
      }, 500);
    }
  }
}

customElements.define('cart-button', CartButton)