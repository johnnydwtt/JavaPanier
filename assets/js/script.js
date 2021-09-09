var catalog;
var cart = [];

// Chargement du Json et affichage de la catégorie par défaut
let loadProducts = () => {
    fetch('assets/JSON/products.json')
        .then(response => response.json())
        .then(datas => {
            catalog = datas.categories;

            cat1 = getProducts('Categorie1');
            displayProducts(cat1, 'products');
            titleH1.innerHTML = 'Catégorie 1';

            displayCart();
        });
}

// retourne un tableau de tous les produits du catalog (dont la categorie est passés en paramètre).
let getProducts = (category) => {
    catalog.forEach((item) => {
        if(item.name == category){
            products = item.products;
        }
        
    });
    return products;
}

// retourne un objet produit (dont la ref est passée en paramètre)
let getProduct = (ref) => {
    catalog.forEach(category => {
        category.products.forEach((item)=>{
            if(ref == item.ref){
                product = item;
            } 
        })
    });
    return product;
}

// retourne la position (l'index) d'un produit du panier (dont la ref est passée en paramètre)
let getIndexInCart = (ref) => {
    let position = false;
    cart.forEach((item, index)=>{
        if(ref == item.ref){
            position = index;
        }
    })
    return position;
}

// supprime un produit du panier (dont la ref est passée en paramètre)
let removeProductFromCart = (ref) => {
    let index = getIndexInCart(ref);
    if(index!==false){
        cart.splice(index,1);
    }
}

// diminie la quantité d'un produit du panier (dont la ref est passée en paramètre). Si la quantité est égale à 1 on appelle la fonction removeProductFromCart
let decreaseQuantity = (ref) => {
    let index = getIndexInCart(ref);
    if(index!==false){
        if(cart[index].qty > 1){
            cart[index].qty--;
        } else {
            removeProductFromCart(ref)
        }
        
    }
    // on fait appel à la fonction displayCart pour mettre à jour les quantités dans le panier
    displayCart();
}

// Augmente  la quantité d'un produit du panier (dont la ref est passée en paramètre).
let increaseQuantity = (ref) => {
    let index = getIndexInCart(ref);
    if(index!==false){
        cart[index].qty++;
    }
    // on fait appel à la fonction displayCart pour mettre à jour les quantités dans le panier
    displayCart();
}

// Ajoute un produit dans le panier
let addProductToCart = (ref) => {
    // On récupère la position du produit si il est déjà présent dans le panier afin d'augmenter sa quantité, sinon, on l'ajoute directement
    let index = getIndexInCart(ref);
    if(index!==false){
        increaseQuantity(ref);
    } else {
        newProduct = {
                        "ref" : ref,
                        "qty" : 1
                    }
        cart.push(newProduct);
    }
    displayCart();
}

// Retourne le montant total du panier
let cartAmout = () => {
    let total = 0;
    cart.forEach((element) => {
        product = getProduct(element.ref);
        total += product.price*element.qty;
    })

    return total.toFixed(2)+'€';
}

// Fonction qui crée 1 évènement par produit affiché à l'écran
let addEvents = () => {
    btnsAddProductsToCart = document.querySelectorAll('.addProduct');

    btnsAddProductsToCart.forEach( (btn) => {
        btn.addEventListener('click', (event) => {
            ref = event.target.dataset.ref;
            addProductToCart(ref);
        });
    })
}

// retourne la card d'un produit en html
let displayProduct = (ref) => {
    let product = getProduct(ref);

    let htmlContent = `
        <div class="card mb-4">
            <img src="${product.filename}" class="card-img-top" alt="${product.title}">
            <div class="card-body">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text text-truncate">${product.description}</p>
                <div class="d-flex align-items-center">
                    <button type="button" class="addProduct btn btn-manusien m-auto" data-ref="${product.ref}">Ajouter au panier</button>
                </div>
            </div>
        </div>
    `;
    return htmlContent;
}

