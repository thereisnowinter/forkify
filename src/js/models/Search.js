import axios from 'axios'

export default class Search {
  constructor(query) {
    this.query = query
  }

  async getResults() {
    const proxy = 'https://cors-anywhere.herokuapp.com/'
    const key = '483ba011c3bd474a580e44eea6756b8e'
    try {
      const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`)
      this.results= res.data.recipes
      
    } catch(error) {
      alert(error)
    }
  }
}