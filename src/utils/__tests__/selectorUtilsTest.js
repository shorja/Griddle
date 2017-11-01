import test from 'ava';
import { memoize } from 'lodash';
import { createSelectorCreator } from 'reselect';

import {
  createSelector,
  composeSelectors
} from '../selectorUtils';

test('createSelector with only 1 argument should throw an Error', (t) => {
  const error = t.throws(() => {
    createSelector(
      (state) => state
    );
  }, Error);
});

test('createSelector with final results function arg not of function or object type', (t) => {
  const error = t.throws(() => {
    createSelector(
      "someDependency",
      "badResultFunctionStringArg"
    );
  }, Error);
});

test('createSelector with a non string or function argument for one of the first n - 1 args', (assert) => {
  const error = assert.throws(() => {
    createSelector(
      42,
      (x) => null
    );
  }, Error);
});

test('createSelector with an object for the last argument but fewer than 3 arguments', (t) => {
  const error = t.throws(() => {
    createSelector(
      () => 42,
      {}
    )
  }, Error);
});

test('createSelector with a non object argument for the last argument when the first n-2 args are either strings or funcs and arg n - 1 is a function', (t) => {
  const error = t.throws(() => {
    createSelector(
      () => 42,
      (x) => x,
      'doof'
    );
  }, Error);
});

test('createSelector with arg n being the options arg, arg n - 1 being the selector function but any of args 0 -> n - 2 being neither a function or string', (t) => {
  const error = t.throws(() => {
    createSelector(
      {},
      () => 42,
      (x) => x,
      {}
    );
  }, Error);
});


test('createSelector, 1 selector function arg, create only', (assert) => {
  const selector = createSelector(
    () => 20,
    (a) => a
  );

  assert.is(typeof selector, "function");

  assert.is(selector.resolved, false);
  assert.is(typeof selector.resolve, "function");
  assert.is(typeof selector.resolveSelfFromSelector, "function");
  assert.is(typeof selector.factory, "function");

  assert.is(typeof selector.dependencyNames, "object");
  assert.is(selector.dependencyNames.length, 0);

  // 'private' API
  assert.is(typeof selector._dependencies, "object");
  assert.is(typeof selector._selector, "function");
  assert.is(typeof selector._options, 'object');
  assert.is(Object.getOwnPropertyNames(selector._options).length, 0);

  // unresolved selector should return undefined when called
  assert.is(selector(), undefined);
});

test('createSelector, 1 selector func arg, create, resolve, then call', (t) => {
  const selector = createSelector(
    () => 20,
    (a) => a
  );
  
  selector.resolve({});

  t.is(typeof selector, "function");
  t.is(selector.resolved, true);
  t.is(selector(), 20);
});

test('createSelector, 1 selector dependency, create only', (assert) => {
  const selector = createSelector(
    "someDependency",
    (a) => null
  );

  // an unresolved selector
  // sanity check the API to ensure it exists
  assert.is(typeof selector, "function");

  assert.is(selector.resolved, false);
  assert.is(typeof selector.resolve, "function");
  assert.is(typeof selector.resolveSelfFromSelector, "function");
  assert.is(typeof selector.factory, "function");

  assert.is(typeof selector.dependencyNames, "object");
  assert.is(selector.dependencyNames.length, 1);
  assert.is(selector.dependencyNames[0], "someDependency");

  // 'private' API
  assert.is(typeof selector._dependencies, "object");
  assert.is(typeof selector._selector, "function");
  assert.is(typeof selector._options, 'object');
  assert.is(Object.getOwnPropertyNames(selector._options).length, 0);

  // unresolved selector should return undefined
  assert.is(selector(), undefined);
});

test('createSelector, 1 selector dependency, create, resolve, call', (t) => {
  const simpleDependencyA = () => 10;
  const resolvedDependencies = {
    simpleDependencyA
  }
  const selector = createSelector(
    "simpleDependencyA",
    (a) => a * 2
  )
  selector.resolve(resolvedDependencies);

  t.is(typeof selector, "function");
  t.is(selector.resolved, true);
  t.is(selector(), 20);
});

