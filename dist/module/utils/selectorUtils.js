'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeSelectors = exports.createSelector = undefined;

var _forOwn2 = require('lodash/forOwn');

var _forOwn3 = _interopRequireDefault(_forOwn2);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _reselect = require('reselect');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var resolve = function resolve(f, resolvedSelectors) {
  var selectors = [];
  f._dependencies.forEach(function (dependency, name) {
    if (typeof name === "string") {
      if (resolvedSelectors.hasOwnProperty(name)) {
        f._dependencies.set(name, resolvedSelectors[name]);
      } else {
        throw new Error('Dependency ' + name + ' not found!');
      }
    }
  });

  f._dependencies.forEach(function (func) {
    return selectors.push(func);
  });
  selectors.push(f._selectorFunc);
  f._selector = _reselect.createSelector.apply(undefined, selectors);
  f.resolved = true;
  return f;
};

var resolveSelfFromSelector = function resolveSelfFromSelector(f, otherSelector) {
  f._dependencies = otherSelector._dependencies;
  f._selector = otherSelector._selector;
  f.resolved = true;
  return f;
};

var factory = function factory(f) {
  var overridingSelectors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (f.resolved) {
    var _ret = function () {
      var selectors = [];
      f._dependencies.forEach(function (selector, name) {
        selectors.push(overridingSelectors.hasOwnProperty(name) ? overridingSelectors[name] : selector);
      });
      selectors.push(selectorFunc);
      return {
        v: _reselect.createSelector.apply(undefined, selectors)
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } else {
    return undefined;
  }
};
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
var griddleCreateSelector = function griddleCreateSelector() {
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
  //const dependencies = args.slice(0, args.length - 1);


  // The first n - 1 args are selector functions AND/OR
  // selector dependencies.
  //
  // If all arguments are selector functions, this would be
  // considered a 'legacy' style hard-coded createSelector
  // invocation. We can immediately delegate to createSelector
  // and return the selector function.
  //
  // If all of the arguments are selector dependencies --
  // which are strings naming the to-be-resolved selector functions --
  // then we need to return a selector generator function. This will
  // later be provided with a list of fully resolved selector
  // functions that can then be used to generate this selector
  // using createSelector.
  //
  // If there is a MIXTURE of both selector functions and
  // selector dependency strings, then we still need a
  // selector generator but only a portion of the functions
  // need to be resolved for later. We save the provided selector
  // functions and will merge them with the resolved selectors
  // when the generator function is called. This could be used
  // to force a particular dependency from being overridden.
  // This should be considered an advanced feature, you should
  // only prevent dependent selector overriding if there is a
  // very good reason for it.
  //
  // As this griddleCreateSelector function can return either the
  // output of reselect's 'createSelector', or a selector generator
  // function, the distinguishing feature will be that the selector
  // generator will have as a prop the .dependencies field which
  // is a list of the string names of the dependencies for this
  // generator. If this is a mixed type generator, the length of
  // the dependencies will be smaller than args.length - 1 based
  // on how many selector function args were provided.
  //
  // TODO make sure to check for duplicate dependencies
  var depArgs = args.slice(0, args.length - 1);

  // selectors need to be functions to preserve the selector
  // calling API, relevant data is stored as props on the
  // function. All functions have been moved outside
  // griddleCreateSelector as they were being duplicated
  // for every call. Underscores denote 'private' fields that 
  // shouldn't be used by the general public.
  var f = function f() {
    return f._selector.apply(f, arguments);
  };

  // using Map to preserve order of dependencies
  f.isGriddleCreateSelector = true;
  f._dependencies = new Map();
  f.dependencyNames = [];

  // Build dependencies data structure which is for now
  // unresolved.
  for (var index in depArgs) {
    var depArg = depArgs[index];
    switch (typeof depArg === 'undefined' ? 'undefined' : _typeof(depArg)) {
      case "function":
        f._dependencies.set(Number.parseInt(index), depArg);
        break;
      case "string":
        f._dependencies.set(depArg, null);
        f.dependencyNames.push(depArg);
        break;
      default:
        throw new Error("The first n - 1 arguments of griddleCreateSelector must be either strings or functions");
    }
  }

  // The last of n args is the selector function,
  // it must be a function
  f._selectorFunc = args[args.length - 1];
  if (typeof f._selectorFunc !== "function") {
    throw new Error("Last argument must be a function");
  }

  f._selector = function () {
    return undefined;
  };
  f.resolved = false;
  f.resolve = function (resolvedSelectors) {
    return resolve(f, resolvedSelectors);
  };
  f.resolveSelfFromSelector = function (otherSelector) {
    return resolveSelfFromSelector(f, otherSelector);
  };
  f.factory = function (overridingSelectors) {
    return factory(f, overridingSelectors);
  };

  return f;
};
exports.createSelector = griddleCreateSelector;
var composeSelectors = exports.composeSelectors = function composeSelectors(plugins) {

  // STEP 1
  // ==========
  //
  // Add all selectors to the list of combined selectors.
  // 
  // Each key in combinedSelectors corresponds to
  // an array of selectors that were encountered for that given name.
  // A newer selector that is encountered for a given name is unshifted
  // onto index 0 of the array such at all index 0's of each array
  // are the most 'recently' encountered selector for that name. This allows
  // use to keep track of all the places these selectors were declared so
  // that when finally building the selectors we can go back to these
  // references and set them correctly. This specifically allows for the
  // overriding functionality to work properly with 'hard' import references
  // to selectors.
  //
  // Each encountered selector function is wrapped in an object which is used
  // to keep track of all the data needed to properly build all the
  // selector dependency trees
  //const combinedSelectors = new Map();

  var combinedSelectors = function () {

    // Each key in map corresponds to a class of selectors
    //
    var selectors = new Map();

    var wrap = function wrap(name) {
      return {
        name: name,
        getSelector: function getSelector() {
          return selectors.get(name).selectors[0];
        },
        getDependencies: function getDependencies() {
          return selectors.get(name).selectors[0].dependencyNames || [];
        },
        isGriddleCreateSelector: function isGriddleCreateSelector() {
          return !!selectors.get(name).selectors[0].isGriddleCreateSelector;
        },
        rank: 0,
        traversed: false
      };
    };
    var s = {
      addUnresolvedSelector: function addUnresolvedSelector(name, selector) {
        if (!selectors.has(name)) {
          console.log('  First instance of selector ' + name + ' encountered');
          selectors.set(name, {
            wrapper: wrap(name),
            selectors: [selector]
          });
        } else {
          console.log('  Overriding existing selector named ' + name);
          selectors.get(name).selectors.unshift(selector);
        }
      },
      getSelectors: function getSelectors() {
        return selectors;
      },
      getResolveableSelector: function getResolveableSelector(name) {
        return selectors.get(name).wrapper;
      },
      hasSelectorNamed: function hasSelectorNamed(name) {
        return selectors.has(name);
      },
      resolveSelectorClass: function resolveSelectorClass(name, resolvedSelectors) {
        var selectorClass = selectors.get(name).selectors;
        var first = selectorClass[0];
        first.resolve(resolvedSelectors);
        selectorClass.slice(1, selectorClass.length).forEach(function (selector) {
          selector.resolveSelfFromSelector(first);
        });
        return first;
      }
    };
    return s;
  }();

  plugins.forEach(function (plugin) {
    console.log('Begin parsing selectors for plugin');
    (0, _forOwn3.default)(plugin.selectors, function (selector, name) {
      combinedSelectors.addUnresolvedSelector(name, selector);
    });
  });

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
      if (node.getDependencies().length > 0) {
        (function () {

          var flattenedDependencies = new Set();
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = node.getDependencies()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var dependency = _step.value;

              //if (typeof dependency === 'function') continue;
              if (!combinedSelectors.hasSelectorNamed(dependency)) {
                var err = 'Selector ' + node.name + ' has dependency ' + dependency + ' but this is not in the list of dependencies! Did you misspell something?';
                throw new Error(err);
              }

              // if any dependency in the recursion chain
              // matches one of the parents there is a cycle throw an exception
              // this is an unrecoverable runtime error
              if (parents.has(dependency)) {
                var _err = "Dependency cycle detected! ";
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                  for (var _iterator2 = parents[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var e = _step2.value;

                    e === dependency ? _err += '[[' + e + ']] -> ' : _err += e + ' -> ';
                  }
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

                _err += '[[' + dependency + ']]';
                console.log(_err);
                throw new Error(_err);
              }
              flattenedDependencies.add(dependency);
              var childParents = new Set(parents);
              childParents.add(dependency);
              var childsDependencies = getDependencies(combinedSelectors.getResolveableSelector(dependency), childParents);
              childsDependencies.forEach(function (key) {
                return flattenedDependencies.add(key);
              });
              var childRank = combinedSelectors.getResolveableSelector(dependency).rank;
              childRank >= node.rank && (node.rank = childRank + 1);
            }
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
  // Run getDependencies on each first selector in the 'combinedSelectors' list
  // This fills out the 'ranks' list for use in the next step
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = combinedSelectors.getSelectors()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var e = _step3.value;

      var _e = _slicedToArray(e, 2),
          name = _e[0],
          selectorClass = _e[1];

      getDependencies(selectorClass.wrapper, new Set([name]));
    }

    // STEP 5
    // ==========
    //
    // Create a flat object of just the actual selector functions
    // This will be used as the set of selectors on context
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

  var flattenedSelectors = {};
  //console.log({ allSelectors, combinedSelectors, ranks });
  console.log(ranks);
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = ranks[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var rank = _step4.value;
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = rank[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var selector = _step5.value;

          if (selector.isGriddleCreateSelector()) {
            flattenedSelectors[selector.name] = combinedSelectors.resolveSelectorClass(selector.name, flattenedSelectors);
          } else {
            flattenedSelectors[selector.name] = selector.getSelector();
          }
        }
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

  return flattenedSelectors;
};