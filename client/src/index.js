import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {unregister} from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#cd013c",
            contrastText: '#fff'
        },
        secondary: pink,
    },
});

ReactDOM.render(
    <div>
        <MuiThemeProvider theme={theme}>
            <App />
        </MuiThemeProvider>
    </div>,
    document.getElementById('root'));
    
unregister();