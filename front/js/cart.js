/// ----- Récupérations de l'id, la couleur et la quantité des produits du panier ----- \\

// On crée un tableau vide pour stocker les produits.
let products = [];
// On récupère les données du localStorage.
let panier = JSON.parse(localStorage.getItem('panier')) || {};
// On récupère les ids des produits dans le panier.
const productIds = Object.keys(panier);
// On itère sur chaque id de produit dans le panier.
productIds.forEach(productId => {
  // On itère sur chaque couleur du produit.
  for (let color in panier[productId]) {
    // On récupère la quantité du produit pour la couleur choisie.
    const quantity = panier[productId][color];
    // On récupère les données du produit depuis l'API.
    fetch(`http://localhost:3000/api/products/${productId}`)
      .then(response => response.json())
      .then(data => {
        // On crée un objet product contenant les informations du produit et la quantité choisie.
        let product = {
          id: productId,
          name: data.name,
          color: color,
          price: data.price,
          quantity: quantity,
          imageUrl: data.imageUrl,
          altTxt: data.altTxt
        };
        // On ajoute l'objet product au tableau products.
        products.push(product);
        console.log(product);
        afficherProduits(products); // On appelle la fonction d'affichage de produits en lui passant le tableau de produits en paramètre.
        afficherTotal(products);
      })
      .catch(error => {
        console.error(error);
        alert('Une erreur est survenue lors de la récupération des données du produit. Veuillez réessayer plus tard.');
      });
  }
});

// ----- Fonction d'affichage des produits ----- \\

function afficherProduits(id) {
  const itemsContainer = document.getElementById('cart__items'); // On sélectionne la class où seront affichés les produits.
  let itemsHTML = ''; // On crée une variable vide qui stocke le code HTML généré dynamiquement pour chaque produit.
  // On crée une boucle qui itère sur chaque éléments du tableau.
  for (let i = 0; i < id.length; i++) {
      // On intègre dynamiquement les données dans la page.
      const product = id[i];
      const productHTML = `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
      <div class="cart__item__img">
        <img src="${product.imageUrl}" alt="${product.altTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${product.name}</h2>
          <p>${product.color}</p>
          <p>${product.price} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}" data-item-id="${product.id}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`;
  itemsHTML += productHTML; // On stocke le résultat final dans la variable créée précedemment.
};
  itemsContainer.innerHTML = itemsHTML; // On affiche les produits générés dynamiquement à l'écran.

// On ajoute un gestionnaire d'événement "click" à chaque bouton "Supprimer".
  const deleteButtons = document.querySelectorAll('.deleteItem');
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.closest('.cart__item').dataset.id;
      const color = button.closest('.cart__item').dataset.color;
      supprimerProduit(productId, color);
    });
  });
};


// ----- Fonction d'affichage du prix total et de la quantité totale du panier ----- \\

function afficherTotal(products) {
  let totalQuantity = 0;
  let totalPrice = 0;  
  // On itère sur chaque produit dans le panier et on ajoute sa quantité et son prix au total.
  products.forEach(product => {
    totalQuantity += product.quantity;
    totalPrice += product.price * product.quantity;
  }); 
  // On met à jour le HTML avec les valeurs calculées.
  const totalQuantityElement = document.getElementById('totalQuantity');
  const totalPriceElement = document.getElementById('totalPrice');
  totalQuantityElement.textContent = totalQuantity;
  totalPriceElement.textContent = totalPrice;
};


// ----- Fonction de suppression d'un produit ----- \\

function supprimerProduit(productId, color) {
  // On récupère le panier depuis le localStorage.
  let panier = JSON.parse(localStorage.getItem('panier')) || {};
  
  // On supprime le produit correspondant à l'identifiant et à la couleur du panier.
  delete panier[productId][color];
  
  // Si le panier est vide, on supprime la clé 'panier' du localStorage.
  if (Object.keys(panier[productId]).length === 0) {
    delete panier[productId];
  }
  if (Object.keys(panier).length === 0) {
    localStorage.removeItem('panier');
  } else {
    localStorage.setItem('panier', JSON.stringify(panier));
  }  
  // On recharge la page pour mettre à jour l'affichage.
  location.reload();
};




// On ajoute un évènement "change" à tous les inputs du panier
const itemQuantities = document.querySelectorAll('.itemQuantity');
// Boucle à travers chaque input du panier
itemQuantities.forEach(itemQuantity => {
  // Ajout de l'événement onchange à chaque input
  itemQuantity.addEventListener('change', (event) => {
    // Récupération de l'ID du produit
    const itemId = event.target.dataset.itemId;
    // Récupération de la nouvelle quantité
    const newQuantity = parseInt(event.target.value);
    // Mise à jour de la quantité du produit dans le localStorage
    updateQuantity(itemId, newQuantity);
  });
});


// ----- Fonction de modification de la quantité ----- \\

function updateQuantity(itemId, newQuantity) {
  // Récupération du panier depuis le localStorage
  let cart = JSON.parse(localStorage.getItem('cart'));

  // Recherche du produit à mettre à jour dans le panier
  const productIndex = cart.findIndex(product => product.id === itemId);

  // Mise à jour de la quantité du produit
  cart[productIndex].quantity = newQuantity;

  // Mise à jour du panier dans le localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
};
