import Document, { Html, Head, Main, NextScript } from 'next/document';
import { Partytown } from '@builder.io/partytown/react';
import FooterScripts from '~/components/FooterScripts';

export default class MyDocument extends Document {
  render() {
    return (
      <Html className="dark">
        <Head>
          <Partytown />
        </Head>

        <body>
          <Main />

          <NextScript />
          <FooterScripts />
        </body>
      </Html>
    );
  }
}
