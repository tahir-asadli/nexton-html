class Cart {
  items() {
    return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
  }
  add(product) {
    const items = this.items();
    items.push(product)
    localStorage.setItem('cart', JSON.stringify(items))
    return this.items();
  }
  remove(productIndex) {
    localStorage.setItem('cart', JSON.stringify(this.items().filter((item, index) => index != productIndex)))
    return this.items();
  }
  clear() {
    localStorage.setItem('cart', null);
    return this.items();
  }
  get count() {
    return this.items().length
  }
}

const cart = new Cart();
const PRODUCT_CART_TEMPLATE = `<product-card>
        <div class="product-cart h-full max-w-77.5 relative border border-brand-silver-400 rounded-2xl overflow-hidden">
          <a data-url href="{{url}}" class="flex w-full h-40 sm:h-60 md:h-70 lg:h-85 [&_img]:w-full [&_img]:h-full [&_img]:object-contain">
            <img data-img src="{{featuredImageUrl}}" alt="">
          </a>
          <div class=" p-4 ">
            <div class="flex flex-col md:flex-row gap-2 justify-between">
              <div class="flex flex-col gap-0.25">
                <a href="{{url}}">
                  <h5 data-title>{{product_title}}</h5>
                </a>
                <div class="text-xs md:text-sm text-brand-gray">Accessories</div>
              </div>
              <div class="flex flex-col gap-0.25 md:text-right">
                <div data-price class="text-xs md:text-sm font-semibold">{{price}}</div>
                <div class="text-xs md:text-sm text-brand-gray empty:hidden"><s class="empty:hidden">{{sale_price}}</s></div>
              </div>
            </div>
            <div class="flex justify-between">
            </div>
            <div class="text-xs md:text-sm text-brand-gray"><span class="text-orange-300 text-xl">&starf;</span>4.9(98)</div>
          </div>
          <button data-add-to-cart class="button cloud p-0 max-w-9 h-9 flex gap-0 overflow-hidden justify-start items-center absolute top-4 right-4 group transition-all hover:justify-between hover:max-w-full duration-500 text-nowrap delay-[0]">
            <span class="px-2.5 flex items-center">
              <svg class="size-4 shrink-0 relative top-[-1px] left-[-1px]" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.33329 7.33337C5.70149 7.33337 5.99996 7.63185 5.99996 8.00004C5.99996 9.10461 6.89539 10 7.99996 10C9.10453 10 9.99996 9.10461 9.99996 8.00004C9.99996 7.63185 10.2984 7.33337 10.6666 7.33337C11.0348 7.33337 11.3333 7.63185 11.3333 8.00004C11.3333 9.84098 9.8409 11.3334 7.99996 11.3334C6.15902 11.3334 4.66663 9.84098 4.66663 8.00004C4.66663 7.63185 4.9651 7.33337 5.33329 7.33337Z" fill="currentColor" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3333 4.66663H12.7584C13.8077 4.66663 14.6786 5.47752 14.7534 6.52414L15.1275 11.7625C15.2654 13.692 13.7371 15.3333 11.8027 15.3333H4.19722C2.26275 15.3333 0.734525 13.692 0.872351 11.7625L1.24652 6.52414C1.32128 5.47752 2.19215 4.66663 3.24143 4.66663H4.66661V3.99996C4.66661 2.15902 6.159 0.666626 7.99994 0.666626C9.84088 0.666626 11.3333 2.15902 11.3333 3.99996V4.66663ZM5.99994 4.66663H9.99994V3.99996C9.99994 2.89539 9.10451 1.99996 7.99994 1.99996C6.89537 1.99996 5.99994 2.89539 5.99994 3.99996V4.66663ZM3.24143 5.99996C2.89167 5.99996 2.60138 6.27025 2.57646 6.61912L2.20231 11.8575C2.1196 13.0152 3.03653 14 4.19722 14H11.8027C12.9634 14 13.8803 13.0152 13.7976 11.8575L13.4234 6.61912C13.3985 6.27025 13.1082 5.99996 12.7584 5.99996H3.24143Z" fill="currentColor" />
              </svg>
            </span>
            <span class="text-sm pr-2.5">Add to cart</span>
          </button>
        </div>
      </product-card>`;
