
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Task from './Task.js';
import { Tasks } from '../api/tasks.js';


const TaskList = props => (
    <ul> {
        (() => {
            let filteredList = props.tasks.filter(item => (
                !props.hideChecked || !item.checked
            ));
            return filteredList.map((task) => (
                    <Task key={task._id} task={task}/>
            ));
        })()
    } </ul>
);


class TaskInput extends Component {
    render = () => (
        <div> {
            <form className="new-task"
                  onSubmit={this.onFormSubmit.bind(this)}>
                <input type="text"
                       value={this.state.inputText}
                       placeholder="Type to add new tasks"
                       onChange={this.onFormChange.bind(this)}/>
            </form>
        } </div>
    )

    constructor(props) {
        super(props);
        this.state = {
            inputText: "",
        }
    }

    onFormChange(event) {
        this.setState({inputText: event.target.value});
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
}


const VisibilitySelector = props => (
    <label className="hide-completed">
        <input type="checkbox"
               readOnly
               checked={props.hideChecked}
               onChange={props.handleToggleVisibility}
        />
        Hide checked
    </label>
);


const CheckedItemsCounter = props => (
    <div className="counter">
        Completed: {props.counter}
    </div>
);


class App extends Component {
    render() {
        return (
            <div className='container'>
                <header>
                    <h1>Todo List</h1>
                    <VisibilitySelector checked={this.state.hideChecked}
                                        handleToggleVisibility={
                                            this.handleToggleVisibility.bind(this)
                                        }/>
                    <TaskInput value={this.state.inputText}/>
                </header>
                <TaskList tasks={this.props.tasks}
                          hideChecked={this.state.hideChecked}/>
                <CheckedItemsCounter counter={this.props.checkedCounter}/>
            </div>
        );
    }

    constructor(props) {
        super(props);
        this.state = {
            hideChecked: false,
        };
    }

    handleToggleVisibility() {
        this.setState({hideChecked: !this.state.hideChecked})
    }
}

export default withTracker(() => {
    return {
        tasks: Tasks.find({}, {sort: {createdAt: -1}}).fetch(),
        checkedCounter: Tasks.find({checked: {$eq: true}}).count(),
    };
})(App);
