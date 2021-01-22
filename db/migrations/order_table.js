exports.up = function (knex, Promise) {
    return knex.schema.createTable("order", function (table) {
        table.increments();
        table.string("phone_number").notNullable();
        table.string("product_name").notNullable();
        table.integer("amount").notNullable();
        table.integer("status");
        table.timestamps(true, true);
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("order");
};
