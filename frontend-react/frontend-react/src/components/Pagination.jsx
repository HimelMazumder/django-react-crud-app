export default function Pagination({
  pageNumber,
  lastPageNumber,
  setPageNumber,
}) {
  return (
    <>
      {/* Pagination */}
      <div className="join grid grid-cols-5 w-1/3 mx-auto mb-8">
        <button
          className={`join-item btn btn-outline btn-md mr-2 ${
            pageNumber === 1 ? "btn-disabled" : ""
          }`}
          onClick={() => setPageNumber(1)}
        >
          First
        </button>
        <button
          className={`join-item btn btn-outline btn-md mr-2 ${
            pageNumber === 1 ? "btn-disabled" : ""
          }`}
          onClick={() => setPageNumber((prevPageNumber) => prevPageNumber - 1)}
        >
          Previous
        </button>
        <button className="join-item btn btn-outline btn-md btn-disabled mr-2 text-green-500">
          {pageNumber}
        </button>

        <button
          className={`join-item btn btn-outline btn-md mr-2 ${
            pageNumber === lastPageNumber ? "btn-disabled" : ""
          }`}
          onClick={() => setPageNumber((prevPageNumber) => prevPageNumber + 1)}
        >
          Next
        </button>
        <button
          className={`join-item btn btn-outline btn-md ${
            pageNumber === lastPageNumber ? "btn-disabled" : ""
          }`}
          onClick={() => setPageNumber(lastPageNumber)}
        >
          Last
        </button>
      </div>
    </>
  );
}
