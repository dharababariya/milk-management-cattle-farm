
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('products').del()
    .then(function () {
      // Inserts seed entries
      return knex('products').insert([
        {id: 1, "product_name": 'milk',"price":60,"quantity":100},
        {id: 2, "product_name": 'butter',"price":200,"quantity":30},
        {id: 3, "product_name": 'butter Milk',"price":10,"quantity":50},
        {id: 4, "product_name": 'ghee',"price":600,"quantity":10},
      ]);
    });
};
