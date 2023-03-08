// ----- Récupération des données de l'API et affichage des produits sur la page d'accueil ----- \\

fetch('http://localhost:3000/api/products') // On récupère les données de l'API.
.then(response => response.json()) // On les transforme en JSON.
.then(data => {
  console.log(data); // On affiche les données récupérées dans la console.
  afficherProduits(data); // On appelle la fonction d'affichage des produits.   
})
// En cas d'erreur, on affiche un message d'erreur dans la console et une alerte sur la page.
.catch(error => {
  console.error(error);
  alert('Une erreur est survenue lors de la récupération des produits. Veuillez réessayer plus tard.');
});


// ----- Fonction d'affichage des produits ----- \\

function afficherProduits(kanap) {
    const itemsContainer = document.getElementById('items'); // On sélectionne la class où seront affichés les produits.
    let itemsHTML = ''; // On crée une variable vide qui stocke le code HTML généré dynamiquement pour chaque produit.
    // On crée une boucle qui itère sur chaque éléméne du tableau.
    for (let i = 0; i < kanap.length; i++) {
        // On intègre dynamiquement les données dans la page.
        const product = kanap[i];
        const productHTML = `<a href="./product.html?id=${product._id}">
      <article>
          <img src="${product.imageUrl}" alt="${product.altTxt}">
          <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}</p>
      </article>
      </a>`;
    itemsHTML += productHTML; // On stocke le résultat final dans la variable créée précedemment.
  };
  itemsContainer.innerHTML = itemsHTML; // On affiche les produits générés dynamiquement à l'écran.
};
