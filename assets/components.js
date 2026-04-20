const EVENTS = {
  CART_UPDATED: 'cart-updated',
  PRODUCT_ADDED: 'product-added',
  OPEN_CART_DRAWER: 'open-cart-drawer',
  CLOSE_CART_DRAWER: 'close-cart-drawer'
}

const VARIABLES = {
  cart: []
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

  updateCart(event, initial = false) {
    console.log(event.detail);

    this.cartCount.textContent = cart.count ? cart.count : '';
    if (initial !== true) {
      this.cartCount.classList.add('animate-cart');
      this.cartCount.classList.remove('animate-cart');
      document.dispatchEvent(new CustomEvent(EVENTS.OPEN_CART_DRAWER, {
        bubbles: true
      }));
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
    this.drawerContent = this.querySelector('[data-drawer-content]')
    this.overlay = this.querySelector('[data-overlay]')

    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.onEscape = this.onEscape.bind(this);
  }

  connectedCallback() {
    document.addEventListener(EVENTS.OPEN_CART_DRAWER, this.openDrawer)
    document.addEventListener(EVENTS.CLOSE_CART_DRAWER, this.closeDrawer)
    document.addEventListener('keydown', this.onEscape);
    // this.closeButton.addEventListener('click', this.closeDrawer)
    this.overlay.addEventListener('click', this.closeDrawer)
  }


  disconnectedCallback() {
    document.removeEventListener(EVENTS.OPEN_CART_DRAWER, this.openDrawer);
    document.removeEventListener(EVENTS.CLOSE_CART_DRAWER, this.closeDrawer);
    document.removeEventListener('keydown', this.onEscape);
    // this.closeButton.removeEventListener('click', this.closeDrawer)
    this.overlay.removeEventListener('click', this.closeDrawer)
  }

  onEscape(event) {
    if (event.key === 'Escape') {
      this.closeDrawer();
    }
  }

  openDrawer(event) {
    const items = cart.items();
    if (items.length) {
      this.drawerContent.innerHTML = ''
      items.map((item, index) => {
        this.drawerContent.innerHTML += `<cart-item data-index="${index}">
        <div class="flex gap-6 relative py-2">
                  <div class="flex w-24 h-27 shrink-0">
                    <img class="w-full h-full object-contain" src="${item.image}" alt="">
                  </div>
                  <div>
                    <h3 class="font-semibold text-base">${item.title}</h3>
                    <div class="text-brand-gray text-sm">Size: M</div>
                    <div class="text-brand-gray text-sm">Qty: ${item.quantity}</div>
                  </div>
                  <button data-remove class="absolute bottom-0 right-0 size-6 rounded-full flex justify-center items-center cursor-pointer">
                    <svg class="size-4" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                      <path d="M216,50H174V40a22,22,0,0,0-22-22H104A22,22,0,0,0,82,40V50H40a6,6,0,0,0,0,12H50V208a14,14,0,0,0,14,14H192a14,14,0,0,0,14-14V62h10a6,6,0,0,0,0-12ZM94,40a10,10,0,0,1,10-10h48a10,10,0,0,1,10,10V50H94ZM194,208a2,2,0,0,1-2,2H64a2,2,0,0,1-2-2V62H194ZM110,104v64a6,6,0,0,1-12,0V104a6,6,0,0,1,12,0Zm48,0v64a6,6,0,0,1-12,0V104a6,6,0,0,1,12,0Z"></path>
                    </svg>
                  </button>
                  <div class="flex items-center ml-auto">
                    <div class="text-right">
                      <div class="font-semibold">$169.99</div>
                      <div class="text-sm text-brand-gray"><s>$199.99</s></div>
                    </div>
                  </div>
                </div>
                </cart-item>`;

      })
      console.log('this.drawerContent updated', this.drawerContent.scrollHeight);

    } else {
      this.drawerContent.innerHTML = `<div class="py-6 text-center text-brand-gray">Cart is empty</div>`;
    }
    const contentHeight = this.drawerContent.scrollHeight;
    console.log('contentHeight', contentHeight);

    this.drawer.style.height = (contentHeight) + 'px';
    document.documentElement.classList.add('cart-drawer-open');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  closeDrawer() {
    this.drawer.style.height = '0px';
    document.documentElement.classList.remove('cart-drawer-open');
  }
}

customElements.define('cart-drawer', CartDrawer)


class CartItem extends HTMLElement {
  constructor() {
    super();
    this.removeButton = this.querySelector('[data-remove]');
    this.index = this.dataset.index;
  }

  connectedCallback() {
    this.removeButton.addEventListener('click', () => {

      const items = cart.remove(this.dataset.index);
      this.removeButton.closest('cart-item').remove();
      document.dispatchEvent(new CustomEvent(EVENTS.CART_UPDATED, {
        bubbles: true
      }));
    })
  }

  disconnectedCallback() {
  }
}

customElements.define('cart-item', CartItem)

class HeroSlider extends HTMLElement {
  constructor() {
    super();
    this.sliderEl = this.querySelector('.hero-splide');
    this.splide = null;
    this.initSlider = this.initSlider.bind(this);
  }

  connectedCallback() {
    this.initSlider();
  }

  disconnectedCallback() {
    if (!this.splide) return;
    this.splide.destroy();
  }

  initSlider() {
    if (!this.sliderEl) return;
    this.splide = new Splide(this.sliderEl, {
      type: 'loop',
      perPage: 1,
      perMove: 1,
      pagination: true,
      arrows: false,
      autoplay: true,
      interval: 2000,
      speed: 2000

    }).mount();

    this.splide.on('move', (newIndex, prevIndex, destIndex) => {
      const slides = this.splide.Components.Elements.slides;
      const slide = slides[newIndex];
      const title = slide.querySelector('h2');
      const subtitle = slide.querySelector('h4');
      const button = slide.querySelector('.button-container');
      const img = slide.querySelector('img');
      gsap.fromTo(img,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2 }
      );
      gsap.fromTo(subtitle,
        { opacity: 0, y: -60 },
        { opacity: 1, y: 0, duration: 0.3, delay: 0.2 }
      );
      gsap.fromTo(title,
        { opacity: 0, y: -60 },
        { opacity: 1, y: 0, duration: 0.3, delay: 0.2 }
      );
      gsap.fromTo(button,
        { y: -30 },
        { y: 0, duration: 0.3, delay: 0.1 }
      );
    });
  }
}

customElements.define('hero-slider', HeroSlider)

class SplideExplore extends HTMLElement {
  constructor() {
    super();
    this.sliderEl = this.querySelector('.splide-explore');
    this.splide = null;
    this.initSlider = this.initSlider.bind(this);
  }

  connectedCallback() {
    this.initSlider();
  }

  disconnectedCallback() {
    if (!this.splide) return;
    this.splide.destroy();
  }

  initSlider() {
    if (!this.sliderEl) return;
    this.splide = new Splide(this.sliderEl, {
      type: 'loop',
      perPage: 3,
      perMove: 1,
      pagination: true,
      arrows: false,
      autoplay: true,
      interval: 20000,
      speed: 2000,
      gap: 20
    }).mount();

  }
}

customElements.define('splide-explore', SplideExplore)

class ProductCard extends HTMLElement {
  constructor() {
    super();

    this.addToCartButton = this.querySelector('[data-add-to-cart]')
    this.addToCart = this.addToCart.bind(this)
    this.dataUrl = this.querySelector('[data-url]');
    this.dataImg = this.querySelector('[data-img]');
    this.dataTitle = this.querySelector('[data-title]');
    this.dataPrice = this.querySelector('[data-price]');
    console.log('data-add-to-cart', this.addToCartButton);

  }

  connectedCallback() {
    this.addToCartButton.addEventListener('click', this.addToCart);
  }

  disconnectedCallback() {
    this.addToCartButton.removeEventListener('click', this.addToCart);
  }

  addToCart() {
    console.log('this.dataUrl', this.dataUrl.href);

    console.log('this.dataImg', this.dataImg.src);

    console.log('this.dataTitle', this.dataTitle.textContent);

    console.log('this.dataPrice', this.dataPrice.textContent);

    const items = cart.add({
      title: this.dataTitle.textContent,
      quantity: 1,
      price: this.dataPrice.textContent.replace('$', ''),
      image: this.dataImg.src
    })
    document.dispatchEvent(new CustomEvent(EVENTS.CART_UPDATED, {
      bubbles: true
    }));
  }
}

customElements.define('product-card', ProductCard)

class QuantityInput extends HTMLElement {
  constructor() {
    super();

    this.quantityInput = this.querySelector("[type=\"number\"]");
    this.minusButton = this.querySelector("[data-minus]");
    this.plusButton = this.querySelector("[data-plus]");
    this.handleMinusClick = this.handleMinusClick.bind(this);
    this.handlePlusClick = this.handlePlusClick.bind(this);
  }

  connectedCallback() {
    this.minusButton.addEventListener("click", this.handleMinusClick);
    this.plusButton.addEventListener("click", this.handlePlusClick);
  }

  disconnectedCallback() {
    this.minusButton.removeEventListener("click", this.handleMinusClick);
    this.plusButton.removeEventListener("click", this.handlePlusClick);
  }

  handleMinusClick() {
    if (parseInt(this.quantityInput.value) === 1) {
      return;
    }
    this.quantityInput.value = parseInt(this.quantityInput.value) - 1;
    this.quantityInput.dispatchEvent(new Event('change', { bubbles: true }));
  }

  handlePlusClick() {
    const maxQuantity = parseInt(this.quantityInput.getAttribute('max'));
    if (parseInt(this.quantityInput.value) === maxQuantity) {
      return;
    }
    this.quantityInput.value = parseInt(this.quantityInput.value) + 1;
    this.quantityInput.dispatchEvent(new Event('change', { bubbles: true }));
  }

}
customElements.define('quantity-input', QuantityInput)

class ProductForm extends HTMLElement {
  constructor() {
    super();
    this.quantityInput = this.querySelector("[type=\"number\"]");
    this.quantityPrice = this.querySelector("[name=\"price\"]");
    this.addToCartButton = this.querySelector('button[data-add]')
    this.quantities = this.querySelectorAll('span[data-quantity]')
    this.totals = this.querySelectorAll('span[data-total]')
    this.productTitle = this.querySelector('h1[data-title]')
    this.productImage = this.querySelector('img[data-img]')
    this.addToCart = this.addToCart.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }

  connectedCallback() {
    this.addToCartButton.addEventListener("click", this.addToCart);
    this.quantityInput.addEventListener("change", this.updateInfo);
  }

  disconnectedCallback() {
    this.addToCartButton.removeEventListener("click", this.addToCart);
    this.quantityInput.removeEventListener("change", this.updateInfo);
  }

  updateInfo() {
    console.log();
    this.quantities.forEach((el) => {
      el.innerHTML = this.quantityInput.value
    })
    this.totals.forEach((el) => {
      el.innerHTML = Math.round(this.quantityInput.value * this.quantityPrice.value * 100) / 100
    })
  }

  addToCart(e) {
    e.preventDefault();

    const items = cart.add({
      title: this.productTitle.textContent,
      price: this.quantityPrice.value,
      quantity: this.quantityInput.value,
      image: this.productImage.src
    })
    document.dispatchEvent(new CustomEvent(EVENTS.CART_UPDATED, {
      bubbles: true
    }));
  }

}
customElements.define('product-form', ProductForm)