import { Outlet } from 'react-router-dom';
import { Navbar } from '../shared/Navbar';
import { Footer } from '../shared/Footer';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}