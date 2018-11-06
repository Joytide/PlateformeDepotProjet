import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router
} from 'react-router-dom'
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './App';


ReactDOM.render(
    <div>
        <MuiThemeProvider>
            <App />
        </MuiThemeProvider>
    </div>,
    document.getElementById('root'));
registerServiceWorker();
