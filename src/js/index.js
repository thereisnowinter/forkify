import Search from './models/Search'
import * as searchView from './views/searchView'
import {elements, renderLoader, clearLoader} from './views/base'


// Global state of the app
// Search object
// Current recipe object
// Shopping list object
// Liked recipes

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
    
    // search for recipes
    await state.search.getResults()

    // render results on UI
    console.log('result', state.search.results)
    searchView.renderResults(state.search.results)
    clearLoader()

  }
}

document.querySelector('.search').addEventListener('submit', e => {
  e.preventDefault()
  controlSearch()
})

// const search = new Search('pizza')
// console.log(search)
// search.getResults()