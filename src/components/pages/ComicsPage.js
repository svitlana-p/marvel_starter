import { Helmet } from "react-helmet";

import AppBanner from "../AppBanner/AppBanner";
import ComicsList from "../ComicsList/ComicsList";

const ComicsPage = () => {
  return (
    <>
      <Helmet>
        <meta name="description" content="Page with list of comics" />
        <title>Comics Page</title>
      </Helmet>
      <AppBanner />
      <ComicsList />
    </>
  );
};

export default ComicsPage;
