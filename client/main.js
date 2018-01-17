
import React        from 'react';
import { Provider } from 'react-redux';
import { Meteor }   from 'meteor/meteor';
import { render }   from 'react-dom';

import App            from '../imports/ui/App.js';
import { setupStore } from '../imports/startup/setupStore';
import '../imports/startup/accounts-config.js';


store = setupStore();

Meteor.startup(() => {
    render(<Provider store={store}>
               <App/>
           </Provider>,
           document.getElementById('render-target'));
});
