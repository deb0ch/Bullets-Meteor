
import { Meteor }  from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { Tasks } from '../api/tasks.js';


export const fetchTasks = () => {
    return (dispatch) => {
        Tracker.autorun(() => {
            dispatch({
                type: 'SET_TASKS',
                payload: Tasks.find({}, {sort: {createdAt: -1}}).fetch(),
            })
        })
    };
}
