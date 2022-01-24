const portalsData = require("../seed_data/portals_seed_data");

exports.seed = function (knex) {
  return knex("portals")
    .del()
    .then(function () {
      return knex("portals").insert(portalsData);
    });
};
