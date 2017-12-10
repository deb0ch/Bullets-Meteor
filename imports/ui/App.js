
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Task from './Task.js';
import { Tasks } from '../api/tasks.js';

class App extends Component {
    render() {
        return (
            <div className='container'>
                <header>
                    <h1>Todo List</h1>
                    <form className="new-task"
                          onSubmit={this.onFormSubmit.bind(this)}>
                        <input type="text"
                               value={this.state.inputText}
                               placeholder="Type to add new tasks"
                               onChange={this.onFormChange.bind(this)}/>
                    </form>
                </header>
                <ul> {
                    this.props.tasks.map((task) => (
                        <Task key={task._id} task={task}/>
                    ))
                } </ul>
            </div>
        );
    }

    constructor(props) {
        super(props);
        this.state = {
            inputText: "",
        };
    }

    onFormSubmit(event) {
        event.preventDefault();
        var inputText = this.state.inputText;
        Tasks.insert({
            text: inputText,
            createdAt: new Date(),
        });
        this.setState({inputText: ""});
    }

    onFormChange(event) {
        this.setState({inputText: event.target.value});
    }
}

export default withTracker(() => {
    return {
        tasks: Tasks.find({}).fetch(),
    };
})(App);
