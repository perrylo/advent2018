let recipes = '37'

let elves = [
  { id:1, pos:0 },
  { id:2, pos:1 }
]

const recipesRequired = 190221 + 10

let limiter = 0
while (recipes.length < recipesRequired && ++limiter<1000000) {
  // 1. Create new recipes
  let rt = elves.reduce((p,c) => p+parseInt(recipes.charAt(c.pos)), 0)
  recipes = `${recipes}${rt}`

  // 2. Move elves
  elves = elves.map(e => {
    let s = parseInt(recipes.charAt(e.pos)) + 1
    let np = s % recipes.length
    e.pos += np
    e.pos = e.pos % recipes.length
    return e
  })
}

console.log('last 10:', recipes.substr(recipes.length-10))

function printRecipes(){
  let r = recipes.split('')
  r[elves[0].pos] = `(${r[elves[0].pos]})`
  r[elves[1].pos] = `[${r[elves[1].pos]}]`
  return r.join(' ')
}