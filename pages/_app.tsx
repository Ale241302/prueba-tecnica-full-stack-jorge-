import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/lib/auth/context';
import { Layout } from '@/components/Layout';
import { Toaster } from '@/components/ui/toaster';

const App = ({ Component, pageProps }: AppProps) => (
  <AuthProvider>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    <Toaster />
  </AuthProvider>
);

export default App;
