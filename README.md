# portal

A README for me.

how to do migrations and seeding:

npx knex seed:run
//create table
npx knex migrate:latest
//drop table
npx knex migrate:rollback
npx knex migrate:down
