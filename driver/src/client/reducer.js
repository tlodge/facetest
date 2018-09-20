import { combineReducers } from 'redux';
//import { routerReducer as routing } from 'react-router-redux';

import physical, { NAME as physicalName } from './features/physical';


export default combineReducers({
    //routing,
    [physicalName]: physical,
});
