// On récupère l'id du produit depuis l'url de la page actuelle.
const currentUrl = new URL(window.location.href);
const searchParams = new URLSearchParams(currentUrl.search);
const productId = searchParams.get("id");

// ----- Récupération des données de l'API et affichage du produit sur la page produit ----- \\
fetch(`http://localhost:3000/api/products/${productId}`) // On récupère les données du produit avec l'ID correspondant depuis l'API.
    .then(response => response.json()) // On les transforme en JSON.
    .then(data => {
      console.log(data); // On affiche les données récupérées dans la console.
      afficherProduit(data);
    })
    // En cas d'erreur, on affiche un message d'erreur dans la console et une alerte sur la page.
    .catch(error => {
        console.error(error);
        alert('Une erreur est survenue lors de la récupération des données du produit. Veuillez réessayer plus tard.');
      });

// ----- Fonction d'affichage du produit ----- \\

function afficherProduit(id) {
    // On récupère les éléments HTML où afficher les données.
    const itemImg = document.querySelector('article div.item__img');
    const titleElement = document.getElementById('title');
    const priceElement = document.getElementById('price');
    const descriptionElement = document.getElementById('description');
    const colorsElement = document.getElementById('colors');
    // On intègre dynamiquement les données dans la page.
    itemImg.innerHTML = `<img src="${id.imageUrl}" alt="${id.altTxt}">`;
    titleElement.textContent = id.name;
    priceElement.textContent = id.price;
    descriptionElement.textContent = id.description;
    // On crée une boucle qui itère sur chaque couleur du produit et ajoute une option à la liste déroulante.
    for (let i = 0; i < id.colors.length; i++) {
        const color = id.colors[i];
        const optionElement = document.createElement('option');
        optionElement.value = color;
        optionElement.textContent = color;
        colorsElement.appendChild(optionElement);
      };
};

// On récupère l'élément du bouton "Ajouter au panier".
const boutonAjouter = document.getElementById('addToCart');

// On ajoute un écouteur d'événement sur le clic du bouton "Ajouter au panier".
boutonAjouter.addEventListener('click', (ajouterAuPanier))

// ----- Fonction d'ajout au panier ----- \\

function ajouterAuPanier() {
    // On vérifie si une couleur et une quantité ont été sélectionnées et si la quantité est comprise entre 1 et 100.
    if (!verificationAjoutPanier()) {
        return; // Si la vérification ne passe pas, on arrête l'exécution de la fonction.
    }
    // On récupère les informations du produit.
    const selectedColor = document.getElementById('colors').value;
    const selectedQuantity = document.getElementById('quantity').value;
    let panier = JSON.parse(localStorage.getItem('panier')) || {}; // On récupère les données du localStorage.
    // Si le produit n'a pas encore été ajouté au panier, on crée une nouvelle entrée dans l'objet panier.
    if (!panier[productId]) {
        panier[productId] = {};
    }
     // Si la couleur sélectionnée n'a pas encore été ajoutée au produit, on crée une nouvelle entrée dans l'objet produit.
    if (!panier[productId][selectedColor]) {
        panier[productId][selectedColor] = 0;
    }
    panier[productId][selectedColor] += parseInt(selectedQuantity); // On ajoute la quantité du produit sélectionné dans le panier.
    localStorage.setItem('panier', JSON.stringify(panier));
}

// ----- Fonction de vérification Quantité/Couleur ----- \\
function verificationAjoutPanier() {
    // On récupère la couleur et la quantité sélectionnées par l'utilisateur.
    const selectedColor = document.getElementById('colors').value;
    const selectedQuantity = document.getElementById('quantity').value;

    // On vérifie si une couleur et une quantité ont été sélectionnées et si la quantité est comprise entre 1 et 100.
    if (selectedColor === "" || selectedQuantity === "" || selectedQuantity < 1 || selectedQuantity > 100) {
        alert("Veuillez sélectionner une couleur et une quantité comprise entre 1 et 100.");
        return false; // On retourne false pour empêcher l'ajout au panier.
    } else {
        return true; // On retourne true pour permettre l'ajout au panier.
    }
}