test('createSelector, 1 function dependency, 1 selector dependency, create only', (t) => {
  const selector = createSelector(
    () => 20,
    "someDependency",
    (a, b) => a + b
  );

  t.is(typeof selector, "function");

  t.is(selector.resolved, false);
  t.is(typeof selector.resolve, "function");
  t.is(typeof selector.resolveSelfFromSelector, "function");
  t.is(typeof selector.factory, "function");

  t.is(typeof selector.dependencyNames, "object");
  t.is(selector.dependencyNames.length, 1);
  t.is(selector.dependencyNames[0], "someDependency");

  t.is(typeof selector._dependencies, "object");
  t.is(typeof selector._selector, "function");
  t.is(typeof selector._options, 'object');
  t.is(Object.getOwnPropertyNames(selector._options).length, 0);

  t.is(selector(), undefined);
});

test('createSelector, 1 function dependency, 1 selector dependency, create, resolve, call', (t) => {
  const simpleDependencyA = () => 20;
  const resolvedDependencies = {
    simpleDependencyA
  };
  const selector = createSelector(
    () => 2,
    'simpleDependencyA',
    (a, b) => a * b
  );

  selector.resolve(resolvedDependencies);

  t.is(typeof selector, "function");
  t.is(selector.resolved, true);
  t.is(selector(), 40);
});

test('createSelector, 1 string dep, with options, create only', (t) => {


  const customSelectorCreator = createSelectorCreator(
    memoize,
    // from reselect README
    // https://github.com/reactjs/reselect#use-memoize-function-from-lodash-for-an-unbounded-cache
    // also see lodash memoize documentation
    // https://lodash.com/docs/4.17.4#memoize
    //
    // this function creates a unique key for a given set of inputs which memoize uses
    // to store the results for that set of inputs
    (...args) => args.reduce((acc, val) => 
      (acc + '-' + JSON.stringify(val)), '')
  );
  let totalRuns = 0;
  const state = {a: 10, b: 20}
  const resolvedDependencies= {
    getState: (state) => (state),
    mapKeyFromProps: (s, props) => (props.key)
  }
  const selector = createSelector(
    'getState',
    'mapKeyFromProps',
    (state, key) => {
      totalRuns++;
      return state[key];
    },
    {customSelectorCreator}
  );

  selector.resolve(resolvedDependencies);

  t.is(selector(state, {key: 'a'}), 10);
  t.is(totalRuns, 1);
  // memoized result, run with the same args should
  // return the same results
  t.is(selector(state, {key: 'a'}), 10);
  t.is(totalRuns, 1);

  t.is(selector(state, {key: 'b'}), 20);
  t.is(totalRuns, 2);

  t.is(selector(state, {key: 'b'}), 20);
  t.is(totalRuns, 2);

  t.is(selector(state, {key: 'a'}), 10);
  t.is(totalRuns, 2);

  t.is(selector(state, {key: 'b'}), 20);
  t.is(totalRuns, 2);

});

test('createSelector, 1 selector dependency, create, resolve with invalid dependencies', (t) => {
    const error = t.throws(() => {
      const selector = createSelector(
        "someDependency",
        (x) => x
      );
      selector.resolve({});
    }, Error);
  });

test('composeSelectors with 1 simple selector', (assert) => {
  const plugin0 = {
    selectors: {
      simpleSelectorA: (state) => state,
    }
  };

  const flattenedSelectors = composeSelectors([plugin0]);

  assert.is(typeof flattenedSelectors, "object");
  assert.is(Object.keys(flattenedSelectors).length, 1);
  assert.true(flattenedSelectors.hasOwnProperty("simpleSelectorA"));
});

