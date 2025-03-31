import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const { nanoid } = await import('nanoid');

    // Create wards table
    await knex.schema.createTable("wards", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.enum("color", ["Red", "Green", "Blue", "Yellow"]).notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now()); // Auto-populated on creation
        table.timestamp("modified_at").defaultTo(knex.fn.now()); // Updated on modification
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
        table.timestamp("created_at").defaultTo(knex.fn.now()); // Auto-populated on creation
        table.timestamp("modified_at").defaultTo(knex.fn.now()); // Updated on modification
    });

    // Insert initial nurses
    await knex("nurses").insert([
        { employee_id: nanoid(10), first_name: "John", last_name: "Doe", email: "john.doe@example.com", ward_id: 1 },
        { employee_id: nanoid(10), first_name: "Jane", last_name: "Doe", email: "jane.doe@example.com", ward_id: 2 },
        { employee_id: nanoid(10), first_name: "Alice", last_name: "Smith", email: "alice.smith@example.com", ward_id: 3 },
        { employee_id: nanoid(10), first_name: "Bob", last_name: "Johnson", email: "bob.johnson@example.com", ward_id: 4 },
        { employee_id: nanoid(10), first_name: "Charlie", last_name: "Brown", email: "charlie.brown@example.com", ward_id: 5 },
        { employee_id: nanoid(10), first_name: "Emma", last_name: "Wilson", email: "emma.wilson@example.com", ward_id: 1 },
        { employee_id: nanoid(10), first_name: "Liam", last_name: "Martinez", email: "liam.martinez@example.com", ward_id: 2 },
        { employee_id: nanoid(10), first_name: "Olivia", last_name: "Anderson", email: "olivia.anderson@example.com", ward_id: 3 },
        { employee_id: nanoid(10), first_name: "Noah", last_name: "Thomas", email: "noah.thomas@example.com", ward_id: 4 },
        { employee_id: nanoid(10), first_name: "Sophia", last_name: "Garcia", email: "sophia.garcia@example.com", ward_id: 5 },
        { employee_id: nanoid(10), first_name: "Mason", last_name: "Taylor", email: "mason.taylor@example.com", ward_id: 1 },
        { employee_id: nanoid(10), first_name: "Isabella", last_name: "Hernandez", email: "isabella.hernandez@example.com", ward_id: 2 },
        { employee_id: nanoid(10), first_name: "James", last_name: "Moore", email: "james.moore@example.com", ward_id: 3 },
        { employee_id: nanoid(10), first_name: "Ava", last_name: "Rodriguez", email: "ava.rodriguez@example.com", ward_id: 4 },
        { employee_id: nanoid(10), first_name: "Elijah", last_name: "Lopez", email: "elijah.lopez@example.com", ward_id: 5 },
        { employee_id: nanoid(10), first_name: "Lucas", last_name: "Gonzalez", email: "lucas.gonzalez@example.com", ward_id: 1 },
        { employee_id: nanoid(10), first_name: "Mia", last_name: "Perez", email: "mia.perez@example.com", ward_id: 2 },
        { employee_id: nanoid(10), first_name: "Ethan", last_name: "Walker", email: "ethan.walker@example.com", ward_id: 3 },
        { employee_id: nanoid(10), first_name: "Harper", last_name: "Hall", email: "harper.hall@example.com", ward_id: 4 },
        { employee_id: nanoid(10), first_name: "Benjamin", last_name: "Young", email: "benjamin.young@example.com", ward_id: 5 }
    ]);

    // Add index on ward_id for the nurses table (helpful for join)
    await knex.schema.table("nurses", (table) => {
        table.index("ward_id", "idx_nurses_ward_id");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("nurses");
    await knex.schema.dropTableIfExists("wards");
}
