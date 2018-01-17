
import { Meteor }           from 'meteor/meteor';
import React, { Component } from 'react';

export const SubscribedComponent =
    (SubscribingComponent) => class extends Component {
        render = () => (
            <SubscribingComponent
                {...this.props}
                subscribe={this.subscribe.bind(this)}
                subscriptionReady={this.subscriptionReady.bind(this)}
            />
        );

        constructor() {
            super();
            this.subs = {};
        }

        subscribe(name, ...args) {
            if (this.subs[name])
                this.subs[name].stop();
            this.subs[name] = Meteor.subscribe(name, ...args);
        }

        subscriptionReady(name) {
            if (this.subs[name])
                return this.subs[name].ready();
            return false;
        }

        componentWillUnmount() {
            Object.keys(this.subs).map(key => this.subs[key].stop());
        }
};
