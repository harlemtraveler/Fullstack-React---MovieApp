import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();

const MOUNT = document.getElementById('root') // or document.querySelector(‘#root’)
const renderApp = Comp => ReactDOM.render(Comp, MOUNT) // takes the ReactDOM.render function and pass MOUNT

if (module.hot) {	// check to see if the Hot Loader is enabled by checking if the “module.hot" object is defined
    module.hot.accept('./App', ( ) => {	// we accept any changes using the “.accept” module. Her it’s any changes from the “App” file…”src/App.js"
	   // accept hot change…when any change occurs…manually doing something
       const NextApp = require('./App').default	// re-require the “App.js” file and render a new instance in the component
       renderApp(<NextApp />)
    })
} // when any changes occur in our application files, we want to reload the application using the “renderApp" function

renderApp(<App />) // calls the render app function directly, tells Hot Loader what to do happen when to certain conditions are met
