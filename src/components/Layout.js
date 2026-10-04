import { useEffect, useLayoutEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import SideBar from './SideBar';
import { selectTheme } from './redux/themeSlice';

export default function Layout() {
  const mainRef = useRef(null);
  const location = useLocation();
  const theme = useSelector(selectTheme);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [location.pathname]);

  return (
    <div className="app-layout">
      <SideBar />
      <main className="app-main" ref={mainRef}>
        <Outlet />
      </main>
    </div>
  );
}