// Affiche dans l'element 'HTMLElement' tous les produits de 'category' (c'est un tableau)
let displayProducts = (category, HTMLElement) => {
    let htmlContent = '';
    category.forEach( (product) => {

        ref = product.ref;
        htmlContent += `
            <div class="col-12 col-sm-6 col-lg-3">
                ${displayProduct(ref)}
            </div>
        `;
    })
    document.getElementById(HTMLElement).innerHTML = htmlContent;
    // Lorsque l'affichage est effectué, on génère les event sur les boutons d'ajout au panier
    addEvents();
}

// Retourne le montant d'un produit dans le panier selon sa quantité
let getAmountProduct = (ref) => {
    // On fait appel à la fonction 'getIndexInCart' qui retourne sa position dans le panier pour connaitre la quantité
    index = getIndexInCart(ref);
    qty = cart[index].qty;
    // On fait appel à la fonction 'getProduct' pour obtenir toutes les infos du produits, nottament sont prix
    product = getProduct(ref);
    price = product.price;
    total = price*qty;
    return total.toFixed(2)+'€';
}

// Affiche tous les produits dans le panier et génère les events des 2 boutons de modification de quantité pour chaque produit
let displayCart = () => {

    // rendu de la modal
    let productsToDisplayInCart = '';
    cart.forEach( (element) => {
        product = getProduct(element.ref);
        productsToDisplayInCart += `
        <tr>
            <th scope="row">${element.ref}</th>
            <td>${product.title}</td>
            <td><span class="minus px-2 fas fa-minus-square" data-ref="${element.ref}"></span>${element.qty}<span class="add px-2 fas fa-plus-square" data-ref="${element.ref}"></span></td>
            <td>${getAmountProduct(element.ref)}</td>
        </tr>
        `;

    })
    modalBody = document.querySelector('#cart .modal-body #line');
    modalBody.innerHTML = productsToDisplayInCart;

    // Met à jour le montant total dans la panier
    totalCart.innerHTML = cartAmout();

    // Création des events sur le bouton 'moins'
    btnsMinusQty = document.querySelectorAll('.minus');
    btnsMinusQty.forEach( (btn) => {
        btn.addEventListener('click', (event) => {
            ref = event.target.dataset.ref;
            decreaseQuantity(ref);
        });
    })

    // Création des events sur le bouton 'plus'
    btnsAddQty = document.querySelectorAll('.add');
    btnsAddQty.forEach( (btn) => {
        btn.addEventListener('click', (event) => {
            ref = event.target.dataset.ref;
            increaseQuantity(ref);
        });
    })

    // Affiche le total du panier
    displayCartCount();


}

// Affiche une notification avec le nombre de produits dans le panier
let displayCartCount = () => {

    let nbProducts = cart.length;
    if(nbProducts>0){
        document.querySelector('#btnCart .badge').classList.add('d-block');
        document.querySelector('#btnCart .badge').classList.remove('d-none');
    } else {
        document.querySelector('#btnCart .badge').classList.add('d-none');
        document.querySelector('#btnCart .badge').classList.remove('d-block');
    }
    cartCount.innerHTML = nbProducts;

}

// Création de l'event quand on clique sur la catégorie 1
btnCat1.addEventListener('click', () => {
    cat = getProducts('Categorie1');
    displayProducts(cat, 'products');
    titleH1.innerHTML = 'Catégorie 1';
    btnCat1.classList.add('active');
    btnCat2.classList.remove('active');
    btnCat3.classList.remove('active');
})

// Création de l'event quand on clique sur la catégorie 2
btnCat2.addEventListener('click', () => {
    cat = getProducts('Categorie2');
    displayProducts(cat, 'products');
    titleH1.innerHTML = 'Catégorie 2';
    btnCat1.classList.remove('active');
    btnCat2.classList.add('active');
    btnCat3.classList.remove('active');
})

// Création de l'event quand on clique sur la catégorie 3
btnCat3.addEventListener('click', () => {
    cat = getProducts('Categorie3');
    displayProducts(cat, 'products');
    titleH1.innerHTML = 'Catégorie 3';
    btnCat1.classList.remove('active');
    btnCat2.classList.remove('active');
    btnCat3.classList.add('active');
})

//Chargement des produits et affichage de la catégorie par défaut
loadProducts();
