<div>
  <h1 align="center">manzana</h1>
  <h4 align="center">
    🍏 Build forms on Svelte as easy as eating apple.
  </h4>
</div>

> This package is under heavy development. Contributions are welcome. The stable release will be ready on version: `v1.0.0`.

## Releasing

Whenever a tag is pushed a new release is created an the package is
published to the NPM registry using GitHub Actions.

Bump the current version using `npm` as follows:

```sh
# for versions with breaking changes use `major`
npm version major

# for versions with non-breaking changes use `minor`
npm version minor

# for patch versions use `patch`
npm version patch
```

Then push the repository including tag metadata as follows

```sh
git push origin main --follow-tags
```

## Contributions

Any contribution to this package is welcome! Don't hesitate on opening a
PR or creating an issue!
