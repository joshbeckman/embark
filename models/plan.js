/**
  * Plan: A guiding feature set
  *
  */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    createdModifiedPlugin = require('mongoose-createdmodified').createdModifiedPlugin;

var Plan = new Schema({
    name: {type: String, default: ''}
});
Plan.plugin(createdModifiedPlugin, {index: true});
module.exports = mongoose.model('Plan', Plan);
