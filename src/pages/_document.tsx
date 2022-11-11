import Document, { Html, Main, Head, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html className={this.getTheme()}>
        <Head />

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }

  private getTheme() {
    return this.props.__NEXT_DATA__.props.pageProps?.ui?.theme;
  }
}
