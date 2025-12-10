//smooth scrolling through the a tag
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

//To give active button a color 
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('secondPartRight');
    if (!container) return;

    const links = container.querySelectorAll('a');

    const currentUrl = window.location.href;

    links.forEach(link => {
        if (currentUrl.includes(link.href)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

//To control carousel
const track = document.querySelector(".carousel-track");
const arrows = document.querySelectorAll(".arrow-btn");
const images = document.querySelectorAll(".carousel-track img");

if (images.length === 0) {
    console.error("No images found in the carousel track.");
}

const imgWidth = images.length > 0 ? images[0].offsetWidth + 16 : 0;
const totalImages = images.length;
const imagesToShow = 2;
const lastValidIndex = totalImages - imagesToShow;

let currentIndex = 0;
const pace = 3000;

const updatePosition = () => {
    track.style.transform = `translateX(-${currentIndex * imgWidth}px)`;
};

const autoSlide = () => {
    if (totalImages <= imagesToShow) return;

    currentIndex += 2;

    if (currentIndex > lastValidIndex) {
        currentIndex = 0;
    }

    updatePosition();
};

let carouselInterval = setInterval(autoSlide, pace);

arrows.forEach(btn => {
    btn.addEventListener("click", () => {
        clearInterval(carouselInterval);

        const direction = btn.dataset.direction;

        if (direction === "right") {
            currentIndex += 1;
            if (currentIndex > lastValidIndex) {
                currentIndex = 0;
            }
        } else {
            currentIndex -= 1;
            if (currentIndex < 0) {
                currentIndex = lastValidIndex;
            }
        }

        updatePosition();

        carouselInterval = setInterval(autoSlide, pace);
    });
});


//To take note of the number of crops in real time
const accurateCropCounts = {
    'marketplace.html': 10,
    'cereals.html': 5,
    'legumes.html': 3,
    'tubers.html': 2,
};

function getProductPrice(productCard) {
    const priceText = productCard.querySelector('.price').textContent;
    const match = priceText.match(/₦([\d,]+)/);
    if (match) {
        return parseInt(match[1].replace(/,/g, ''), 10);
    }
    return 0;
}

//To take note of amount of products
function formatNaira(amount) {
    return '₦' + amount.toLocaleString('en-NG');
}

function updateGlobalSummary() {
    const productCards = document.querySelectorAll('.product-card');
    let totalItems = 0;
    let totalPrice = 0;

    productCards.forEach(card => {
        const checkbox = card.querySelector('input[type="checkbox"]');
        const quantityInput = card.querySelector('input[type="number"]');

        if (checkbox && checkbox.checked && card.style.display !== 'none') {
            const quantity = parseInt(quantityInput.value) || 0;
            const price = getProductPrice(card);

            totalItems += quantity;
            totalPrice += price * quantity;
        }
    });

    const oneElement = document.getElementById('one');
    if (oneElement) {
        oneElement.textContent = totalItems === 0 ? 
            'No item selected' : 
            `${totalItems} item${totalItems !== 1 ? 's' : ''} selected`;
    }

    const twoElement = document.getElementById('two');
    if (twoElement) {
        twoElement.textContent = `Total: ${formatNaira(totalPrice)}`;
    }
}

function updateFilteredCropCount(currentVisibleCount) {
    const showCropsElement = document.getElementById('showCrops');
    const totalCrops = document.querySelectorAll('.product-card').length;

    if (showCropsElement) {
        showCropsElement.innerHTML = `Showing <strong>${currentVisibleCount}</strong> of <strong>${totalCrops}</strong> crops`;
    }
}

//To search for crops on the webpage
function updateNotAvailableMessage(isVisible) {
    let messageElement = document.getElementById('notAvailableMessage');
    if (!messageElement) {
        const mainContent = document.querySelector('.selection-controls') || document.body;
        messageElement = document.createElement('p');
        messageElement.id = 'notAvailableMessage';
        messageElement.textContent = 'Crop not available on this page. Redirecting...';
        messageElement.style.color = 'red';
        messageElement.style.fontWeight = 'bold';
        messageElement.style.display = 'none';
        mainContent.insertAdjacentElement('afterend', messageElement);
    }
    messageElement.style.display = isVisible ? 'block' : 'none';
}

const cropLocationMap = {
    "rice": "cereals.html",
    "wheat": "cereals.html",
    "maize": "cereals.html",
    "millet": "cereals.html",
    "sorghum": "cereals.html",
    "groundnut": "legumes.html",
    "soybean": "legumes.html",
    "beans": "legumes.html",
    "yam": "tubers.html",
    "cassava": "tubers.html",    
};


function filterProducts() {
    const searchInput = document.querySelector('.search-box input[type="text"]');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase().trim();
    
    const productCards = document.querySelectorAll('.product-card');
    let visibleCrops = 0;

    if (searchTerm === '') {
        productCards.forEach(card => card.style.display = '');
        updateFilteredCropCount(productCards.length);
        updateNotAvailableMessage(false);
        return;
    }

    productCards.forEach(card => {
        const title = card.querySelector('.product-title h3')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.description')?.textContent.toLowerCase() || '';

        const isMatch = title.includes(searchTerm) || description.includes(searchTerm);

        if (isMatch) {
            card.style.display = '';
            visibleCrops++;
        } else {
            card.style.display = 'none';
        }
    });

    updateFilteredCropCount(visibleCrops);
    updateGlobalSummary();
    updateNotAvailableMessage(false);

    if (visibleCrops === 0) {
        const foundPage = cropLocationMap[searchTerm];

        if (foundPage && foundPage !== window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1)) {
            updateNotAvailableMessage(true);

            setTimeout(() => {
                window.location.href = `${foundPage}?search=${encodeURIComponent(searchInput.value.trim())}`;
            }, 500);

        } else if (!foundPage) {
            updateNotAvailableMessage(true);
            document.getElementById('notAvailableMessage').textContent = 'Crop not available anywhere.';
        }
    }
}


//To update the crop count on the webpage
function updateCropCount() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1) || 'marketplace.html';

    const totalCrops = accurateCropCounts[filename] || 0; 
    const showCropsElement = document.getElementById('showCrops');

    if (showCropsElement) {
        showCropsElement.innerHTML = `Showing <strong>${totalCrops}</strong> of <strong>${totalCrops}</strong> crops`;
    }
}

