import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppProviders } from './app/providers/AppProviders';
import { router } from './app/routes';

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </AppProviders>
  );
}

export default App;