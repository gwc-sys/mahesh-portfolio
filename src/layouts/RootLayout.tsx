import { Outlet } from 'react-router-dom';

export function RootLayout() {
  return (
    <div className="terminal-site">
      <Outlet />
    </div>
  );
}

