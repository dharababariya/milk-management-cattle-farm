exports.up = function (knex, Promise) {
    return knex.schema.createTable("user_details", function (table) {
        table.uuid("id").notNullable();
        table.string("first_name").notNullable();
        table.string("last_name").notNullable();
        table.string("address");
        table.string("phone_number").notNullable();
        table.string("email");
        table.string("password").notNullable();
        table.timestamps(true, true);
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("user_details");
};
