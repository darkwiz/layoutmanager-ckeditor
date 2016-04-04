/**
 * Event Aggregator - Remember In AMD, define callback executes only ones. Its result is used in all dependent modules.
 * so in vent.js is not returning a new object every time it is required by a different module.
 */
define(['underscore', 'backbone'], function (_, Backbone) {
    return _.extend({}, Backbone.Events);
});