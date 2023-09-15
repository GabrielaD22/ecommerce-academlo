
function HeaderClassOnScroll() {
    const header = document.querySelector('#header');
    
    const toggleHeaderClass = () => {
        if (window.scrollY > 100) {
            header.classList.add("header__show");
        } else {
            header.classList.remove("header__show");
        }
    };
    window.addEventListener("scroll", toggleHeaderClass);
}

function handleNavMenu() {
    const navMenu = document.querySelector(".navpag__menu");
    const mobileNavMenu = document.querySelector(".handleIconNavbar");
    const liProducts = document.querySelector(".li_product");
    const liHome = document.querySelector(".li_home");

    mobileNavMenu.addEventListener("click", function () {
        navMenu.classList.toggle("navpag_menu-show");
        mobileNavMenu.classList.toggle("bxs-dashboard");
        mobileNavMenu.classList.toggle("bx-x");
    });

    if (mobileNavMenu.classList.contains("bx-x")) {
        liProducts.addEventListener("click", function () {
            navMenu.classList.remove("navpag_menu-show");
            mobileNavMenu.classList.remove("bx-x");
            mobileNavMenu.classList.add("bx-dashboard");
        });

        liHome.addEventListener("click", function () {
            navMenu.classList.remove("navpag_menu-show");
            mobileNavMenu.classList.remove("bx-x");
            mobileNavMenu.classList.add("bx-dashboard");
        })
    }
}


const addDarkMode = () => {
    const body = document.body;
    const iconDarkMode = document.querySelector("#darkMode");

    function setDarkMode() {
        body.classList.toggle("dark-theme");
        iconDarkMode.classList.toggle("bx-sun");
        localStorage.setItem("saveTheme", body.classList.contains("dark-theme"));
    }

    function toggleTheme() {
        setDarkMode();
    }

    iconDarkMode.addEventListener("click", toggleTheme);

    if (localStorage.getItem("saveTheme") === "true") {
        setDarkMode();
    }
}

async function getProducts() {
    try {
        const data = await fetch(
            "https://ecommercebackend.fundamentos-29.repl.co/"
            );

const res = await data.json();

        window.localStorage.setItem("products", JSON.stringify(res));

        return res;
    } catch (error) {
        console.log(error);
    }
}

function printProducts(db) {

    const productsHTML =document.querySelector(".products");
    
    let html = ''
    for (const product of db.products) {
        const buttonAdd = product.quantity 
                    ? `<i class='bx bx-plus' id='${product.id}'></i>` 
                    : `<span class="soldOut">Sold Out</span>`

        html += `
        <div id="products" class="product">
        <div class="product__img">
                <img src="${product.image}" alt="imagen" />
                </div>

                <div class="product__info">
                    <h3>${buttonAdd}</h3>
                    <h4>$${product.price}.00  <span><b> | Stock:</b> ${product.quantity}</span></h4>
                    <h5>
                    ${product.name}
                    </h5>
                </div>
         </div>
    `
    }

    console.log(html);

    productsHTML.innerHTML = html;  
}

function handleShowCart() {
const iconCartHTML = document.querySelector(".bx-shopping-bag");
const cartHTML = document.querySelector(".cart");

iconCartHTML.addEventListener('click', function () {
cartHTML.classList.toggle("cart__show")
});

cartHTML.addEventListener("click", function(e){
if(e.target.classList.contains("bx-x")) {
    this.classList.remove("cart__show")
}
})
}

function addToCartFromProducts (db) {
    const productsHTML = document.querySelector(".products");

    productsHTML.addEventListener('click', function (e) {
        if (e.target.classList.contains("bx-plus")) {
            const id = Number(e.target.id);

            const productFind = db.products.find(
                (product) => product.id === id
                );

            if (db.cart[productFind.id]) {
                if (productFind.quantity === db.cart[productFind.id].amount++) 
                return alert('No hay más unidades disponibles en stock');
                    
                    db.cart[productFind.id].amount++
                } else {
                    db.cart[productFind.id] = {...productFind, amount: 1};
                }

                window.localStorage.setItem("cart", JSON.stringify(db.cart));
                printProductsInCart(db);
                printTotal(db);
                handlerPrintAmountProducts(db);
        };
    })
}

