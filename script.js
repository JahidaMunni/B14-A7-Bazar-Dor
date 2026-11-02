const API_URL = "https://openapi.programming-hero.com/api/bazardor/products";
let allProducts = []; // গ্লোবালি প্রোডাক্ট সংরক্ষণ করার জন্য

// Function to show Skeleton Loader
const showSkeletonLoader = () => {
    const productContainer = document.getElementById("all-products-container");
    if (!productContainer) return;
    
    productContainer.innerHTML = ""; 

    for (let i = 0; i < 8; i++) {
        const skeletonCard = document.createElement("div");
        skeletonCard.className = "bg-white rounded-2xl p-5 border border-gray-100 animate-pulse flex flex-col justify-between";
        skeletonCard.innerHTML = `
            <div>
                <div class="w-full h-40 bg-gray-200 rounded-xl mb-4"></div>
                <div class="w-16 h-4 bg-gray-200 rounded-md mb-2"></div>
                <div class="w-3/4 h-6 bg-gray-200 rounded-md mb-2"></div>
                <div class="w-1/2 h-4 bg-gray-200 rounded-md"></div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <div class="w-24 h-5 bg-gray-200 rounded-md"></div>
            </div>
        `;
        productContainer.appendChild(skeletonCard);
    }
};

// Function to fetch all product data
const loadBazarData = async () => {
    showSkeletonLoader();
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        allProducts = Array.isArray(data) ? data : (data.data || data.datasets?.products?.list || []); 
        displayProducts(allProducts);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

// Function to display products in HTML cards
const displayProducts = (products) => {
    const productContainer = document.getElementById("all-products-container");
    if (!productContainer) return;
    
    productContainer.innerHTML = ""; 

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col justify-between cursor-pointer";
        
        const productName = product.nameBn || product.name || product.title || "Product name not available";
        const productImage = product.image || "https://via.placeholder.com/150";
        const productCategory = product.categoryNameBn || product.category || "অন্যান্য";
        const productUnit = product.unit || "kg";
        const productPrice = product.today || product.price || 0;

        card.innerHTML = `
            <div>
                <img src="${productImage}" alt="${productName}" class="w-full h-40 object-cover rounded-xl mb-4">
                <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">${productCategory}</span>
                <h3 class="text-lg font-bold text-gray-800 mt-2">${productName}</h3>
                <p class="text-sm text-gray-500 mt-1">প্রতি ইউনিট: ${productUnit}</p>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span class="text-green-600 font-bold">দাম: ${productPrice} টাকা</span>
            </div>
        `;
        
        productContainer.appendChild(card);
    });
};

// Event Listener for Sort Dropdown
document.addEventListener("DOMContentLoaded", () => {
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            const sortValue = e.target.value;
            let sortedProducts = [...allProducts];

            if (sortValue === "low-to-high") {
                sortedProducts.sort((a, b) => (Number(a.today || a.price || 0) - Number(b.today || b.price || 0)));
            } else if (sortValue === "high-to-low") {
                sortedProducts.sort((a, b) => (Number(b.today || b.price || 0) - Number(a.today || a.price || 0)));
            }

            displayProducts(sortedProducts);
        });
    }
});

// Start fetching
loadBazarData();