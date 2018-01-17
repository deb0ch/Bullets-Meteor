
import React, { Component } from 'react';
import classnames           from 'classnames';

import { Tasks } from '../api/tasks.js'


// Task component - represents a single item
export default class Task extends Component {
    render() {
        const taskClassName = classnames({
            checked: this.props.task.checked,
            private: this.props.task.private,
        });
        return (
            <li className={taskClassName}>
                <button className="delete"
                        onClick={this.remove.bind(this)}>
                &times;
                </button>
                <input type="checkbox"
                       readOnly
                       checked={Boolean(this.props.task.checked)}
                       onChange={this.toggleChecked.bind(this)} />
                    {this.props.showPrivateButton
                     ? <button className="toggle-private"
                               onClick={this.togglePrivate.bind(this)} >
                           {this.props.task.private ? 'Private' : 'Public'}
                       </button>
                     : ''}
                <span className="text">
                    <strong>{this.props.task.username}: </strong>
                    {this.props.task.text}
                </span>
            </li>
        );
    }

    togglePrivate() {
        Meteor.call('tasks.setPrivate',
                    this.props.task._id,
                    !this.props.task.private);
    }

    toggleChecked() {
        Meteor.call('tasks.setChecked',
                    this.props.task._id,
                    !this.props.task.checked);
    }

    remove() {
        Meteor.call('tasks.remove', this.props.task._id);
    }
}
