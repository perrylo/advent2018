console.time("d14");


let result = run(190221);
console.log("Answer (part I):", result.score);
console.log("Answer (part II):", result.part2);

console.timeEnd("d14");


function run(n) {
  // init data
  let data = {
    score: null,
    part2: -1,
    recipes: [3, 7],
    elf1: 0,
    elf2: 1,
    n: n,
    nStr: n.toString()
  };

  // keep making recipes until we have the solution for both problems
  let expectedRecipes = n + 10;
  while (!data.score || data.part2 < 0) {
    let toAdd = (data.recipes[data.elf1] + data.recipes[data.elf2])
      .toString()
      .split("")
      .map(Number);
    data.recipes.push(...toAdd);
    data.elf1 = (data.elf1 + 1 + data.recipes[data.elf1]) % data.recipes.length;
    data.elf2 = (data.elf2 + 1 + data.recipes[data.elf2]) % data.recipes.length;

    // check if we already reach the desired number of recipes to get the score
    if (!data.score && data.recipes.length >= expectedRecipes) {
      data.score = data.recipes.slice(n, n + 10).join("");
    }

    // check if we found our input in the recipes list for the first time
    // optimization: we just need to look it up at the end of the recipes list, no need to indexOf of the full list each time!
    if (data.part2 < 0) {
      let offset = data.recipes.length - toAdd.length - data.nStr.length;
      let subrecipes = data.recipes.slice(offset, data.recipes.length).join("");
      let index = subrecipes.indexOf(data.nStr);
      if (index > -1) {
        data.part2 = index + offset;
      }
    }

    //printStatus(data);
  }

  return data;
}

function printStatus(data) {
  console.log(
    data.recipes
      .map((recipe, index) => {
        if (index === data.elf1) return `(${recipe})`;
        if (index === data.elf2) return `[${recipe}]`;
        return recipe;
      })
      .join(" ")
  );
}

programReadLine(rl);