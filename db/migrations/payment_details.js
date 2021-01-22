exports.up = function (knex, Promise) {
    return knex.schema.createTable("payment_details", function (table) {
        table.increments();
        table.string("phone_number").notNullable();
        table.string("total").defaultTo(0);
        table.timestamps(true, true);
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("payment_details");
};
