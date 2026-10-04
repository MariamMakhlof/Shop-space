import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { selectTotalQuantity } from './redux/cartSlice';
import { selectTheme, toggleTheme } from './redux/themeSlice';
import './SideBar.css';

const CATEGORIES_URL = 'https://dummyjson.com/products/category-list';

function formatCategory(category) {
  return category.replace(/-/g, ' ');
}

export default function SideBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const totalQuantity = useSelector(selectTotalQuantity);
  const theme = useSelector(selectTheme);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 620px)');
    const collapseOnMobile = (event) => {
      if (event.matches) setIsExpanded(false);
    };

    if (mobileQuery.matches) setIsExpanded(false);
    mobileQuery.addEventListener('change', collapseOnMobile);

    return () => mobileQuery.removeEventListener('change', collapseOnMobile);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetch(CATEGORIES_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Could not load categories.');
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setCategories([]);
      });

    return () => controller.abort();
  }, []);

  function toggleSidebar() {
    setIsExpanded((expanded) => !expanded);
  }

  function toggleCategories() {
    if (!isExpanded) setIsExpanded(true);
    setIsCategoriesExpanded((expanded) => !expanded);
  }

  function closeSidebarOnMobile() {
    if (window.matchMedia('(max-width: 620px)').matches) {
      setIsExpanded(false);
    }
  }

  return (
    <div className={`wrapper ${isExpanded ? 'sidebar-expanded' : ''}`}>
      <aside id="sidebar" className={isExpanded ? 'expand' : ''}>
        <div className="sidebar-header">
          <button
            className="toggle-btn"
            type="button"
            onClick={toggleSidebar}
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-expanded={isExpanded}
          >
            <i
              className={`fa-solid ${isExpanded ? 'fa-xmark' : 'fa-bars'}`}
              aria-hidden="true"
            />
          </button>
          <Link className="sidebar-logo" to="/" onClick={closeSidebarOnMobile}>
            ShopSpace
          </Link>
        </div>

        <nav className="sidebar-nav" aria-label="Store navigation">
          <p className="sidebar-section-label">SHOP</p>

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            title="Products"
            onClick={closeSidebarOnMobile}
          >
            <i className="fa-solid fa-store" aria-hidden="true" />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            title="Shopping cart"
            onClick={closeSidebarOnMobile}
          >
            <i className="fa-solid fa-basket-shopping" aria-hidden="true" />
            <span>Shopping cart</span>
            <span
              className="sidebar-count"
              aria-label={`${totalQuantity} items`}
            >
              {totalQuantity}
            </span>
          </NavLink>

          <button
            className="sidebar-link"
            type="button"
            onClick={toggleCategories}
            aria-expanded={isCategoriesExpanded}
            title="Categories"
          >
            <i className="fa-solid fa-layer-group" aria-hidden="true" />
            <span>Categories</span>
            {isExpanded && (
              <i
                className={`fa-solid ${isCategoriesExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} sidebar-chevron`}
                aria-hidden="true"
              />
            )}
          </button>

          {isExpanded && isCategoriesExpanded && (
            <ul className="sidebar-category-list">
              {categories.map((category) => (
                <li key={category}>
                  <NavLink
                    to={`/?category=${encodeURIComponent(category)}`}
                    className="sidebar-category-link"
                    title={formatCategory(category)}
                    onClick={closeSidebarOnMobile}
                  >
                    {formatCategory(category)}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </nav>

        <div className="sidebar-footer">
          <button
            className="sidebar-link"
            type="button"
            onClick={() => dispatch(toggleTheme())}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            <i
              className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}
              aria-hidden="true"
            />
            <span>{theme === 'dark' ? 'Light theme' : 'Dark theme'}</span>
          </button>
          <span className="sidebar-note">Demo store powered by DummyJSON</span>
        </div>
      </aside>
    </div>
  );
}
