// script.js

// Image data
const images = [
    { src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=600&fit=crop', title: 'Mountain Landscape', category: 'nature' },
    { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w-800&h=600&fit=crop', title: 'Northern Lights', category: 'nature' },
    { src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop', title: 'City Skyline', category: 'urban' },
    { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop', title: 'Foggy Mountains', category: 'nature' },
    { src: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&h=600&fit=crop', title: 'Forest Path', category: 'nature' },
    { src: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop', title: 'Lake Reflection', category: 'nature' },
    { src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop', title: 'City Buildings', category: 'architecture' },
    { src: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=800&h=600&fit=crop', title: 'Modern Architecture', category: 'architecture' },
    { src: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&h=600&fit=crop', title: 'Coastal Cliffs', category: 'nature' },
    { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop', title: 'Aerial View', category: 'nature' },
    { src: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=600&fit=crop', title: 'Urban Night', category: 'urban' },
    
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmMERDLlfuivk3g9IdcCgApvNmyyGw6j61G2wrdR9-kQt6iUoafc3FK3E&s', title: 'Colorful Building', category: 'architecture' },
    
    { src: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&h=600&fit=crop', title: 'Abstract Patterns', category: 'abstract' },
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', title: 'Snowy Peaks', category: 'nature' }
];

// DOM Elements
const gallery = document.getElementById('imageGallery');
const filterButtons = document.querySelectorAll('.filter-btn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeLightbox = document.getElementById('closeLightbox');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

// State variables
let currentFilter = 'all';
let currentPage = 1;
const imagesPerPage = 8;
let currentLightboxIndex = 0;
let filteredImages = [];

// Initialize gallery
function initGallery() {
    renderGallery();
    setupEventListeners();
}

// Render gallery based on filter and page
function renderGallery() {
    gallery.innerHTML = '';
    
    // Filter images
    filteredImages = currentFilter === 'all' 
        ? images 
        : images.filter(img => img.category === currentFilter);
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredImages.length / imagesPerPage);
    const startIndex = (currentPage - 1) * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;
    const paginatedImages = filteredImages.slice(startIndex, endIndex);
    
    // Create gallery items
    paginatedImages.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = `gallery-item ${image.category}`;
        galleryItem.dataset.index = startIndex + index;
        
        galleryItem.innerHTML = `
            <img src="${image.src}" alt="${image.title}" loading="lazy">
            <div class="image-overlay">
                <div class="image-title">${image.title}</div>
                <div class="image-category">${image.category.charAt(0).toUpperCase() + image.category.slice(1)}</div>
            </div>
        `;
        
        gallery.appendChild(galleryItem);
    });
    
    // Update navigation buttons
    updateNavigationButtons(totalPages);
}

// Update navigation buttons state
function updateNavigationButtons(totalPages) {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || filteredImages.length === 0;
    
    // Visual feedback for disabled state
    prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
    nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
    
    // Update cursor
    prevBtn.style.cursor = prevBtn.disabled ? 'not-allowed' : 'pointer';
    nextBtn.style.cursor = nextBtn.disabled ? 'not-allowed' : 'pointer';
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            setFilter(filter);
        });
    });
    
    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderGallery();
            scrollToGalleryTop();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredImages.length / imagesPerPage);
        
        if (currentPage < totalPages) {
            currentPage++;
            renderGallery();
            scrollToGalleryTop();
        }
    });
    
    // Gallery item click for lightbox
    gallery.addEventListener('click', (e) => {
        const galleryItem = e.target.closest('.gallery-item');
        if (galleryItem) {
            openLightbox(parseInt(galleryItem.dataset.index));
        }
    });
    
    // Lightbox controls
    closeLightbox.addEventListener('click', closeLightboxView);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightboxView();
        }
    });
    
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Handle keyboard navigation
function handleKeyboardNavigation(e) {
    if (lightbox.style.display === 'flex') {
        switch(e.key) {
            case 'Escape':
                closeLightboxView();
                break;
            case 'ArrowLeft':
                navigateLightbox(-1);
                break;
            case 'ArrowRight':
                navigateLightbox(1);
                break;
        }
    }
}

// Scroll to gallery top when changing pages
function scrollToGalleryTop() {
    gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Set active filter
function setFilter(filter) {
    currentFilter = filter;
    currentPage = 1;
    
    // Update active button
    filterButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.filter === filter);
    });
    
    renderGallery();
}

// Open lightbox
function openLightbox(index) {
    filteredImages = currentFilter === 'all' 
        ? images 
        : images.filter(img => img.category === currentFilter);
    
    currentLightboxIndex = index;
    updateLightbox();
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close lightbox
function closeLightboxView() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Navigate lightbox
function navigateLightbox(direction) {
    filteredImages = currentFilter === 'all' 
        ? images 
        : images.filter(img => img.category === currentFilter);
    
    currentLightboxIndex += direction;
    
    // Circular navigation
    if (currentLightboxIndex < 0) {
        currentLightboxIndex = filteredImages.length - 1;
    } else if (currentLightboxIndex >= filteredImages.length) {
        currentLightboxIndex = 0;
    }
    
    updateLightbox();
}

// Update lightbox content
function updateLightbox() {
    const image = filteredImages[currentLightboxIndex];
    lightboxImage.src = image.src;
    lightboxImage.alt = image.title;
    lightboxCaption.textContent = `${image.title} (${currentLightboxIndex + 1}/${filteredImages.length})`;
}

// Initialize the gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', initGallery);