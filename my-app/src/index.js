import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './components/Login';
import Logout from './components/Logout';
import registerServiceWorker from './registerServiceWorker';
import './css/App.css';
import './css/login.css';
import { Router, Route } from 'react-router-dom';
import createHistory from "history/createBrowserHistory"

const history = createHistory({
    basename: "",
    forceRefresh: true
})
export { history }

ReactDOM.render(
    (<Router history={history}>
        <div>
            <Route exact path='/' component={Login} />
            <Route path="/timeline/:login?" component={App} />
            <Route path='/logout' component={Logout} />
        </div>
    </Router>),
    document.getElementById('root'));
registerServiceWorker();