function setupProductCardListeners(card) {
    const checkbox = card.querySelector('input[type="checkbox"]');
    const quantityInput = card.querySelector('.quantity-area input[type="number"]'); 
    
    const qtyUpButton = card.querySelector('.qty-buttons-vertical #qtyUp');
    const qtyDownButton = card.querySelector('.qty-buttons-vertical #qtyDown');

    if (!checkbox || !quantityInput || !qtyUpButton || !qtyDownButton) {
        console.warn("Missing elements in product card:", card);
        return;
    }

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            quantityInput.disabled = false;
            quantityInput.value = 1; 
        } else {
            quantityInput.disabled = true;
            quantityInput.value = '';
        }
        updateGlobalSummary();
    });

    qtyUpButton.addEventListener('click', () => {
        if (checkbox.checked) {
            let currentQty = parseInt(quantityInput.value) || 0;
            quantityInput.value = currentQty + 1;
            updateGlobalSummary();
        }
    });

    qtyDownButton.addEventListener('click', () => {
        if (checkbox.checked) {
            let currentQty = parseInt(quantityInput.value) || 0;
            if (currentQty > 1) { 
                quantityInput.value = currentQty - 1;
                updateGlobalSummary();
            } else if (currentQty === 1) {
                checkbox.checked = false;
                quantityInput.disabled = true;
                quantityInput.value = '';
                updateGlobalSummary();
            }
        }
    });
    
    quantityInput.addEventListener('input', () => {
        let currentQty = parseInt(quantityInput.value);
        if (currentQty < 1 || isNaN(currentQty)) {
            quantityInput.value = 1;
        }
        if (checkbox.checked) {
            updateGlobalSummary();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCropCount();

    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(setupProductCardListeners);

    const searchInput = document.querySelector('.search-box input[type="text"]');
    const searchButton = document.querySelector('.search-btn');

    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
        searchButton?.addEventListener('click', filterProducts);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const initialSearchTerm = urlParams.get('search');

    if (initialSearchTerm && searchInput) {
        searchInput.value = initialSearchTerm;
        filterProducts(); 

        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }

    updateGlobalSummary();
});