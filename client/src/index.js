import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';
import lightBlue from '@material-ui/core/colors/lightBlue';

const theme = createMuiTheme({
    palette: {
        primary: pink,
        secondary: lightBlue,
    },
});

ReactDOM.render(
    <div>
        <MuiThemeProvider theme={theme}>
            <App />
        </MuiThemeProvider>
    </div>,
    document.getElementById('root'));
registerServiceWorker();