import { forOwn, size, values } from 'lodash';
import { createSelector } from 'reselect'

const resolve = (f, resolvedSelectors) => {
  const selectors = [];
  f._dependencies.forEach((dependency, name) => {
    if (typeof name === "string") {
      if (resolvedSelectors.hasOwnProperty(name)) {
        f._dependencies.set(name, resolvedSelectors[name])
      } else {
        throw new Error(`Dependency ${name} not found!`);
      }
    }
  });

  f._dependencies.forEach((func) => selectors.push(func));
  selectors.push(f._selectorFunc);
  f._selector = f._options.customSelectorCreator ? f._options.customSelectorCreator(...selectors) : createSelector(...selectors);
  f.resolved = true;
  return f;
}

const resolveSelfFromSelector = (f, otherSelector) => {
  f._dependencies = otherSelector._dependencies;
  f._selector = otherSelector._selector;
  f.resolved = true;
  return f;
}

const factory = (f, overridingSelectors = {}) => {
  if (f.resolved) {
    const selectors = [];
    f._dependencies.forEach((selector, name) => {
      selectors.push(overridingSelectors.hasOwnProperty(name) ? overridingSelectors[name] : selector);
    });
    selectors.push(selectorFunc);
    return createSelector(...selectors);
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
const griddleCreateSelector = (...args) => {

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
  let options = undefined;
  let selectorFunc = undefined;
  let depArgs = undefined;

  switch(typeof args[args.length - 1]) {
    case 'function':
      selectorFunc = args[args.length - 1];
      depArgs = args.slice(0, args.length - 1);
      break;
    case 'object':
      options = args[args.length - 1];

      if (args.length >= 3) {
        if (typeof args[args.length - 2] === 'function') {
          selectorFunc = args[args.length - 2];
          depArgs = args.slice(0, args.length - 2);
        } else {
          throw new Error("When providing an options argument, the second last argument must be a function");
        };
      } else {
        throw new Error("Cannot create a selector with final options argument with fewer than 3 arguments, must have at least one dependency, the selector function, and the options object");
      };
      break;
    default:
      throw new Error("Last argument must be either a function or options argument");
  }

  // selectors need to be functions to preserve the selector
  // calling API, relevant data is stored as props on the
  // function. All functions have been moved outside
  // griddleCreateSelector as they were being duplicated
  // for every call. Underscores denote 'private' fields that 
  // shouldn't be used by the general public.
  const f = (...args) => {
    return f._selector(...args);
  };

  f._selectorFunc = selectorFunc;
  f._options = options || {};
  // using Map to preserve order of dependencies
  f.isGriddleCreateSelector = true;
  f._dependencies = new Map();
  f.dependencyNames = [];

  // Build dependencies data structure which is for now
  // unresolved.
  for (const index in depArgs) {
    const depArg = depArgs[index];
    switch(typeof depArg) {
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

  f._selector = (...args) => undefined;
  f.resolved = false;
  f.resolve = (resolvedSelectors) => resolve(f, resolvedSelectors);
  f.resolveSelfFromSelector = (otherSelector) => resolveSelfFromSelector(f, otherSelector);
  f.factory = (overridingSelectors) => factory(f, overridingSelectors);

  return f;
};
export { griddleCreateSelector as createSelector };

export const composeSelectors = (plugins) => {

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

  const combinedSelectors = (() => {

    // Each key in map corresponds to a class of selectors
    //
    const selectors = new Map();

    const wrap = (name) => ({
      name,
      getSelector: () => (selectors.get(name).selectors[0]),
      getDependencies: () => (selectors.get(name).selectors[0].dependencyNames || []),
      isGriddleCreateSelector: () => (!!selectors.get(name).selectors[0].isGriddleCreateSelector),
      rank: 0,
      traversed: false
    });
    const s = {
      addUnresolvedSelector: (name, selector) => {
        if (!selectors.has(name)) {
          console.log(`  First instance of selector ${name} encountered`);
          selectors.set(name, {
            wrapper: wrap(name),
            selectors: [selector]
          });
        } else {
          console.log(`  Overriding existing selector named ${name}`);
          selectors.get(name).selectors.unshift(selector);
        }
      },
      getSelectors: () => (selectors),
      getResolveableSelector: (name) => (selectors.get(name).wrapper),
      hasSelectorNamed: (name) => (selectors.has(name)),
      resolveSelectorClass: (name, resolvedSelectors) => {
        const selectorClass = selectors.get(name).selectors;
        const first = selectorClass[0];
        first.resolve(resolvedSelectors);
        selectorClass.slice(1, selectorClass.length).forEach((selector) => {
          selector.resolveSelfFromSelector(first);
        });
        return first;
      }
    }
    return s;
  })();


  plugins.forEach((plugin) => {
    console.log('Begin parsing selectors for plugin');
    forOwn(plugin.selectors, (selector, name) => {
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
  const ranks = [];

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
  const getDependencies = (node, parents) => {
    // if this node has already been traversed
    // no need to run the get dependencies logic as they
    // have already been computed
    // simply return its list of flattened dependencies
    if (!node.traversed) {

      // if the node has dependencies, add each one to the node's
      // list of flattened dependencies and recursively call
      // getDependencies on each of them
      if (node.getDependencies().length > 0) {

        const flattenedDependencies = new Set();
        for (let dependency of node.getDependencies()) {
          //if (typeof dependency === 'function') continue;
          if (!combinedSelectors.hasSelectorNamed(dependency)) {
            const err = `Selector ${node.name} has dependency ${dependency} but this is not in the list of dependencies! Did you misspell something?`;
            throw new Error(err);
          }

          // if any dependency in the recursion chain
          // matches one of the parents there is a cycle throw an exception
          // this is an unrecoverable runtime error
          if (parents.has(dependency)) {
            let err = "Dependency cycle detected! ";
            for (let e of parents) {
              e === dependency ? err += `[[${e}]] -> ` : err += `${e} -> `;
            }
            err += `[[${dependency}]]`;
            console.log(err);
            throw new Error(err);
          }
          flattenedDependencies.add(dependency);
          const childParents = new Set(parents);
          childParents.add(dependency);
          const childsDependencies = getDependencies(combinedSelectors.getResolveableSelector(dependency), childParents);
          childsDependencies.forEach((key) => flattenedDependencies.add(key))
          const childRank = combinedSelectors.getResolveableSelector(dependency).rank;
          childRank >= node.rank && (node.rank = childRank + 1);
        }
        node.flattenedDependencies = flattenedDependencies;
        node.traversed = true;

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
  for (let e of combinedSelectors.getSelectors()) {
    const [name, selectorClass] = e;
    getDependencies(selectorClass.wrapper, new Set([name]));
  }

  // STEP 5
  // ==========
  //
  // Create a flat object of just the actual selector functions
  // This will be used as the set of selectors on context
  const flattenedSelectors = {};
  //console.log({ allSelectors, combinedSelectors, ranks });
  console.log(ranks);
  for (let rank of ranks) {
    for (let selector of rank) {
      if (selector.isGriddleCreateSelector()) {
        flattenedSelectors[selector.name] = combinedSelectors.resolveSelectorClass(selector.name, flattenedSelectors);
      } else {
        flattenedSelectors[selector.name] = selector.getSelector();
      }
    }
  }

  return flattenedSelectors;
}
