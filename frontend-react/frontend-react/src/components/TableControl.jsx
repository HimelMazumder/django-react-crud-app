export default function TableControl({
  query,
  sortBy,
  onSortByChange,
  direction,
  onDirectionChange,
  onSearch,
  setPageNumber,
  handleOpen,
}) {
  const handleQueryChange = (event) => {
    onSearch(event.target.value.trim());
    setPageNumber(1);
  };

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm mb-3">
        <div className="navbar-start ml-3">
          {/* Search */}
          <label className="input input-primary w-60">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>

            <input
              type="search"
              placeholder="Search by Trade Code"
              value={query}
              onChange={handleQueryChange}
            />
          </label>
          {/* Search */}
        </div>
        <div className="navbar-center">
          {/* Filter */}
          <label className="select select-sm w-50">
            <span className="label">Sort By</span>
            <select value={sortBy} onChange={onSortByChange}>
              <option value="date_created">Date created</option>
              <option value="date">Date</option>
              <option value="trade_code">Trade code</option>
              <option value="close">Close</option>
              <option value="volume">Volume</option>
            </select>
          </label>

          <label className="select select-sm w-50 ml-4">
            <span className="label">Direction </span>
            <select value={direction} onChange={onDirectionChange}>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </label>
          {/* Filter */}
        </div>
        <div className="navbar-end">
          {/* Add */}
          <a
            className="btn btn-primary mr-3"
            onClick={() => handleOpen("add", null)}
          >
            Add
          </a>
          {/* Add */}
        </div>
      </div>
    </>
  );
}
