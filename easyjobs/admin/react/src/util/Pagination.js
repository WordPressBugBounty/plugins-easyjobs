import React, { useEffect, useState } from 'react';

const Pagination = ({ showPagination, total, changeHandler, topMargin }) => {
  const [currentPage, setCurrentPage] = useState(undefined);
  topMargin = typeof topMargin !== 'undefined' ? topMargin : true;

  useEffect(() => {
    if (currentPage) {
      changeHandler(currentPage);
    }
  }, [currentPage]);

  const handleClick = (e, page) => {
    e.preventDefault();
    setCurrentPage(page);
  };
  const nextPage = (e) => {
    e.preventDefault();
    if (currentPage !== total) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = (e) => {
    e.preventDefault();
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getLinks = () => {
    const links = [];
    for (let i = 1; i <= total; i++) {
      let isCurrent = false;
      if (typeof currentPage === 'undefined' && i === 1) {
        isCurrent = true;
      }
      if (currentPage === i) {
        isCurrent = true;
      }

      links.push(
        <li
          className={`pagination-list__item ${
            isCurrent ? 'pagination-list__item--active' : ''
          }`}
          key={`page-${i}`}
        >
          <button
            className="pagination-list__link"
            onClick={(e) => handleClick(e, i)}
          >
            {i}
          </button>
        </li>,
      );
    }
    return links;
  };
  if (total < 2) {
    return '';
  }
  return (
    <ul className={topMargin ? 'pagination-list mt-3' : 'pagination-list'}>
      <li className="pagination-list__item">
        <button
          className="pagination-list__link"
          disabled={currentPage === 1}
          onClick={(e) => prevPage(e)}
        >
          <i className="easyjobs-icon easyjobs-arrow-left"></i>
        </button>
      </li>
      {getLinks()}
      <li className="pagination-list__item">
        <button
          className="pagination-list__link"
          disabled={currentPage === total}
          onClick={(e) => nextPage(e)}
        >
          <i className="easyjobs-icon easyjobs-arrow-right"></i>
        </button>
      </li>
    </ul>
  );
};

export default Pagination;
