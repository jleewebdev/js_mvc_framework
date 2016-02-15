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

    remove: function(key) {
      delete this.attributes[key];
      this.triggerChange();
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

function CollectionConstructor(options) {

  function Collection(model_constructor) {
    this.models = [];
    this.model = model_constructor;
  }

  Collection.prototype = {
    reset: function() {
      this.models = [];
    },

    add: function(model) {
      var old_model = _(this.models).findWhere({id: model.id}),
          new_model;

      if (old_model) { return old_model; }

      new_model = new this.model(model);
      this.models.push(new_model);

      return new_model;
    },

    remove: function(model) {
      model = _.isNumber(model) ? { id: model } : model;

      var m = _(this.models).findWhere(model);

      if (!m) { return };

      this.models = this.models.filter(function(existing_m) {
        return existing_m.attributes.id !== m.id;
      });
    },

    get: function(idx) {
      return _(this.models).findWhere({ id: idx} );
    },

    set: function(models) {
      this.reset();
      models.forEach(this.add.bind(this));
    }
  };

  _.extend(Collection.prototype, options);

  return Collection;
}
