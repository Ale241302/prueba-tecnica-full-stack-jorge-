import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/lib/auth/context';
import { ThemeProvider } from '@/lib/theme-context';
import { Layout } from '@/components/Layout';
import { Toaster } from '@/components/ui/toaster';

const App = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider>
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster />
    </AuthProvider>
  </ThemeProvider>
);

export default App;
