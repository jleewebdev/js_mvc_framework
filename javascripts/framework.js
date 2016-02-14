function ModelConstructor(options) {
  var id_count = 0;

  function Model(attrs) {
    id_count++;
    var self = this;
    self.attributes = attrs || {};
    self.id = id_count;
    self.attributes.id = id_count;
    if (options && options.change && _.isFunction(options.change)) {
      this.__events.push(options.change);
    }
  }

  Model.prototype = {
    __events: [],

    set: function(key, value) {
      this.attributes[key] = value;
      this.triggerChange();
    },

    get: function(key) {
      return this.attributes[key];
    },

    triggerChange: function() {
      this.__events.forEach(function(cb) {
        cb();
      });
    },

    addCallback: function(cb) {
      this.__events.push(cb);
    }
  };

_.extend(Model.prototype, options);

return Model;
}
