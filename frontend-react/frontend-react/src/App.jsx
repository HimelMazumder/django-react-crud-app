import { useState, useEffect, useCallback } from "react";
import "./App.css";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import TableList from "./components/TableList";
import ModalForm from "./components/ModalForm";
import ChartControl from "./components/ChartControl";
import TableControl from "./components/TableControl";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [item, setItem] = useState(null);

  const [data, setData] = useState([]);
  const [error, setError] = useState([]);
  const [lastPageNumber, setLastPageNumber] = useState(1);

  const [sortBy, setSortBy] = useState("date_created");
  const [direction, setDirection] = useState("desc");

  const fetchData = useCallback(
    async (controller) => {
      try {
        const response = await fetch(
          `http://localhost:8000/data?page=${pageNumber}&query=${query}&sort=${sortBy}&dir=${direction}`,
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
    [pageNumber, query, sortBy, direction]
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchData(controller);

    return () => controller.abort();
  }, [fetchData, pageNumber, query, sortBy, direction]);

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

        setSortBy("date_created");
        setDirection("desc");
        setQuery("");

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

  const handleSortByChange = (e) => {
    const value = e.target.value;
    setPageNumber(1);
    setSortBy(value);
  };

  const handleDirectionChange = (e) => {
    const value = e.target.value;
    setPageNumber(1);
    setDirection(value);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <NavBar
          handleOpen={handleOpen}
          setPageNumber={setPageNumber}
          onSearch={setQuery}
          query={query}
        />
        <ChartControl setError={setError} />
        <main className="flex-grow">
          <TableControl
            query={query}
            sortBy={sortBy}
            onSortByChange={handleSortByChange}
            direction={direction}
            onDirectionChange={handleDirectionChange}
            onSearch={setQuery}
            setPageNumber={setPageNumber}
            handleOpen={handleOpen}
          />
          <TableList
            handleOpen={handleOpen}
            pageNumber={pageNumber}
            data={data}
            setData={setData}
            setError={setError}
            lastPageNumber={lastPageNumber}
            setPageNumber={setPageNumber}
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
