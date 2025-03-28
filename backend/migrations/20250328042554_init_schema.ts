import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const { nanoid } = await import('nanoid');

    // Create wards table
    await knex.schema.createTable("wards", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.enum("color", ["Red", "Green", "Blue", "Yellow"]).notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now()); // Auto-populated on creation
        table.timestamp("modified_at").defaultTo(knex.fn.now()); // Updated on modification (No need to use .alter() here)
    });

    // Insert initial wards
    await knex("wards").insert([
        { name: "Ward 1", color: "Red" },
        { name: "Ward 2", color: "Green" },
        { name: "Ward 3", color: "Blue" },
        { name: "Ward 4", color: "Yellow" },
        { name: "Ward 5", color: "Red" }
    ]);

    // Create nurses table
    await knex.schema.createTable("nurses", (table) => {
        table.increments("id").primary();
        table.string("employee_id").notNullable().unique();
        table.string("first_name").notNullable();
        table.string("last_name").notNullable();
        table.string("email").notNullable().unique();
        table.integer("ward_id").unsigned().notNullable().references("id").inTable("wards").onDelete("CASCADE");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("modified_at").defaultTo(knex.fn.now()); // Updated on modification (No need to use .alter() here)
    });

    // Insert initial nurses
    await knex("nurses").insert([
        { employee_id: nanoid(10), first_name: "John", last_name: "Doe", email: "john.doe@example.com", ward_id: 1 },
        { employee_id: nanoid(10), first_name: "Jane", last_name: "Doe", email: "jane.doe@example.com", ward_id: 2 },
        { employee_id: nanoid(10), first_name: "Alice", last_name: "Smith", email: "alice.smith@example.com", ward_id: 3 },
        { employee_id: nanoid(10), first_name: "Bob", last_name: "Johnson", email: "bob.johnson@example.com", ward_id: 4 },
        { employee_id: nanoid(10), first_name: "Charlie", last_name: "Brown", email: "charlie.brown@example.com", ward_id: 5 }
    ]);
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("nurses");
    await knex.schema.dropTableIfExists("wards");
}
