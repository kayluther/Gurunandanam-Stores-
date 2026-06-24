import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ⚠️ PASTE YOUR FIREBASE CONFIG HERE ⚠️
const firebaseConfig = {
  apiKey: "AIzaSyA4UENoBAfebqT8JKONiYNV0VrUnM7AcZs",
  authDomain: "gurunandanam-stores.firebaseapp.com",
  projectId: "gurunandanam-stores",
  storageBucket: "gurunandanam-stores.firebasestorage.app",
  messagingSenderId: "351764557633",
  appId: "1:351764557633:web:316a01dcdc644d8df6bbc0",
  measurementId: "G-FXBQH2Y30D"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const productList = document.getElementById('product-list');
const searchInput = document.getElementById('searchInput');
let allProducts = [];

async function loadProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        allProducts = [];
        querySnapshot.forEach((doc) => {
            allProducts.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort alphabetically
        allProducts.sort((a, b) => a.name.localeCompare(b.name));
        displayProducts(allProducts);
    } catch (error) {
        console.error("Error loading products: ", error);
        productList.innerHTML = "<p class='loading'>Error connecting to store. Please refresh the page.</p>";
    }
}

function displayProducts(products) {
    productList.innerHTML = '';
    if(products.length === 0) {
        productList.innerHTML = "<p class='loading'>No items found matching your search.</p>";
        return;
    }
    products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product-card';
        // Formatting price with commas for Indian Rupees
        const formattedPrice = product.price.toLocaleString('en-IN');
        div.innerHTML = `
            <h3>${product.name}</h3>
            <div class="price"><span>₹</span>${formattedPrice}</div>
        `;
        productList.appendChild(div);
    });
}

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(term));
    displayProducts(filtered);
});

loadProducts();