test('composeSelectors with 2 simple selectors and 1 dependency selector dependent on the 2 simple selectors', (assert) => {
  const plugin0 = {
    selectors: {
      simpleSelectorA: () => 10,
      simpleSelectorB: () => 2,
      dependencySelector1: createSelector(
        'simpleSelectorA',
        'simpleSelectorB',
        (x, y) => x * y
      )
    }
  }

  const flattenedSelectors = composeSelectors([plugin0]);

  assert.is(typeof flattenedSelectors, "object");
  assert.is(Object.keys(flattenedSelectors).length, 3);
  assert.true(flattenedSelectors.hasOwnProperty("simpleSelectorA"));
  assert.true(flattenedSelectors.hasOwnProperty("simpleSelectorB"));
  assert.true(flattenedSelectors.hasOwnProperty("dependencySelector1"));
  assert.is(flattenedSelectors.dependencySelector1(), 20);
  // this is a crucial test, the composeSelectors function must also trigger
  // the first run of createSelector's returned selector generator which
  // changes its behaviour. From now on this function will act like 
  // a selector created by reselect's createSelector
  assert.is(plugin0.selectors.simpleSelectorA(), 10);
  assert.is(plugin0.selectors.simpleSelectorB(), 2);
  assert.is(plugin0.selectors.dependencySelector1(), 20);
});

test('name me', (assert) => {
  const plugin0 = {
    selectors: {
      simpleSelectorA: () => 10,
      simpleSelectorB: () => 2,
      dependencySelector1: createSelector(
        'simpleSelectorA',
        'simpleSelectorB',
        (x, y) => x * y
      )
    }
  }

  const plugin1 = {
    selectors: {
      dependencySelector1: createSelector(
        'simpleSelectorA',
        'simpleSelectorB',
        (x, y) => x + y
      )
    }
  }

  const flattenedSelectors = composeSelectors([plugin0, plugin1]);

  assert.is(typeof flattenedSelectors, "object");
  assert.is(Object.keys(flattenedSelectors).length, 3);
  assert.true(flattenedSelectors.hasOwnProperty("simpleSelectorA"));
  assert.true(flattenedSelectors.hasOwnProperty("simpleSelectorB"));
  assert.true(flattenedSelectors.hasOwnProperty("dependencySelector1"));


  assert.is(flattenedSelectors.simpleSelectorA(), 10);
  assert.is(flattenedSelectors.simpleSelectorB(), 2);
  assert.is(flattenedSelectors.dependencySelector1(), 12);

  // this is a crucial test, the composeSelectors function must also trigger
  // the first run of createSelector's returned selector generator which
  // changes its behaviour. From now on this function will act like 
  // a selector created by reselect's createSelector
  assert.is(plugin0.selectors.simpleSelectorA(), 10);
  assert.is(plugin0.selectors.simpleSelectorB(), 2);
  assert.is(plugin0.selectors.dependencySelector1(), 12);

  assert.is(plugin1.selectors.dependencySelector1(), 12);
});

test('name me', (assert) => {
  const plugin0 = (() => {
    const simpleSelectorA = () => 10;
    const simpleSelectorB = () => 2;
    return {
      selectors: {
        simpleSelectorA,
        simpleSelectorB,
        dependencySelector1: createSelector(
          simpleSelectorA,
          simpleSelectorB,
          (x, y) => x * y
        )
      }
    }
  }
  )();

  const plugin1 = {
    selectors: {
      dependencySelector1: createSelector(
        'simpleSelectorA',
        'simpleSelectorB',
        (x, y) => x + y
      )
    }
  }

  const flattenedSelectors = composeSelectors([plugin0, plugin1]);

  assert.is(typeof flattenedSelectors, "object");
  assert.is(Object.keys(flattenedSelectors).length, 3);
  assert.true(flattenedSelectors.hasOwnProperty("simpleSelectorA"));
  assert.true(flattenedSelectors.hasOwnProperty("simpleSelectorB"));
  assert.true(flattenedSelectors.hasOwnProperty("dependencySelector1"));


  assert.is(flattenedSelectors.simpleSelectorA(), 10);
  assert.is(flattenedSelectors.simpleSelectorB(), 2);
  assert.is(flattenedSelectors.dependencySelector1(), 12);

  // this is a crucial test, the composeSelectors function must also trigger
  // the first run of createSelector's returned selector generator which
  // changes its behaviour. From now on this function will act like 
  // a selector created by reselect's createSelector
  assert.is(plugin0.selectors.simpleSelectorA(), 10);
  assert.is(plugin0.selectors.simpleSelectorB(), 2);
  assert.is(plugin0.selectors.dependencySelector1(), 12);
  assert.is(plugin1.selectors.dependencySelector1(), 12);
});

