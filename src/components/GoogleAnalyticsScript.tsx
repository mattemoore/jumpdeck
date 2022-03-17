export const GoogleAnalyticsScript: React.FC<{ accountId: string }> = ({
  accountId,
}) => {
  const script = getAnalyticsScript(accountId);

  return (
    <>
      <script
        async
        type="text/partytown"
        src="https://www.googletagmanager.com/gtag/js"
      />

      <script
        async
        id="gtmDataLayer"
        type="text/partytown"
        dangerouslySetInnerHTML={{ __html: script }}
      />
    </>
  );
};

function getAnalyticsScript(id: string) {
  return `
    window.dataLayer = window.dataLayer || [];
    function gtag() {dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${id}');
`;
}
