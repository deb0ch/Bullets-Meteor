
import { Meteor } from 'meteor/meteor';
import { Mongo }  from 'meteor/mongo';
import { check }  from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');


const checkLoggedIn = (meteor) => {
    if (!meteor.userId) {
        throw new Meteor.Error('not logged in');
    }
};


if (Meteor.isServer) {
    Meteor.publish('tasks', function tasksPublication() {
        return Tasks.find();
    });
}


Meteor.methods({
    'tasks.insert'(text) {
        check(text, String);
        checkLoggedIn(this);
        Tasks.insert({
            text,
            createdAt: new Date(),
            owner: this.userId,
            username: Meteor.users.findOne(this.userId).username,
        });
    },

    'tasks.remove'(taskId) {
        check(taskId, String);
        checkLoggedIn(this);
        Tasks.remove(taskId);
    },

    'tasks.setChecked'(taskId, setChecked) {
        check(taskId, String);
        check(setChecked, Boolean);
        checkLoggedIn(this);
        Tasks.update(taskId, {$set: {checked: setChecked}});
    },

    'tasks.setPrivate'(taskId, setToPrivate) {
        check(taskId, String);
        check(setToPrivate, Boolean);
        const task = Tasks.findOne(taskId);
        if (task.owner !== this.userId) {
            throw new Meteor.Error('user does not own the task');
        }
        Tasks.update(taskId, {$set: {private: setToPrivate}});
    },
});
