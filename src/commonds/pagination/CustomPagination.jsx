import React, { useState } from 'react';
import { Pagination } from 'semantic-ui-react';

const CustomPagination = (props) => {
  const { pages, changeFn, initPage } = props;
  const [activePage, setActivePage] = useState(initPage);
  const onPageChange = (e, d) => {
    // console.log(d);
    setActivePage(d.activePage);
    changeFn(d.activePage);
  };
  return (
    <Pagination
      activePage={activePage}
      firstItem={null}
      lastItem={null}
      pointing
      secondary
      totalPages={pages}
      onPageChange={onPageChange}
    />
  );
};

export default CustomPagination;
