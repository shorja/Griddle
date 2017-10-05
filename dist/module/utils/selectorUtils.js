'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeSelectors = exports.griddleCreateSelector = undefined;

var _forOwn2 = require('lodash/forOwn');

var _forOwn3 = _interopRequireDefault(_forOwn2);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reselect = require('reselect');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Wrapped 'createSelector' that allows for building the selector
 * dependency tree. Takes any number of arguments, all arguments but the
 * last must be dependencies, which are the string names of selectors
 * this selector depends on and the last arg must be the selector function
 * itself. This structure mirrors very closely what calling 'createSelector'
 * looks like.
 *
 * const mySelector = createSelector(
 *   aSelector,
 *   anotherSelector,
 *   (a, b) => (someLogic....)
 * );
 *
 * const mySelector = griddleCreateSelector(
 *   "aSelector",
 *   "anotherSelector",
 *   (a, b) => (someLogic...)
 * );
 *
 * When the selectors are finally generated, the actual dependency selectors
 * are passed to the createSelector function.
 */
var griddleCreateSelector = exports.griddleCreateSelector = function griddleCreateSelector() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  // All selectors that use createSelector must have a minimum of one
  // dependency and the selector function itself
  if (args.length < 2) {
    throw new Error("Cannot create a selector with fewer than 2 arguments, must have at least one dependency and the selector function");
  }

  // The first n - 1 args are the dependencies, they must
  // all be strings.
  var dependencies = args.slice(0, args.length - 1);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = dependencies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var dependency = _step.value;

      if (typeof dependency !== "string") {
        throw new Error("Args 0..n-1 must be strings");
      }
    }

    // The last of n args is the selector function,
    // it must be a function
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var selector = args[args.length - 1];
  if (typeof selector !== "function") {
    throw new Error("Last argument must be a function");
  }

  return {
    // the creator function is called to generate the
    // selector function. It is passed the object containing all
    // of the static/generated selector functions to be potentially
    // used as dependencies
    creator: function creator(selectors) {

      // extract the dependency selectors using the list
      // of dependencies
      var createSelectorFuncs = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = dependencies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var dependency = _step2.value;

          createSelectorFuncs.push(selectors[dependency]);
        }

        // add this selector
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      createSelectorFuncs.push(selector);

      // call createSelector with the final list of args
      return _reselect.createSelector.apply(undefined, createSelectorFuncs);
    },

    // the list of dependencies is needed to build the dependency
    // tree
    dependencies: dependencies
  };
};

