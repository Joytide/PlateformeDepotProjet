'use strict';

const mongoose = require('../helpers/mongo');
const Schema = mongoose.Schema;


const TaskSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the task'
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: [
      {
        type: String,
        enum: ['pending', 'ongoing', 'completed']
      }
    ],
    default: ['pending']
  }
});
const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;