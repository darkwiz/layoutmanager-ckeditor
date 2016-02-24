//Year.js
define(['models/Base'], function (Base) {
    return Base.extend({
      defaults: _.extend({
        elem: "date",
        type:"year",
        elementValues: [""],
        elementCss : "",
      }, Base.prototype.defaults),

       initialize: function(attrs, options) {

           Base.prototype.initialize.call(this, attrs, options);

            var today = new Date();

            //Schema defaults
            var schema = _.extend({
              yearStart: today.getFullYear() - 100,
              yearEnd: today.getFullYear()
            }, {});


            var yearRange = (schema.yearStart < schema.yearEnd)
              ? _.range(schema.yearStart, schema.yearEnd + 1)
              : _.range(schema.yearStart, schema.yearEnd - 1, -1);

            var yearsOptions = _.map(yearRange, function(year) {
              return year;
            });

            this.set("years", yearsOptions);
          }
    });
  });
