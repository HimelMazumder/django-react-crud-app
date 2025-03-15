import { useState, useEffect, useCallback } from "react";
import Chart from "./Chart";

export default function ChartControl({ setError }) {
  const [chartData, setChartData] = useState([]);
  const [chartDataFinal, setChartDataFinal] = useState([]);
  const [query, setQuery] = useState("");
  const [tradeCodeChart, setTradeCodeChart] = useState("");
  const [tradeCodeDropDown, setTradeCodeDropDown] = useState("");
  const [isFinal, setIsFinal] = useState(false);

  const fetchDataChart = useCallback(
    async (controller) => {
      try {
        const response = await fetch(
          `http://localhost:8000/data/chart?query=${query}&isFinal=${isFinal}`,
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

        if (!isFinal) {
          setChartData(jsonData);
        } else {
          setChartDataFinal(jsonData);
          setIsFinal(false);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          console.error("Fetch error:", err.message);
        }
      }
    },
    [query]
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchDataChart(controller);

    return () => controller.abort();
  }, [fetchDataChart, query]);

  const handleChartTradeCodeTextChange = (e) => {
    const value = e.target.value;

    setTradeCodeChart(value);
    setQuery(value);
  };

  const handleChartTradeCodeDropdownChange = (e) => {
    const value = e.target.value;

    setTradeCodeDropDown(value);
    setQuery(value);
    setIsFinal(true);
  };

  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <label className="fieldset-legend text-xl ml-18">
            {tradeCodeDropDown === "" ? "" : `Chart for ${tradeCodeDropDown}`}
          </label>
        </div>
        <div className="flex-none">
          <div className="flex justify-end mr-5">
            <label className="fieldset-legend text-sm mr-3">
              Filter chart data
            </label>
            <input
              type="text"
              onChange={handleChartTradeCodeTextChange}
              placeholder="Type a Trade Code to filter options in dropdown"
              value={tradeCodeChart}
              className="input input-sm w-70"
            />
            <select
              value={tradeCodeDropDown}
              onChange={handleChartTradeCodeDropdownChange}
              className="select select-sm w-70 ml-3"
            >
              <option disabled={true} value={tradeCodeDropDown}>
                Select a trade code
              </option>
              {chartData.length > 0 ? (
                [...new Set(chartData.map((item) => item.trade_code))]
                  .sort()
                  .map((trade_code, index) => (
                    <option key={index} value={trade_code}>
                      {trade_code}
                    </option>
                  ))
              ) : (
                <option disabled={true}>No trade code found</option>
              )}
            </select>
          </div>
        </div>
      </div>

      <Chart chartDataFinal={chartDataFinal} />
    </>
  );
}
