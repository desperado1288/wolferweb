import 'immutable';
import { TOGGLE_SIDEBAR } from '../actions/sidebar'

const initialState = {
  isToggled: true
};

function toggleSidebar(state){
  const isToggled = !state.isToggled;
  return Object.assign({}, state, { isToggled });
}

export default function sidebar(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return toggleSidebar(state);
    default:
      return state
  }
}