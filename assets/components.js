const EVENTS = {
  CART_UPDATED: 'cart-updated',
  PRODUCT_ADDED: 'product-added',
  OPEN_CART_DRAWER: 'open-cart-drawer',
  CLOSE_CART_DRAWER: 'close-cart-drawer'
}

const VARIABLES = {
  cart: []
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
    this.cartButton = this.querySelector('[data-button]');

    this.updateCart = this.updateCart.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  connectedCallback() {
    this.updateCart(this, true)
    document.addEventListener(EVENTS.CART_UPDATED, this.updateCart)
    this.cartButton.addEventListener('click', this.toggleDrawer)
  }

  disconnectedCallback() {
    document.removeEventListener(EVENTS.CART_UPDATED, this.updateCart);
    this.cartButton.removeEventListener('click', this.toggleDrawer);
  }

  updateCart(self, initial = false) {
    this.cartCount.textContent = VARIABLES.cart.length ? VARIABLES.cart.length : '';
    if (initial !== true) {
      this.cartCount.classList.add('animate-cart');
      setTimeout(() => {
        this.cartCount.classList.remove('animate-cart');
        document.dispatchEvent(new CustomEvent(EVENTS.OPEN_CART_DRAWER, {
          bubbles: true
        }));
      }, 500);
    }
  }

  toggleDrawer() {
    document.dispatchEvent(new CustomEvent(document.documentElement.classList.contains('cart-drawer-open') ? EVENTS.CLOSE_CART_DRAWER : EVENTS.OPEN_CART_DRAWER, {
      bubbles: true
    }));
  }
}

customElements.define('cart-button', CartButton)

class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.closeButton = this.querySelector('[data-close]')
    this.drawer = this.querySelector('[data-drawer]')
    this.overlay = this.querySelector('[data-overlay]')

    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
  }

  connectedCallback() {
    document.addEventListener(EVENTS.OPEN_CART_DRAWER, this.openDrawer)
    document.addEventListener(EVENTS.CLOSE_CART_DRAWER, this.closeDrawer)
    this.closeButton.addEventListener('click', this.closeDrawer)
    this.overlay.addEventListener('click', this.closeDrawer)
  }

  disconnectedCallback() {
    document.removeEventListener(EVENTS.OPEN_CART_DRAWER, this.openDrawer);
    document.removeEventListener(EVENTS.CLOSE_CART_DRAWER, this.closeDrawer);
    this.closeButton.removeEventListener('click', this.closeDrawer)
    this.overlay.removeEventListener('click', this.closeDrawer)
  }

  openDrawer() {
    document.documentElement.classList.add('cart-drawer-open');
  }
  closeDrawer() {
    document.documentElement.classList.remove('cart-drawer-open');
  }
}

customElements.define('cart-drawer', CartDrawer)