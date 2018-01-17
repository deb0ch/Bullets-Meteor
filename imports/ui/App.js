
import React                        from 'react';
import { Component, PureComponent } from 'react';
import { connect }                  from 'react-redux';
import { Meteor }                   from 'meteor/meteor';
import { withTracker }              from 'meteor/react-meteor-data';

import AccountsUIWrapper       from './AccountsUIWrapper.js';
import Task                    from './Task.js';
import { Tasks }               from '../api/tasks.js';
import { SubscribedComponent } from '../SubscribedComponent';


const TaskList = (props) => (
    <ul> {
        (() => {
            let filteredList = props.tasks.filter((item) => (
                !props.hideChecked || !item.checked
            ));
            return filteredList.map((task) => {
                const currentUserId = (props.currentUser
                                       && props.currentUser._id);
                const showPrivateButton = (task.owner === Meteor.user()._id);
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
        Meteor.user()
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


const VisibilitySelector = (props) => (
    <label className="hide-completed">
        <input type="checkbox"
               readOnly
               checked={props.hideChecked}
               onChange={props.handleToggleVisibility} />
        Hide checked
    </label>
);


const CheckedItemsCounter = (props) => (
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
                           currentUser={this.props.currentUser} />
            </header>
            <TaskList tasks={this.props.tasks}
                      hideChecked={this.state.hideChecked}
                      currentUser={this.props.currentUser} />
            <CheckedItemsCounter counter={this.props.checkedCounter} />
        </div>
    );

    constructor(props) {
        super(props);
        this.state = {
            hideChecked: false,
        };
    }

    componentWillMount() {
        this.props.subscribe('tasks');
    }

    handleToggleVisibility() {
        // Must use a special form of setState(), taking a function as argument,
        // to compute the next state based on the previous state.
        // This is needed because of the asynchronous nature of setState().
        // https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous
        this.setState((prevState, props) => (
            {hideChecked: !prevState.hideChecked}
        ))
    }
}

const mapStateToProps = (state) => {
    return {
        tasks: state.tasks,
    };
};

export default connect(mapStateToProps)(SubscribedComponent(App));
