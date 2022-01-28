/**
 * Creating a table
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("portals", (table) => {
    table.increments("id").primary();
    table.string("portal_name").notNullable();
    table.string("password").notNullable().unique();
    table.binary("portal_doc").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("portals");
};
