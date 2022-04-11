import React from 'react';
import ReactDOM from 'react-dom';
import {unregister} from './registerServiceWorker';
import App from './App';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#e20050",
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