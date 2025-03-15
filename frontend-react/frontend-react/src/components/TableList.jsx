import Pagination from "./Pagination";
export default function TableList({
  handleOpen,
  pageNumber,
  data,
  setData,
  setError,
  lastPageNumber,
  setPageNumber,
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
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 mb-4">
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

      <Pagination
        pageNumber={pageNumber}
        lastPageNumber={lastPageNumber}
        setPageNumber={setPageNumber}
      />
    </>
  );
}
