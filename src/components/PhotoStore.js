import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import {
  addToCart,
  changeCartQuantity,
  removeFromCart,
  selectCartItems,
  selectTotalAmount,
  selectTotalQuantity,
} from './redux/cartSlice';
import { setViewOption } from './redux/productSlice';
import './PhotoStore.css';

const PRODUCTS_API_URL = 'https://dummyjson.com/products?limit=30';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function formatPrice(amount) {
  return currency.format(amount);
}

function ProductCard({
  product,
  quantity,
  onAddToCart,
  onChangeQuantity,
}) {
  return (
    <article className="photo-card">
      <div className="photo-image">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
        <span className="photo-number">{product.category}</span>
      </div>

      <div className="photo-card-content">
        <h3 title={product.title}>{product.title}</h3>
        <div className="product-brand">
          {product.brand || 'Everyday pick'}
        </div>

        <div className="photo-card-bottom">
          <strong>{formatPrice(product.price)}</strong>
          {quantity === 0 ? (
            <button
              className="add-button"
              onClick={() => onAddToCart(product)}
            >
              Add to cart
            </button>
          ) : (
            <div
              className="quantity-control product-quantity-control"
              aria-label={`Quantity of ${product.title} in cart`}
            >
              <button
                onClick={() => onChangeQuantity(product.id, -1)}
                aria-label={`Remove one ${product.title}`}
              >
                -
              </button>
              <span aria-live="polite">{quantity}</span>
              <button
                onClick={() => onAddToCart(product)}
                aria-label={`Add one ${product.title}`}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function CartPage() {
  const dispatch = useDispatch();
  const cart = useSelector(selectCartItems);
  const totalQuantity = useSelector(selectTotalQuantity);
  const totalAmount = useSelector(selectTotalAmount);

  return (
    <section className="store-page">
      <div className="store-heading">
        <div>
          <p className="store-eyebrow">YOUR SELECTION</p>
          <h1>Your cart</h1>
        </div>
        <Link className="store-back-link" to="/">
          Continue shopping
        </Link>
      </div>

      {cart.length === 0 ? (
        <div className="store-empty">
          <span aria-hidden="true">Cart</span>
          <h2>Your cart is empty</h2>
          <p className="store-description">
            Add a product from the collection to get started.
          </p>
          <Link className="store-button" to="/">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map(({ product, quantity }) => (
              <article className="cart-item" key={product.id}>
                <img src={product.thumbnail} alt={product.title} />

                <div className="cart-item-info">
                  <span className="store-eyebrow">
                    {product.brand || product.category}
                  </span>
                  <h2>{product.title}</h2>
                  <span>{formatPrice(product.price)} each</span>
                </div>

                <div
                  className="quantity-control"
                  aria-label={`Quantity for ${product.title}`}
                >
                  <button
                    onClick={() => dispatch(changeCartQuantity({ productId: product.id, amount: -1 }))}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => dispatch(changeCartQuantity({ productId: product.id, amount: 1 }))}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <strong className="cart-line-total">
                  {formatPrice(product.price * quantity)}
                </strong>

                <button
                  className="remove-button"
                  onClick={() => dispatch(removeFromCart(product.id))}
                >
                  Remove
                </button>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Order summary</h2>
            <div>
              <span>Total quantity</span>
              <strong>{totalQuantity}</strong>
            </div>
            <div className="summary-total">
              <span>Total amount</span>
              <strong>{formatPrice(totalAmount)}</strong>
            </div>
            {/* <p>Prices are provided by the DummyJSON demo API.</p> */}
          </aside>
        </div>
      )}
    </section>
  );
}

export default function PhotoStore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const cart = useSelector(selectCartItems);
  const totalQuantity = useSelector(selectTotalQuantity);
  const totalAmount = useSelector(selectTotalAmount);
  const viewOption = useSelector((state) => state.products.viewOption);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const category = searchParams.get('category') || 'all';

  function selectCategory(nextCategory) {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (nextCategory === 'all') {
      nextSearchParams.delete('category');
    } else {
      nextSearchParams.set('category', nextCategory);
    }

    setSearchParams(nextSearchParams);
  }

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch(PRODUCTS_API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Product API returned ${response.status}.`);
        }

        const data = await response.json();
        if (!Array.isArray(data.products)) {
          throw new Error('The product API returned an unexpected response.');
        }

        setProducts(data.products);
        setError('');
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(
            requestError.message ||
              'Could not load products. Check your connection and try again.'
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();
    return () => controller.abort();
  }, []);

  const categories = useMemo(() => {
    const productCategories = products
      .map((product) => product.category)
      .filter(Boolean);

    return [...new Set(productCategories)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const searchTerm = search.toLowerCase();

    return products.filter((product) => {
      const searchableText = [
        product.title,
        product.brand || '',
        product.description,
      ]
        .join(' ')
        .toLowerCase();
      const matchesSearch = searchableText.includes(searchTerm);
      const matchesCategory =
        category === 'all' || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const cartQuantities = useMemo(() => {
    return Object.fromEntries(
      cart.map(({ product, quantity }) => [product.id, quantity])
    );
  }, [cart]);

  return (
    <section className="store-page">
      <header className="store-topbar">
        <Link to="/" className="store-brand">
          <span className="brand-mark">S</span>
          ShopSpace
        </Link>

        <div className="store-top-actions">
          <div className="cart-preview-wrap">
            <Link
              to="/cart"
              className="cart-link me-4"
              aria-label={`Shopping cart, ${totalQuantity} items, total ${formatPrice(totalAmount)}`}
            >
              <i className="cart-icon fa-solid fa-basket-shopping" aria-hidden="true" />
              <b>{totalQuantity}</b>
            </Link>
            <div className="cart-preview">
              <span>{totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} in your cart</span>
              <strong>{formatPrice(totalAmount)}</strong>
              <span className="cart-preview-hint">Open cart to review</span>
            </div>
          </div>
        </div>
      </header>

      <div className="collection-heading">
        <div>
          <p className="store-eyebrow">THE COLLECTION</p>
          <h2>Popular products</h2>
        </div>

        <label className="photo-search">
          <span aria-hidden="true">Search</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search products"
          />
        </label>
      </div>

      <div className="category-filters" aria-label="Filter by category">
        <button
          className={category === 'all' ? 'category-chip selected' : 'category-chip'}
          onClick={() => selectCategory('all')}
        >
          All products
        </button>

        {categories.map((name) => (
          <button
            key={name}
            className={category === name ? 'category-chip selected' : 'category-chip'}
            onClick={() => selectCategory(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="catalog-toolbar">
        <span>{filteredProducts.length} products</span>
        <div className="view-switch" role="group" aria-label="Product layout">
          <button
            type="button"
            className={viewOption === 'grid' ? 'view-button selected' : 'view-button'}
            onClick={() => dispatch(setViewOption('grid'))}
            aria-pressed={viewOption === 'grid'}
            aria-label="Grid view"
            title="Grid view"
          >
            <span aria-hidden="true">▦</span>
            <span>Grid</span>
          </button>
          <button
            type="button"
            className={viewOption === 'list' ? 'view-button selected' : 'view-button'}
            onClick={() => dispatch(setViewOption('list'))}
            aria-pressed={viewOption === 'list'}
            aria-label="List view"
            title="List view"
          >
            <span aria-hidden="true">☷</span>
            <span>List</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="store-message" role="status">
          Loading products...
        </div>
      )}

      {!loading && error && (
        <div className="store-message store-error" role="alert">
          {error}
          <button onClick={() => window.location.reload()}>Try again</button>
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="store-message">
          No products match &quot;{search}&quot;.
        </div>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className={`photo-grid ${viewOption === 'list' ? 'list-view' : 'grid-view'}`}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={cartQuantities[product.id] || 0}
              onAddToCart={(product) => dispatch(addToCart(product))}
              onChangeQuantity={(productId, amount) =>
                dispatch(changeCartQuantity({ productId, amount }))
              }
            />
          ))}
        </div>
      )}

      <footer className="store-footer">
        Demo products from DummyJSON. Cart total:{' '}
        <strong>{formatPrice(totalAmount)}</strong>. {totalQuantity}{' '}
        {totalQuantity === 1 ? 'item' : 'items'}.
        <Link to="/cart">View cart</Link>
      </footer>
    </section>
  );
}
