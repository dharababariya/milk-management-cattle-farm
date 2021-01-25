exports.up = function (knex) {
    return knex.schema
        .createTable("users", function (table) {
            table.uuid("id").notNullable();
            table.string("first_name").notNullable();
            table.string("last_name").notNullable();
            table.string("address");
            table.string("phone_number").notNullable();
            table.string("email");
            table.string("role");
            table.string("password").notNullable();
            table.timestamps(true, true);
        })
        .createTable("products", function (table) {
            table.increments();
            table.string("product_name").notNullable();
            table.integer("price").defaultTo(0);
            table.integer("quantity").defaultTo(0);
            table.timestamps(true, true);
        })
        .createTable("orders", function (table) {
            table.increments();
            table
                .string("phone_number")
                .references("phone_number")
                .inTable("user_details")
                .notNullable();
            table.string("product_name").notNullable();
            table.integer("amount").notNullable();
            table.integer("status");
            table.timestamps(true, true);
        })
        .createTable("payment_details", function (table) {
            table.increments();
            table
                .string("phone_number")
                .notNullable()
                .references("phone_number")
                .inTable("user_details");
            table.string("total").defaultTo(0);
            table.timestamps(true, true);
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTable("user_details")
        .dropTable("product")
        .dropTable("order")
        .dropTable("payment_details");
};
