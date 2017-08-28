Error: `TypeError: Cannot read property 'EventEmitter' of undefined`
Solution: The problem is caused by `cldrjs`, used in `globalize`, used in `js-app`. The author of
 `cldrjs` implemented a solution in 0.5.0, but the latest version of `globalize` still uses 0.4.*.
 If a new version of `globalize` was released, use it (and if it works, update `js-app` 
 package.json and delete this comment). Else, modify `globalize` package.json to use `cldr` version
 0.5.0.
 
When developping, do not make a symbolic link to `js-app` if it has its own `node_modules/` 
folder, since you might run into problems when `js-app` wants to make sure an instance of (for 
example) a `Decimal` is passed from `tablet-ui`, but they each have their own `decimal.js` library. 
