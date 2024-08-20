import { Faker } from "@faker-js/faker";
import { admin, admin_permission, admin_role, admin_role_permission, administrator_role } from "../models";
import { TMySqlDB } from "../../src/libs/database/orms/drizzle";
import DrizzleDBSeeder from "../../src/libs/database/orms/drizzle/seed";

export const runSeeder = async () => await DrizzleDBSeeder.runSeeder([
    {
        name: 'PERMISSION_SEEDER',
        callback: async (client: TMySqlDB, faker: Faker) => {
            await client.insert(admin_permission).values({
                name: faker.person.firstName(),
                tag: 'CREATE',
                identifier: faker.word.sample(10),
                description: faker.lorem.text()
            })
        }
    },
    {
        name: 'ADMIN_INSTALLATION_SEEDER',
        times: 10,
        callback: async (client: TMySqlDB, faker: Faker) => {
            await client.transaction(async (tx) => {

                const perm = await tx.insert(admin_permission).values({
                    name: faker.person.firstName(),
                    tag: 'CREATE',
                    identifier: faker.word.sample(10),
                    description: faker.lorem.text()
                }).$returningId();

                const role = await tx.insert(admin_role).values({
                    name: faker.internet.domainWord(),
                    description: faker.word.words(100),
                    immutable: false,
                }).$returningId();

                const role_perm = await tx.insert(admin_role_permission).values({
                    admin_role_id: role[0].id,
                    admin_perm_id: perm[0].id
                }).$returningId();

                const admin_res = await tx.insert(admin).values({
                    staff_id: faker.internet.displayName(),
                    first_name: faker.person.firstName(),
                    last_name: faker.person.lastName(),
                    avatar_id: null,
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                    enabled: true,
                }).$returningId();

                const ad_role = await tx.insert(administrator_role).values({
                    admin_id: admin_res[0].id,
                    admin_role_id: role_perm[0].id
                }).$returningId();
            });
        }
    }
])

// runSeeder();