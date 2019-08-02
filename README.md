# forEachSync and mapSync

The forEachSync and mapSync are synchronous Array functions for the asynchronous functions.


## Syntax:

- `await arr.forEachSync(async function callback(currentValue [, index [, array]]), batchSize);`
- `var new_array = await arr.mapSync(async function callback(currentValue[, index[, array]]) { Return element for new_array }, batchSize);`


## Features:

- They can (a)wait for the asynch functions.
- If optional batchSize >= 2, each element goes in parallel by the size of array batch. But each batch goes in sequential. It is the middle of parallel and sequential.


## Sample program:

### forEachSync

```javascript

var sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
var ary = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

(async () => {
  await ary.forEachSync(async (a, index, array) => {
    console.log("forEachSync first", a, index, array.length);
    await sleep(1000);
  }, 3);

  console.log("forEachSync end");
})();

```

It goes in sequential by the array batch `[1,2,3]`, `[4,5,6]`, `[7,8,9]`, `[10]`.


### mapSync

```javascript

var sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
var ary = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

(async () => {
  var ary_result = await (await ary.mapSync(async (a, index, array) => {
    console.log("mapSync first", a, index, array.length);
    await sleep(500);
    return a + 10;
  }, 3)).mapSync(async (a, index, array) => {
    console.log("mapSync second", a, index, array.length);
    await sleep(500);
    return a + 100;
  });
  console.log("mapSync", ary_result);
})();

```

The "mapSync first" goes in sequential by the array batch `[1,2,3]`, `[4,5,6]`, `[7,8,9]`, `[10]`.
The "mapSync second" goes in sequential by the array batch `[11]`, `[12]`, `[13]`, `[14]`, `[15]`, `[16]`, `[17]`, `[18]`, `[19]`, `[20]`.


## License:

This software is released under the MIT License.
