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
      // padding: '20px',

    }).mount();

  }
}

customElements.define('splide-explore', SplideExplore)



