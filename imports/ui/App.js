
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import AccountsUIWrapper from './AccountsUIWrapper.js';
import Task from './Task.js';
import { Tasks } from '../api/tasks.js';


const TaskList = props => (
    <ul> {
        (() => {
            let filteredList = props.tasks.filter(item => (
                !props.hideChecked || !item.checked
            ));
            return filteredList.map((task) => {
                const currentUserId = (props.currentUser
                                       && props.currentUser._id);
                const showPrivateButton = (task.owner === currentUserId);
                return (
                    <Task key={task._id}
                          task={task}
                          showPrivateButton={showPrivateButton} />
                );
            });
        })()
    } </ul>
);


class TaskInput extends Component {
    render = () => (
        this.props.currentUser
        ? <div> {
              <form className="new-task"
                    onSubmit={this.onFormSubmit.bind(this)}>
                  <input type="text"
                         value={this.state.inputText}
                         placeholder="Type to add new tasks"
                         onChange={this.onFormChange.bind(this)} />
              </form>
          } </div>
        : ""
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
        Meteor.call('tasks.insert', this.state.inputText.trim());
        this.setState({inputText: ""});
    }
}


const VisibilitySelector = props => (
    <label className="hide-completed">
        <input type="checkbox"
               readOnly
               checked={props.hideChecked}
               onChange={props.handleToggleVisibility} />
        Hide checked
    </label>
);


const CheckedItemsCounter = props => (
    <div className="counter">
        Completed: {props.counter}
    </div>
);


class App extends Component {
    render = () => (
        <div className='container'>
            <header>
                <h1>Todo List</h1>
                <VisibilitySelector checked={this.state.hideChecked}
                                    handleToggleVisibility={
                                        this.handleToggleVisibility.bind(this)
                                    } />
                <AccountsUIWrapper />
                <TaskInput value={this.state.inputText}
                           currentUser={this.props.currentUser}/>
            </header>
            <TaskList tasks={this.props.tasks}
                      hideChecked={this.state.hideChecked}
                      currentUser={this.props.currentUser}/>
            <CheckedItemsCounter counter={this.props.checkedCounter} />
        </div>
    );

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
    Meteor.subscribe('tasks');
    return {
        tasks: Tasks.find({}, {sort: {createdAt: -1}}).fetch(),
        checkedCounter: Tasks.find({checked: {$eq: true}}).count(),
        currentUser: Meteor.user(),
    };
})(App);
