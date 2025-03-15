import { useState, useEffect, useCallback } from "react";
import "./App.css";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import TableList from "./components/TableList";
import ModalForm from "./components/ModalForm";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [item, setItem] = useState(null);

  const [data, setData] = useState([]);
  const [error, setError] = useState([]);
  const [lastPageNumber, setLastPageNumber] = useState(1);

  const fetchData = useCallback(
    async (controller) => {
      try {
        const response = await fetch(
          `http://localhost:8000/data?page=${pageNumber}&query=${query}`,
          {
            signal: controller.signal,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error. status: ${response.status}`);
        }

        const jsonData = await response.json();
        setData(jsonData.data);
        setLastPageNumber(jsonData.last_page);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          console.error("Fetch error:", err.message);
        }
      }
    },
    [pageNumber, query]
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchData(controller);

    return () => controller.abort();
  }, [fetchData, pageNumber, query]);

  const handleOpen = (mode, item) => {
    setItem(item);
    setIsOpen(true);
    setModalMode(mode);
  };

  const handleSubmit = async (inputData) => {
    try {
      let endPoint;
      let method;

      if (modalMode === "add") {
        endPoint = `http://localhost:8000/data/add`;
        method = "POST";
      } else {
        endPoint = `http://localhost:8000/data/edit/${item.id}`;
        method = "PUT";
      }

      const response = await fetch(endPoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error. status: ${response.status}`);
      }

      const returnedData = await response.json();

      if (modalMode === "add") {
        setPageNumber(1);
        setData((prevData) => [returnedData, ...prevData]);
      } else {
        setData((prevData) =>
          prevData.map((i) => (i.id === item.id ? returnedData : i))
        );
      }
    } catch (err) {
      console.error("Post error:", err.message);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <NavBar
          handleOpen={handleOpen}
          setPageNumber={setPageNumber}
          onSearch={setQuery}
        />
        <main className="flex-grow">
          <TableList
            handleOpen={handleOpen}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            data={data}
            setData={setData}
            lastPageNumber={lastPageNumber}
            setError={setError}
          />
          <ModalForm
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            mode={modalMode}
            onSubmit={handleSubmit}
            item={item}
          />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
