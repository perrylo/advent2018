let recipes = [3,7]

let elves = [
  { id:1, pos:0 },
  { id:2, pos:1 }
]

const target = '190221'
//const target = '59414'

let hasFound = false
let limiter = 0
while (!hasFound) {
  // 1. Create new recipes
  let rt = elves.reduce((p,c) => p+recipes[c.pos], 0)
  recipes.push(...rt.toString().split('').map(Number))

  // 2. Move elves
  elves = elves.map(e => {
    let s = recipes[e.pos] + 1
    let np = s % recipes.length
    e.pos += np
    e.pos = e.pos % recipes.length
    return e
  })

  // 3. Check if we've found target
  let sl = recipes.length-target.length < 0 ? 0 : recipes.length-10
  let lastRecipes = recipes.slice(sl).join('')
  if (lastRecipes.includes(target)) {
    hasFound = true
    console.log('number of recipes:', recipes.length - target.length)
  }
/*
  if (recipes.length >= 20268582) {
    console.log('answer', recipes.slice(recipes.length-10).join(''))
    hasFound = true
  }
*/
  if (++limiter%100000 == 0) {
    console.log(limiter, recipes.length)
  }
}

