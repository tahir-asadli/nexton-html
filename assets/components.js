const EVENTS = {
  CART_UPDATED: 'cart-updated',
  PRODUCT_ADDED: 'product-added',
  OPEN_CART_DRAWER: 'open-cart-drawer',
  CLOSE_CART_DRAWER: 'close-cart-drawer'
}



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