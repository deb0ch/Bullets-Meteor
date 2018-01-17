
import React, { Component } from 'react';
import ReactDOM             from 'react-dom';
import { Template }         from 'meteor/templating';
import { Blaze }            from 'meteor/blaze';

export default class AccountsUIWrapper extends Component {
    componentDidMount() {
        // Use Meteor Blaze to render login buttons
        this.view = Blaze.render(Template.loginButtons,
                                 ReactDOM.findDOMNode(this.refs.accounts_ui));
    }

    componentWillUnmount() {
        Blaze.remove(this.view);
    }

    render() {
        // render a placeholder container that will be filled in
        return <span ref="accounts_ui" />;
    }
}
