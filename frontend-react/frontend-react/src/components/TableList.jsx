export default function TableList({
  handleOpen,
  pageNumber,
  setPageNumber,
  data,
  setData,
  lastPageNumber,
  setError,
}) {
  const deleteItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/data/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error. status: ${response.status}`);
      }

      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message);
        console.error("Fetch error:", err.message);
      }
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 mt-8">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Date</th>
              <th>Trade Code</th>
              <th>High</th>
              <th>Low</th>
              <th>Open</th>
              <th>Close</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              return (
                <tr className="hover:bg-base-200" key={item.id}>
                  <th>{(pageNumber - 1) * 50 + index + 1}</th>
                  <td>{item.date}</td>
                  <td>{item.trade_code}</td>
                  <td>{item.high}</td>
                  <td>{item.low}</td>
                  <td>{item.open}</td>
                  <td>{item.close}</td>
                  <td>{item.volume}</td>
                  <td>
                    <button
                      className="btn btn-soft btn-accent"
                      onClick={() => handleOpen("edit", item)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-soft btn-error"
                      onClick={() => deleteItem(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="join grid grid-cols-5 w-1/3 mx-auto my-4">
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
