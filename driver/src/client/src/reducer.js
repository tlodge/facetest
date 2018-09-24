import { combineReducers } from 'redux';
//import { routerReducer as routing } from 'react-router-redux';

import configuration, { NAME as configurationName } from './features/configuration';


export default combineReducers({
    //routing,
    [configurationName]: configuration,
});
