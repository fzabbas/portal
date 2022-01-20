const portalsData = require("../seed_data/portals_seed_data");

exports.seed = function (knex) {
  return knex("portals")
    .del()
    .then(function () {
      return knex("portals").insert(portalsData);
    });
};

// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> }
//  */
// exports.seed = function(knex) {
//   // Deletes ALL existing entries
//   return knex('portals')
//   .del()
//     .then(function () {
//       // Inserts seed entries
//       return knex('portals').insert([
//         {id: 1, colName: 'rowValue1'},
//         {id: 2, colName: 'rowValue2'},
//         {id: 3, colName: 'rowValue3'}
//       ]);
//     });
// };