const CART_ITEM_TEMPLATE = `<cart-item data-index="{{index}}">
                <div class="flex gap-6 relative">
                  <div class="flex w-24 h-27">
                    <img src="{{image}}" alt="">
                  </div>
                  <div>
                    <h3 class="font-semibold text-base">{{title}}</h3>
                    <div class="text-brand-gray text-sm">Size: M</div>
                    <div class="mt-5">
                      <quantity-input>
                        <button type="button" data-minus>&minus;</button>
                        <input type="number" value="1">
                        <button type="button" data-plus>&plus;</button>
                      </quantity-input>
                    </div>
                  </div>
                  <button data-remove class="absolute top-0 right-0 size-6 rounded-full flex justify-center items-center cursor-pointer">
                    <svg class="size-4" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                      <path d="M216,50H174V40a22,22,0,0,0-22-22H104A22,22,0,0,0,82,40V50H40a6,6,0,0,0,0,12H50V208a14,14,0,0,0,14,14H192a14,14,0,0,0,14-14V62h10a6,6,0,0,0,0-12ZM94,40a10,10,0,0,1,10-10h48a10,10,0,0,1,10,10V50H94ZM194,208a2,2,0,0,1-2,2H64a2,2,0,0,1-2-2V62H194ZM110,104v64a6,6,0,0,1-12,0V104a6,6,0,0,1,12,0Zm48,0v64a6,6,0,0,1-12,0V104a6,6,0,0,1,12,0Z"></path>
                    </svg>
                  </button>
                  <div class="flex items-center ml-auto">
                    <div class="text-right">
                      <div class="font-semibold">\${{price}}</div>
                      <div class="text-sm text-brand-gray"><s>\${{price}}</s></div>
                    </div>
                  </div>
                </div>
              </cart-item>`;
// console.log(cart.add({
//   title: 'Product title',
//   quantity: 1,
//   price: 2
// }));

console.log('cart.count', cart.count, cart.items());


document.addEventListener("DOMContentLoaded", function () {
  const BEST_SELLERS_CONTAINER = document.querySelector('#best-sellers');
  const COLLECTION_PRODUCTS_CONTAINER = document.querySelector('#collection-products');
  const CART_CONTAINER = document.querySelector('#cart-container');
  if (BEST_SELLERS_CONTAINER) {
    fetch('products.json')
      .then(response => response.json()) // Parse the JSON
      .then(products => {
        for (let index in products) {
          const product = products[index];
          const slug = product.slug;
          const price = product.price;
          const sale_price = product.sale_price;
          const url = `/${slug}.html`;
          const featuredImage = product.gallery[0]
          const featuredImageUrl = `${featuredImage}`;
          let productHTML = PRODUCT_CART_TEMPLATE.replaceAll('{{product_title}}', product.title).replaceAll('{{featuredImageUrl}}', featuredImageUrl).replaceAll("{{url}}", url);
          if (sale_price > 0) {
            productHTML = productHTML.replaceAll('{{price}}', `$${sale_price}`)
            productHTML = productHTML.replaceAll('{{sale_price}}', `$${price}`)
          } else {
            productHTML = productHTML.replaceAll('{{price}}', `$${price}`)
            productHTML = productHTML.replaceAll('{{sale_price}}', '')
          }
          BEST_SELLERS_CONTAINER.innerHTML += "\n" + productHTML
        }
      })
      .catch(error => console.error('Error loading JSON:', error));
  }
  if (CART_CONTAINER) {
    const cartItems = cart.items();
    if (cartItems.length) {
      CART_CONTAINER.innerHTML = '';
      cartItems.map((item, index) => {
        const cartItemHTML = CART_ITEM_TEMPLATE.replaceAll('{{title}}', item.title).replaceAll('{{index}}', index).replaceAll('{{price}}', item.price).replaceAll('{{image}}', item.image)
        CART_CONTAINER.innerHTML += cartItemHTML
      })
    } else {
      CART_CONTAINER.innerHTML = '<div class="py-6 text-center text-brand-gray">Cart is empty</div>';
    }
  }
  if (COLLECTION_PRODUCTS_CONTAINER) {
    fetch('products.json')
      .then(response => response.json()) // Parse the JSON
      .then(products => {
        for (let index in products) {
          const product = products[index];
          const slug = product.slug;
          const price = product.price;
          const sale_price = product.sale_price;
          const url = `/${slug}.html`;
          const featuredImage = product.gallery[0]
          const featuredImageUrl = `${featuredImage}`;
          let productHTML = PRODUCT_CART_TEMPLATE.replaceAll('{{product_title}}', product.title).replaceAll('{{featuredImageUrl}}', featuredImageUrl).replaceAll("{{url}}", url);
          if (sale_price > 0) {
            productHTML = productHTML.replaceAll('{{price}}', `$${sale_price}`)
            productHTML = productHTML.replaceAll('{{sale_price}}', `$${price}`)
          } else {
            productHTML = productHTML.replaceAll('{{price}}', `$${price}`)
            productHTML = productHTML.replaceAll('{{sale_price}}', '')
          }
          COLLECTION_PRODUCTS_CONTAINER.innerHTML += "\n" + productHTML
        }
      })
      .catch(error => console.error('Error loading JSON:', error));
  }

});

