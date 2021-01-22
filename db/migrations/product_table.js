exports.up = function (knex, Promise) {
    return knex.schema.createTable("product", function (table) {
        table.increments()
        table.string("product_name").notNullable();
        table.integer("price").defaultTo(0);
        table.integer("quantity").defaultTo(0);
        table.timestamps(true,true);
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("product");
};

