const SettingsPage = () => {
  return <></>;
};

export default SettingsPage;

export function getServerSideProps() {
  // we do not have a main settings page and nested layout are not a thing yet,
  // so, we redirect to the Profile Page
  return {
    redirect: {
      destination: `/settings/profile`,
    },
  };
}
