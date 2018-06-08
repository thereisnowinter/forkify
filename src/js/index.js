import Search from './models/Search'
import Recipe from './models/Recipe'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import {
  elements,
  renderLoader,
  clearLoader
} from './views/base'

// Total Architecture below
// Global state of the app
// Search object
// Current recipe object
// Shopping list object
// Liked recipes

// search
const state = {}
const controlSearch = async () => {
  // get query from view
  const query = searchView.getInput()

  if (query) {
    // new search object and add to state
    state.search = new Search(query)
    // prepare UI for results
    searchView.clearInput()
    searchView.clearResults()
    renderLoader(elements.searchRes)

    try {
      // search for recipes
      await state.search.getResults()

      // render results on UI
      console.log('result', state.search.results)
      searchView.renderResults(state.search.results)
      clearLoader()
    } catch (error) {
      alert('something wrong with the search')
      clearLoader()
    }


  }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault()
  controlSearch()
})

elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline')
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10)
    searchView.clearResults()
    searchView.renderResults(state.search.results, goToPage)
  }
})

// receipe controler
const controlRecipe = async () => {
  // get id from url
  const id = window.location.hash.replace('#', '')
  console.log(id)
  if (id) {
    // prepare UI for changes
    recipeView.clearRecipe()
    renderLoader(elements.recipe)

    // highlight selected search item
    if (state.search) searchView.highlightSelected(id)

    // create new recipe object
    state.recipe = new Recipe(id)
    try {
      // get recipe data and parse ingredients
      await state.recipe.getRecipe()
      state.recipe.parseIngredients()

      // caculate servings and item
      state.recipe.calcTime()
      state.recipe.calcServings()

      // render recipe
      console.log(state.recipe)
      clearLoader()
      recipeView.renderRecipe(state.recipe)
    } catch (error) {
      alert('Error processing  recipe')
    }

  }
}

// window.addEventListener('hashchange', controlRecipe)
// window.addEventListener('load', controlRecipe)

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))

// handle recipe button clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  // } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
  //   // Add ingredients to shopping list
  //   controlList();
  // } else if (e.target.matches('.recipe__love, .recipe__love *')) {
  //   // Like controller
  //   controlLike();
  // }
  }
  console.log(state.recipe)
})