test('composeSelectors called with mixed selector function and selector dependency createSelector selectors', (assert) => {
  const plugin0 = (() => {
    const simpleSelectorA = () => 10;
    const simpleSelectorB = () => 2;
    return {
      selectors: {
        simpleSelectorA,
        simpleSelectorB,
        dependencySelector1: createSelector(
          'simpleSelectorA',
          'simpleSelectorB',
          (x, y) => x * y
        ),
        dependencySelector2: createSelector(
          simpleSelectorA,
          'simpleSelectorB',
          (x, y) => x * y
        )
      }
    }
  }
  )();

  const plugin1 = {
    selectors: {
      simpleSelectorA: () => 40,
      simpleSelectorB: () => 1
    }
  }

  const flattenedSelectors = composeSelectors([plugin0, plugin1]);

  assert.is(typeof flattenedSelectors, "object");
  assert.is(Object.keys(flattenedSelectors).length, 4);
  assert.true(flattenedSelectors.hasOwnProperty("simpleSelectorA"));
  assert.true(flattenedSelectors.hasOwnProperty("simpleSelectorB"));
  assert.true(flattenedSelectors.hasOwnProperty("dependencySelector1"));
  assert.true(flattenedSelectors.hasOwnProperty("dependencySelector2"));

  /* In the scenario, dependencySelector2 is using hybrid selection function
   * and selector dependency arguments. This means that the selector dependency
   * argument 'simpleSelectorB' is open to be overridden, it will use whatever
   * is the latest version of simpleSelectorB, in this case the one from plugin1.
   * However, the selector function argument simpleSelectorA will NEVER be overridden
   * for this selector and will thus use the simpleSelectorA function as statically
   * defined in plugin0. Selector function arguments will always point to the function
   * they were originally referencing. PLEASE NOTE that if the static function
   * the argument references is ITSELF LATER OVERRIDDEN it will of course use the new
   * overridden version.
   */


  assert.is(flattenedSelectors.simpleSelectorA(), 40);
  assert.is(flattenedSelectors.simpleSelectorB(), 1);
  assert.is(flattenedSelectors.dependencySelector1(), 40);
  assert.is(flattenedSelectors.dependencySelector2(), 10);

  // this is a crucial test, the composeSelectors function must also trigger
  // the first run of createSelector's returned selector generator which
  // changes its behaviour. From now on this function will act like 
  // a selector created by reselect's createSelector
  assert.is(plugin0.selectors.simpleSelectorA(), 10);
  assert.is(plugin0.selectors.simpleSelectorB(), 2);
  // this selector was declared using selector function arguments
  // instead of selector dependency arguments, this means it
  // will NOT be overridden and it should keep its original
  // behaviour. Note that only the function in the PLUGIN
  // maintains this behaviour, the function returned in
  // flattenedSelectors uses the overridden dependencySelector1
  // from plugin1 as it was the most recently declared selector
  assert.is(plugin0.selectors.dependencySelector1(), 40);
  assert.is(plugin0.selectors.dependencySelector2(), 10);

  assert.is(plugin1.selectors.simpleSelectorA(), 40);
  assert.is(plugin1.selectors.simpleSelectorB(), 1);
});
