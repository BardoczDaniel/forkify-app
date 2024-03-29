import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";

// if (module.hot) {
//   module.hot.accept();
// }

// console.log(icons);
//https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886
//https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcb34
const recipeContainer = document.querySelector('.recipe');



// https://forkify-api.herokuapp.com/v2

/////////////////////////////////////////////////////////////////////////
// Loading a Recipe from API

const controlRecipes = async function () {

  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //3 Updating bookmarks
    bookmarksView.update(model.state.bookmarks);

    //1 Loading recipe 
    await model.loadRecipe(id);

    //2 Rendering recipe
    recipeView.render(model.state.recipe);

  }

  catch (err) {
    recipeView.renderError();

  };

};

// controlRecipes();


const controlSearchResults = async function () {
  try {

    resultsView.renderSpinner();

    //1 Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2 Load search results
    await model.loadSearchResults(query);

    //3 Render results
    console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));

    //4 Render initial pagination
    paginationView.render(model.state.search);
  }

  catch (err) {
    recipeView.renderError(err);
  }

}


const controlPagination = function (goToPage) {

  //1 Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2 Render new initial pagination
  paginationView.render(model.state.search);

}


const controlServings = function (newServings) {

  //Update the recipe servings (in state);
  model.updateServings(newServings);

  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}


const controlAddBookmark = function () {

  // 1) Add/remove Bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);


  //2) Update recipe view
  recipeView.update(model.state.recipe)

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function () {

  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function (newRecipe) {
  try {

    //Render spinner 
    addRecipeView.renderSpinner();

    //Upload the new Recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render Recipe
    recipeView.render(model.state.recipe);


    //Success message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC);
  }
  catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
}

const newFeauture = function () {
  console.log('Welcome to the application!');
}

const init = function () {

  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView._addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeauture();
}

init();

// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);



