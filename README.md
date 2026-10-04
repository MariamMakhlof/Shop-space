# ShopSpace

A small product store built with React and Redux. It loads demo products and categories from [DummyJSON](https://dummyjson.com/), with search, category filters, grid/list layouts, a saved cart, and light/dark themes.

## Run locally

```bash
npm install
npm start
```

## Product API and hosting

The store requests `https://dummyjson.com` directly from the browser and does not need an API key or a backend proxy. The catalog is demo data, so it is read-only; cart and theme choices are saved in the visitor's browser and are not shared between users or devices.

You can push the project to GitHub and host the production build on a static host. Since the app uses `BrowserRouter`, configure the host to serve `index.html` for app routes such as `/cart` when a visitor refreshes or opens a route directly.

Build the production files with:

```bash
npm run build
```

GitHub Pages deploys automatically when changes are pushed to `main`. Once the Actions run succeeds, the site is available at <https://mariammakhlof.github.io/Shop-space/>.