function printProductsInCart(db) {
    const cartproducts = document.querySelector(".cart__products");

    let html = '';

    for (const product in db.cart) {
        const {quantity, price, name, image,  id, amount} = db.cart[product];

        html += `
            <div class="cart__product">
                <div class="cart__product--img">
                    <img src="${image}" alt="imagen" />
                </div>
                <div class="cart__product--body">
                    <h4>${name} | $${price}.00</h4>
                    <p>Stock: ${quantity} </p>

                    <div class="cart__product--body-op" id='${id}'>
                        <i class='bx bx-minus'></i>
                    <span>${amount} units</span>
                        <i class='bx bx-plus'></i>
                        <i class='bx bxs-trash'></i>
                    </div>
                </div>
            </div>
        `; 
        }
    
    cartproducts.innerHTML = html;
    
}

function handlerProductsInCart(db) {
    const cartProducts = document.querySelector(".cart__products");

    cartProducts.addEventListener("click", function(e){
        if(e.target.classList.contains("bx-plus")) {
            const id = (Number(e.target.parentElement.id));

            const productFind = db.products.find(
                (product) => product.id === id
                );
            
                if (productFind.quantity === db.cart[productFind.id].amount) 
                return alert('No hay más unidades disponibles en stock');
            db.cart[id].amount++;
        }
        if(e.target.classList.contains("bx-minus")) {
            const id = (Number(e.target.parentElement.id));
            if (db.cart[id].amount ===1) {
                const response = confirm(
                    "Estás seguro de que quieres eliminar este producto?"
                );
                if (!Response) return;
                delete db.cart[id];
            } else {
                db.cart[id].amount--;
            }
        }
        if(e.target.classList.contains("bxs-trash")) {
            const id = (Number(e.target.parentElement.id));
            const response = confirm(
                "Estás seguro de que quieres eliminar este producto?"
            );
            if (!Response) return;
            delete db.cart[id];
        }

        window.localStorage.setItem("cart", JSON.stringify(db.cart))
        printProductsInCart(db);
        printTotal(db);
    });
}

function printTotal(db) {
    const infoTotal = document.querySelector(".info__total"); 
    const infoAmount = document.querySelector(".info__amount");

    let totalProducts = 0;
    let amountProducts = 0;
    
    for (const product in db.cart) {
        const {amount, price} = db.cart[product];
        totalProducts += price * amount;
        amountProducts += amount;
    }

    infoAmount.textContent = amountProducts + " units";
    infoTotal.textContent = "$" + totalProducts + ".00";
}

function handlerTotal(db) {
    const btnBuy = document.querySelector(".btn__buy");

    btnBuy.addEventListener('click', function() {
        if (!Object.values(db.cart).length) 
        return alert("¡El carrito está vacio!");
        
        const response = confirm("Seguro que quieres comprar?");
        if (!response) return;

        const currentProducts = [];

        for (const product of db.products) {
            const productCart = db.cart[product.id]
            if (product.id === productCart?.id) {
                currentProducts.push({
                    ...product,
                    quantity: product.quantity - productCart.amount,
                });
            } else {
                currentProducts.push(product);
            }
        }
        db.products = currentProducts;
        db.cart = {};

        window.localStorage.setItem("products", JSON.stringify(db.products));
        window.localStorage.setItem("cart", JSON.stringify(db.cart));

        printTotal(db);
        printProductsInCart(db);
        printProducts(db);
        handlerPrintAmountProducts(db);
    });
    
}

function handlerPrintAmountProducts(db) {
    const amountProducts = document.querySelector(".amountProducts");

    let amount = 0;

    for (const product in db.cart) {
        amount += db.cart[product].amount;
    }

    amountProducts.textContent = amount;
    
}

function loading() {
    const loading = document.querySelector(".loader");

    function hideLoading() {
        loading.style.display = "none";
    }

    setTimeout(hideLoading, 2000);
}

async function main() {
    const db = {
        products: JSON.parse(window.localStorage.getItem("products")) || 
        (await getProducts()),
        cart: JSON.parse(window.localStorage.getItem('cart')) || {},
    }

    HeaderClassOnScroll();
    addDarkMode();
    handleNavMenu();
    printProducts(db);
    handleShowCart();
    addToCartFromProducts(db);
    printProductsInCart(db);
    handlerProductsInCart (db);
    printTotal(db);
    handlerTotal(db);
    handlerPrintAmountProducts(db);
    loading();

    }

main()