var composeSelectors = exports.composeSelectors = function composeSelectors(baseSelectors, composedSelectors, plugins) {

  // STEP 1
  // ==========
  //
  // Add all of the 'base' selectors to the list of combined selectors.
  // The actuall selector functions are wrapped in an object which is used
  // to keep track of all the data needed to properly build all the
  // selector dependency trees
  console.log("Parsing built-in selectors");
  var combinedSelectors = new Map();

  (0, _forOwn3.default)(baseSelectors, function (baseSelector, name) {
    var selector = {
      name: name,
      selector: baseSelector,
      dependencies: [],
      rank: 0,
      traversed: false
    };
    combinedSelectors.set(name, selector);
  });

  // STEP 2
  // ==========
  //
  // Add all of the 'composed' selectors to the list of combined selectors.
  // Composed selectors use the 'createSelector' function provided by reselect
  // and depend on other selectors. These new selectors are located in a 
  // new file named 'composedSelectors' and are now an object that looks like this:
  //   {
  //     creator: ({dependency1, dependency2, ...}) => return createSelector(dependency1, dependency2, (...) => (...)),
  //     dependencies: ["dependency1", "dependency2"]
  //   }
  // 'creator' will return the selector when it is run with the dependency selectors
  // 'dependencies' are the string names of the dependency selectors, these will be used to
  // build the tree of selectors
  (0, _forOwn3.default)(composedSelectors, function (composedSelector, name) {
    var selector = _extends({
      name: name
    }, composedSelector, {
      rank: 0,
      traversed: false
    });
    combinedSelectors.has(name) && console.log('  Overriding existing selector named ' + name);
    combinedSelectors.set(name, selector);
  });

  // STEP 3
  // ==========
  //
  // Once the built-in 'base' and 'composed' selectors are added to the list,
  // repeat the same process for each of the plugins.
  //
  // Plugins can now redefine a single existing selector without having to
  // include the full list of dependency selectors since the dependencies
  // are now created dynamically
  for (var i in plugins) {
    console.log('Parsing selectors for plugin ' + i);
    var plugin = plugins[i];
    (0, _forOwn3.default)(plugin.selectors, function (baseSelector, name) {
      var selector = {
        name: name,
        selector: baseSelector,
        dependencies: [],
        rank: 0,
        traversed: false
      };

      // console log for demonstration purposes
      combinedSelectors.has(name) && console.log('  Overriding existing selector named ' + name + ' with base selector');
      combinedSelectors.set(name, selector);
    });

    (0, _forOwn3.default)(plugin.composedSelectors, function (composedSelector, name) {
      var selector = _extends({
        name: name
      }, composedSelector, {
        rank: 0,
        traversed: false
      });

      // console log for demonstration purposes
      combinedSelectors.has(name) && console.log('  Overriding existing selector named ' + name + ' with composed selector');
      combinedSelectors.set(name, selector);
    });
  }

  // RANKS
  // ==========
  //
  // The ranks array is populated when running getDependencies
  // It stores the selectors based on their 'rank'
  // Rank can be defined recursively as:
  // - if a selector has no dependencies, rank is 0
  // - if a selector has 1 or more dependencies, rank is max(all dependency ranks) + 1
  var ranks = [];

  // GET DEPENDENCIES
  // ==========
  //
  // getDependencies recursively descends through the dependencies
  // of a given selector doing several things:
  // - creates a 'flat' list of dependencies for a given selector,
  // which is a list of all of its dependencies
  // - calculates the rank of each selector and fills out the above ranks list
  // - determines if there are any cycles present in the dependency tree
  //
  // It also memoizes the results in the combinedSelectors Map by setting the
  // 'traversed' flag for a given selector. If a selector has been flagged as
  // 'traversed', it simply returns the previously calculated dependencies
  var getDependencies = function getDependencies(node, parents) {
    // if this node has already been traversed
    // no need to run the get dependencies logic as they
    // have already been computed
    // simply return its list of flattened dependencies
    if (!node.traversed) {

      // if the node has dependencies, add each one to the node's
      // list of flattened dependencies and recursively call
      // getDependencies on each of them
      if (node.dependencies.length > 0) {
        (function () {

          var flattenedDependencies = new Set();
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = node.dependencies[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var dependency = _step3.value;

              if (!combinedSelectors.has(dependency)) {
                var err = 'Selector ' + node.name + ' has dependency ' + dependency + ' but this is not in the list of dependencies! Did you misspell something?';
                throw new Error(err);
              }

              // if any dependency in the recursion chain
              // matches one of the parents there is a cycle throw an exception
              // this is an unrecoverable runtime error
              if (parents.has(dependency)) {
                var _err = "Dependency cycle detected! ";
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                  for (var _iterator4 = parents[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var e = _step4.value;

                    e === dependency ? _err += '[[' + e + ']] -> ' : _err += e + ' -> ';
                  }
                } catch (err) {
                  _didIteratorError4 = true;
                  _iteratorError4 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                      _iterator4.return();
                    }
                  } finally {
                    if (_didIteratorError4) {
                      throw _iteratorError4;
                    }
                  }
                }

                _err += '[[' + dependency + ']]';
                console.log(_err);
                throw new Error(_err);
              }
              flattenedDependencies.add(dependency);
              var childParents = new Set(parents);
              childParents.add(dependency);
              var childsDependencies = getDependencies(combinedSelectors.get(dependency), childParents);
              childsDependencies.forEach(function (key) {
                return flattenedDependencies.add(key);
              });
              var childRank = combinedSelectors.get(dependency).rank;
              childRank >= node.rank && (node.rank = childRank + 1);
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          node.flattenedDependencies = flattenedDependencies;
          node.traversed = true;
        })();
      } else {

        // otherwise, this is a leaf node
        // - set the node's rank to 0
        // - set the nodes flattenedDependencies to an empty set
        node.flattenedDependencies = new Set();
        node.traversed = true;
      }
      ranks[node.rank] || (ranks[node.rank] = new Array());
      ranks[node.rank].push(node);
    }
    return node.flattenedDependencies;
  };

  // STEP 4
  // ==========
  //
  // Run getDependencies on each selector in the 'combinedSelectors' list
  // This fills out the 'ranks' list for use in the next step
  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = combinedSelectors[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var e = _step5.value;

      var _e = _slicedToArray(e, 2),
          name = _e[0],
          selector = _e[1];

      getDependencies(selector, new Set([name]));
    }

    // STEP 5
    // ==========
    //
    // Create a flat object of just the actual selector functions
  } catch (err) {
    _didIteratorError5 = true;
    _iteratorError5 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion5 && _iterator5.return) {
        _iterator5.return();
      }
    } finally {
      if (_didIteratorError5) {
        throw _iteratorError5;
      }
    }
  }

  var flattenedSelectors = {};
  var _iteratorNormalCompletion6 = true;
  var _didIteratorError6 = false;
  var _iteratorError6 = undefined;

  try {
    for (var _iterator6 = ranks[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
      var rank = _step6.value;
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = rank[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var selector = _step7.value;

          if (selector.creator) {
            var childSelectors = {};
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
              for (var _iterator8 = selector.dependencies[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                var childSelector = _step8.value;

                childSelectors[childSelector] = combinedSelectors.get(childSelector).selector;
              }
            } catch (err) {
              _didIteratorError8 = true;
              _iteratorError8 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion8 && _iterator8.return) {
                  _iterator8.return();
                }
              } finally {
                if (_didIteratorError8) {
                  throw _iteratorError8;
                }
              }
            }

            selector.selector = selector.creator(childSelectors);
          }
          flattenedSelectors[selector.name] = selector.selector;
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError6 = true;
    _iteratorError6 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion6 && _iterator6.return) {
        _iterator6.return();
      }
    } finally {
      if (_didIteratorError6) {
        throw _iteratorError6;
      }
    }
  }

  return flattenedSelectors;
};