// script.js

document.addEventListener('DOMContentLoaded', () => {

  // --- Helper: Function to parse product data from DOM ---
  function getProductDataFromDOM(containerSelector) {
      const productItems = document.querySelectorAll(`${containerSelector} .product-item`);
      const products = [];
      productItems.forEach(item => {
          // Use || '' to avoid null errors if attribute is missing
          const name = item.dataset.name || '';
          const priceStr = item.dataset.price || '0';
          const img = item.dataset.img || '';
          const date = item.dataset.date || '1970-01-01'; // Default old date

          // Convert price to number, handle potential errors
          const price = parseFloat(priceStr);
          if (isNaN(price)) {
              console.warn(`Could not parse price for product: ${name}`);
          }

          if (name && img) { // Only add if essential data exists
               products.push({
                  name: name,
                  price: isNaN(price) ? 0 : price, // Use 0 if price is invalid
                  img: img,
                  date: date,
                  // Store the original HTML element temporarily if needed for complex rendering
                  // element: item.cloneNode(true) // Or just store innerHTML
                  html: item.innerHTML // Store innerHTML to rebuild later
              });
          } else {
              console.warn('Skipping product item due to missing name or image data attribute.');
          }
      });
      return products;
  }

  // --- Helper: Function to render products to the grid ---
  function renderProducts(products, containerSelector) {
      const container = document.querySelector(containerSelector);
      if (!container) {
          console.error(`Product container "${containerSelector}" not found.`);
          return;
      }
      // Clear current grid
      container.innerHTML = '';

      // Add products back
      if (products.length === 0) {
          container.innerHTML = '<p>No products found matching your criteria.</p>'; // Optional message
      } else {
          products.forEach(product => {
              // Recreate the product item div
              const itemDiv = document.createElement('div');
              itemDiv.className = 'product-item';
              // Re-add data attributes needed for quick view etc.
              itemDiv.dataset.name = product.name;
              itemDiv.dataset.price = product.price; // Store original numerical price
              itemDiv.dataset.img = product.img;
              itemDiv.dataset.date = product.date;
              // Set the inner HTML saved earlier
              itemDiv.innerHTML = product.html;
              // Append to container
              container.appendChild(itemDiv);
          });
      }
  }

  // --- Initial Setup ---
  const productGridSelector = '.shop-content .product-grid';
  let allProducts = []; // Store all products parsed initially
  const productGridContainer = document.querySelector(productGridSelector);

  if (productGridContainer) {
      allProducts = getProductDataFromDOM(productGridSelector);
      // console.log('Initial products parsed:', allProducts);
  } else {
       // Only warn if we expect the grid container
      if (document.querySelector('.shop-content')) {
           console.warn("Product grid container not found on initial load.");
      }
  }
  let currentlyDisplayedProducts = [...allProducts]; // Start with all products displayed


  // --- Price Filter Logic ---
  const minPriceInput = document.querySelector('.price-min');
  const maxPriceInput = document.querySelector('.price-max');
  const priceFilterBtn = document.querySelector('.price-filter-btn');

  if (minPriceInput && maxPriceInput && priceFilterBtn && productGridContainer) {
      priceFilterBtn.addEventListener('click', () => {
          const minPrice = parseFloat(minPriceInput.value) || 0; // Default to 0 if empty/invalid
          const maxPrice = parseFloat(maxPriceInput.value) || Infinity; // Default to Infinity if empty/invalid

          // Filter from the *original* full list
          const filteredProducts = allProducts.filter(product => {
              return product.price >= minPrice && product.price <= maxPrice;
          });

          currentlyDisplayedProducts = [...filteredProducts]; // Update displayed list
          applySorting(); // Re-apply current sort to the filtered list
      });
  } else {
      if (document.querySelector('.filters')) { // Only warn if filters section exists
           console.warn("Price filter elements (inputs or button) not found.");
      }
  }

  // --- Sorting Logic ---
  const sortSelect = document.getElementById('sort-select');

  function applySorting() {
      if (!sortSelect || !productGridContainer) return; // Exit if elements missing

      const sortBy = sortSelect.value;

      const sortedProducts = [...currentlyDisplayedProducts]; // Sort the currently displayed products

      switch (sortBy) {
          case 'price-asc':
              sortedProducts.sort((a, b) => a.price - b.price);
              break;
          case 'price-desc':
              sortedProducts.sort((a, b) => b.price - a.price);
              break;
          case 'newest':
              // Sort by date descending (newest first)
              sortedProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
              break;
          case 'default':
          default:
               // Revert to original order based on `allProducts` if needed,
               // or maintain current filtered order if no specific default needed.
               // This implementation keeps the current order for default.
              break;
      }
      renderProducts(sortedProducts, productGridSelector);
  }

  if (sortSelect && productGridContainer) {
      sortSelect.addEventListener('change', applySorting); // Call sorting function on change
  } else {
       if (document.querySelector('.filters')) { // Only warn if filters section exists
           console.warn("Sort select dropdown element not found.");
      }
  }


  // --- Mobile Navigation Menu Toggle ---
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('header nav');
  if (hamburger && nav) {
      hamburger.addEventListener('click', () => {
          const currentDisplay = window.getComputedStyle(nav).display;
          nav.style.display = currentDisplay === 'flex' ? 'none' : 'flex';
      });
  } // Removed console warning for brevity

  // --- Product Page Image Gallery ---
  const mainImageContainer = document.querySelector('.main-image');
  const thumbnails = document.querySelectorAll('.thumbnail');
  if (mainImageContainer && thumbnails.length > 0) {
      thumbnails.forEach(thumbnail => {
          thumbnail.addEventListener('click', () => {
              if (thumbnail.style.backgroundImage) {
                  mainImageContainer.style.backgroundImage = thumbnail.style.backgroundImage;
              }
          });
      });
  } // No warning needed

  // --- Product Page Tabs ---
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  if (tabButtons.length > 0 && tabContents.length > 0) {
      tabButtons.forEach(button => {
          button.addEventListener('click', () => {
              const tabId = button.dataset.tab;
              const targetContent = document.getElementById(tabId);
              if (targetContent) {
                  tabButtons.forEach(btn => btn.classList.remove('active'));
                  tabContents.forEach(content => content.style.display = 'none');
                  button.classList.add('active');
                  targetContent.style.display = 'block';
              }
          });
      });
      // Activate first tab initially
       const firstActiveButton = document.querySelector('.tab-button.active');
       if (firstActiveButton) { /* ... */ } // Logic as before
       else if (tabButtons.length > 0) { /* ... */ } // Logic as before
  } // No warning needed

  // --- Back to Top Button ---
  const backToTopButton = document.getElementById('backToTop');
  if (backToTopButton) { /* Listener logic as before */
      window.addEventListener('scroll', () => { backToTopButton.style.display = window.scrollY > 300 ? 'block' : 'none'; });
      backToTopButton.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  } // No warning needed

  // --- Dark Mode Toggle ---
  const darkModeToggle = document.querySelector('.toggle-theme');
  if (darkModeToggle) { /* Listener logic as before, including localStorage */
      if (localStorage.getItem('theme') === 'dark') { document.body.classList.add('dark-mode'); }
      darkModeToggle.addEventListener('click', () => {
          document.body.classList.toggle('dark-mode');
          localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
      });
  } // No warning needed


  // --- Quick View Modal ---
  const quickViewModal = document.getElementById('quickViewModal');
  const closeButton = quickViewModal ? quickViewModal.querySelector('.close-button') : null;
  // IMPORTANT: Change listener to attach to document body or a static parent
  // because productGridContainer's content gets replaced.
  const quickViewEventContainer = document.body; // Listen on body

  window.openQuickView = function(name, price, imgSrc) { /* ... function definition as before ... */
      const quickViewNameEl = document.getElementById('quickViewName');
      const quickViewPriceEl = document.getElementById('quickViewPrice');
      const quickViewImgEl = document.getElementById('quickViewImg');

      if (quickViewModal && quickViewNameEl && quickViewPriceEl && quickViewImgEl) {
          quickViewNameEl.innerText = name;
          quickViewPriceEl.innerText = price + '₾'; // Add currency symbol back for display
          quickViewImgEl.src = imgSrc;
          quickViewImgEl.alt = name;
          quickViewModal.style.display = 'block';
      }
  };
  window.closeQuickView = function() { /* ... function definition as before ... */
      if (quickViewModal) { quickViewModal.style.display = 'none'; }
  };

  if (closeButton) { closeButton.addEventListener('click', closeQuickView); }
  if (quickViewModal) { quickViewModal.addEventListener('click', (event) => { if (event.target === quickViewModal) { closeQuickView(); } }); }

  // Event listener for Quick View clicks (delegated from body)
   quickViewEventContainer.addEventListener('click', (event) => {
      const productItem = event.target.closest('.product-item'); // Check if click was inside a product item
      if (productItem && productGridContainer && productGridContainer.contains(productItem)) { // Ensure it's within the dynamic grid
           // Trigger Quick View if the click was on the quick-view element *or* anywhere if no specific trigger
           // if (event.target.closest('.quick-view')) { // Uncomment to only trigger on .quick-view click
              const name = productItem.dataset.name;
              // Read numerical price from data-price, format for display
              const price = productItem.dataset.price;
              const img = productItem.dataset.img;

              if (name && price !== undefined && img) {
                openQuickView(name, price, img);
              }
          // }
      }
  });


}); // End DOMContentLoaded


// --- Dynamically Created Elements ---
// Ensure these run *after* DOMContentLoaded if their listeners are inside it,
// or ensure listeners are attached correctly if run immediately.

// --- Create and Append Back to Top Button ---
const backToTop = document.createElement('button');
backToTop.id = 'backToTop';
backToTop.innerHTML = '↑';
document.body.appendChild(backToTop);

// --- Create and Append Dark Mode Toggle ---
const darkModeToggleBtn = document.createElement('button');
darkModeToggleBtn.className = 'toggle-theme';
darkModeToggleBtn.innerHTML = '🌓';
document.body.appendChild(darkModeToggleBtn);

// --- Create and Append Sticky Announcement Banner ---
const announcementBanner = document.createElement('div');
announcementBanner.className = 'announcement';
announcementBanner.textContent = '✨ უფასო მიტანა 100₾-ის დახარჯვის შემთხვევაში ✨';
document.body.prepend(announcementBanner);