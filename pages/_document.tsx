import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => (
  <Html lang='es'>
    <Head>
      <link
        href='https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
        rel='stylesheet'
      />
    </Head>
    <body className='font-sans antialiased'>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
