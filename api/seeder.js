require('module-alias/register')
const { createFakeProducts } = require('@products/products.seeder')
const { createFakeCategories } = require('@categories/categories.seeder')
const { createFakeUsers } = require('@users/users.seeder');

function executeSeeder(seeder) {
  console.log(seeder);
}

(async () => {
  try {
    executeSeeder(await createFakeProducts())
    executeSeeder(await createFakeCategories())
    executeSeeder(await createFakeUsers())
  } catch (err) {
    throw err
  }
})()
