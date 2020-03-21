/* Copyright (c) 2019 Query Kuma, MIT license */

/**
 * [Syntax]
 * var new_array = await arr.mapSync(async function callback(currentValue[, index[, array]]) {
 *     // Return element for new_array
 * }[, batchSize]);
 *
 * [Parameters]
 * callback : async function that produces an element of the new Array
 * batchSize : optional size of the array batch
 *
 * if batchSize == 1(default), each element goes in sequential.
 * if batchSize <= 0, each element goes in parallel.
 * if batchSize >= 2, each element goes in parallel by the array batchSize. But each batch goes in sequential. It is the middle of parallel and sequential.
 *
 * @param {async function} callback
 * @param {number} [batchSize=1]
 * @returns {array}
 */

// eslint-disable-next-line no-extend-native
Object.defineProperty(Array.prototype, "mapSync", {
  "writable": true,
  "enumerable": false,
  "configurable": true,
  "value": async function (callback, batchSize = 1) { // eslint-disable-line no-extend-native
    var batch_ary = [];
    const result_ary = [];
    var index = 0;
    var index_total = 0;

    if (batchSize <= 0) {
      batchSize = this.length;
    }

    for (const value of this) {
      batch_ary.push(value);
      index++;

      /* fire callbacks if index >= batchSize  */
      if (index >= batchSize) {
        // eslint-disable-next-line require-await,no-unused-vars,no-loop-func
        const promises = batch_ary.map(async (currentValue, index, array) => callback(currentValue, index_total + index, this));
        // eslint-disable-next-line no-await-in-loop
        result_ary.push(...await Promise.all(promises));

        index_total += batch_ary.length;
        batch_ary = [];
        index = 0;
      }
    }

    /* fire callbacks if some remain */
    if (batch_ary.length) {
      // eslint-disable-next-line require-await,no-unused-vars
      const promises = batch_ary.map(async (currentValue, index, array) => callback(currentValue, index_total + index, this));
      // eslint-disable-next-line no-await-in-loop
      result_ary.push(...await Promise.all(promises));
    }

    return result_ary;

  }
});
