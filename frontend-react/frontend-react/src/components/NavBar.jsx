export default function NavBar({ handleOpen, setPageNumber, onSearch }) {
  const handleQueryChange = (event) => {
    onSearch(event.target.value.trim());
    setPageNumber(1);
  };

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <a className="text-2xl ml-5">Janata Wifi</a>
        </div>

        <div className="navbar-center">
          <label className="input">
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
              onChange={handleQueryChange}
            />
          </label>
        </div>

        <div className="navbar-end">
          <a
            className="btn btn-primary mr-5"
            onClick={() => handleOpen("add", null)}
          >
            Add
          </a>
        </div>
      </div>
    </>
  );
}
