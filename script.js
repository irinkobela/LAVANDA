// script.js

// Mobile Navigation Menu Toggle
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('header nav');

hamburger.addEventListener('click', () => {
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
});

// Product Page Image Gallery
const mainImage = document.querySelector('.main-image');
const thumbnails = document.querySelectorAll('.thumbnail');

if (mainImage && thumbnails.length > 0) {
  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
      mainImage.style.backgroundImage = thumbnail.style.backgroundImage;
    });
  });
}

// Product Page Tabs
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tabId = button.dataset.tab;

    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.style.display = 'none');

    button.classList.add('active');
    document.getElementById(tabId).style.display = 'block';
  });
});

// Hover Effect on Product Items
const productItems = document.querySelectorAll('.product-item');

productItems.forEach(item => {
  item.addEventListener('mouseover', () => {
    item.style.transform = 'scale(1.05)';
    item.style.transition = 'transform 0.3s ease';
  });

  item.addEventListener('mouseout', () => {
    item.style.transform = 'scale(1)';
  });
});

// Back to Top Button
const backToTop = document.createElement('button');
backToTop.id = 'backToTop';
backToTop.innerText = '↑';
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
  backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Dark Mode Toggle
const darkModeToggle = document.createElement('button');
darkModeToggle.className = 'toggle-theme';
darkModeToggle.innerText = '🌓';
document.body.appendChild(darkModeToggle);

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Sticky Announcement Banner (optional dismiss later)
const announcement = document.createElement('div');
announcement.className = 'announcement';
announcement.innerText = '✨ უფასო მიტანა 100₾-ის დახარჯვის შემთხვევაში ✨';
document.body.appendChild(announcement);

function openQuickView(name, price, imgSrc) {
    document.getElementById('quickViewName').innerText = name;
    document.getElementById('quickViewPrice').innerText = price;
    document.getElementById('quickViewImg').src = imgSrc;
    document.getElementById('quickViewModal').style.display = 'block';
  }
  
  function closeQuickView() {
    document.getElementById('quickViewModal').style.display = 'none';
  }
  