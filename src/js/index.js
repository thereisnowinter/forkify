import Search from './models/Search'
import Recipe from './models/Recipe'
import * as searchView from './views/searchView'
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
    } catch(error) {
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
    } catch (error) {
      alert('Error processing  recipe')
    }

  }
}

// window.addEventListener('hashchange', controlRecipe)
// window.addEventListener('load', controlRecipe)

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))