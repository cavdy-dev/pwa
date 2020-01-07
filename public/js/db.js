// offline db
db.enablePersistence().catch(err => {
  switch (err.code) {
    case 'faild-precondition':
      // multiple tabs
      console.log('Persistence failed');
      break;
    case 'unimplemented':
      // LAck of browser support
      console.log('Persistence is not available');
      break;
  }
});

// realtime listener
db.collection('recipes').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added') {
      renderRecipe(change.doc.data(), change.doc.id);
    }

    if (change.type === 'removed') {
      removeRecipe(change.doc.id);
    }
  });
});

// add new recipe
const form = document.querySelector('.add-recipe');
form.addEventListener('submit', event => {
  event.preventDefault();

  const recipe = {
    title: form.title.value,
    ingredients: form.ingredients.value
  };

  db.collection('recipes')
    .add(recipe)
    .catch(err => console.log(err));

  form.title.value = '';
  form.ingredients.value = '';
});

// delete recipe
const reciepeContainer = document.querySelector('.recipes');
reciepeContainer.addEventListener('click', event => {
  if (event.target.tagName === 'I') {
    const id = event.target.getAttribute('data-id');
    db.collection('recipes')
      .doc(id)
      .delete();
  }
});
