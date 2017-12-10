
import React, { Component } from 'react';

import { Tasks } from '../api/tasks.js'

// Task component - represents a single item
export default class Task extends Component {
    render() {
        return (
            <li className={this.props.task.checked ? "checked" : ""}>
                <button className="delete"
                        onClick={this.remove.bind(this)}>
                &times;
                </button>
                <input type="checkbox"
                       readOnly
                       checked={Boolean(this.props.task.checked)}
                       onChange={this.toggleChecked.bind(this)} />
                <span className="text">
                    <strong>{this.props.task.username}: </strong>
                    {this.props.task.text}
                </span>
            </li>
        );
    }

    toggleChecked() {
        Tasks.update(this.props.task._id,
                     {$set:{checked:!this.props.task.checked}});
    }

    remove() {
        Tasks.remove(this.props.task._id);
    }
}
