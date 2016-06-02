'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lastStateInit = undefined;
exports.stateIterator = stateIterator;
exports.stateGetter = stateGetter;
exports.stateSetter = stateSetter;
exports.stateReconciler = stateReconciler;

var _immutable = require('immutable');

var lastStateInit = exports.lastStateInit = new Immutable.Map();

function stateIterator(state, callback) {
  return state.forEach(callback);
}

function stateGetter(state, key) {
  return state.get(key);
};

function stateSetter(state, key, value) {
  return state.set(key, value);
};

function stateReconciler(state, inboundState, reducedState, logger) {
  var newState = new _immutable.Map();

  Object.keys(inboundState).forEach(function (key) {
    // if initialState does not have key, skip auto rehydration
    if (!state.has(key)) return;

    // if reducer modifies substate, skip auto rehydration
    if (state.get('key') !== reducedState.get('key')) {
      if (logger) console.log('redux-persist/autoRehydrate: sub state for key `%s` modified, skipping autoRehydrate.', key);
      newState = newState.set(key, reducedState.get(key));
      return;
    }

    // otherwise take the inboundState
    if (state.has(key)) {
      newState = state.merge(inboundState); // shallow merge
    } else {
        newState = state.set(key, inboundState[key]); // hard set
      }

    if (logger) console.log('redux-persist/autoRehydrate: key `%s`, rehydrated to ', key, newState[key]);
  });

  return newState;
};