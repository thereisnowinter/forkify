import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as likesView from './views/likesView'
import * as listView from './views/listView'



import {
  elements,
  renderLoader,
  clearLoader
} from './views/base'
import Likes from './models/Likes';

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
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id))
    } catch (error) {
      alert('Error processing  recipe')
    }

  }
}
// window.addEventListener('hashchange', controlRecipe)
// window.addEventListener('load', controlRecipe)

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))

// list controller
const controlList = () => {
  // create a new list if there is none
  if (!state.list) state.list = new List()
  // add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient)
    listView.renderItem(item)
  })
}

// handle delete and update list item events
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid
  console.log(id)
  // handle the delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // delete from state
    state.list.deleteItem(id)
    // delete from UI
    listView.deleteItem(id)
    // handle the count update
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10)
    state.list.updateCount(id, val)
  }
})


// like controller
const controlLike = () => {
  if (!state.likes) state.likes = new Likes()
  const currentID = state.recipe.id
  // user has not yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // add like to the new state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    )
    // toggle the like button
    likesView.toggleLikeBtn(true)

    // add like to UI list
    likesView.renderLike(newLike)
    console.log(state.likes)
  } else {
    // remove like from the state
    state.likes.deleteLike(currentID)
    // toggle the like button
    likesView.toggleLikeBtn(false)

    // remove like from UI list
    console.log(state.likes)
    likesView.deleteLike(currentID)
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes())
}

// restore liked recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes()
  // restore likes
  state.likes.readStorage()
  // toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes())
  // render the existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like))
})

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
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // Add ingredients to shopping list
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // Like controller
    controlLike();
  }
  console.log(state.recipe)
})