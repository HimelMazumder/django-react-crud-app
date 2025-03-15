import {
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

export default function Chart({ chartDataFinal }) {
  return (
    <>
      {/* Chart Starts*/}
      <div className="mb-3">
        <div className="mt-4 w-[98%] bg-seconday mx-auto p-4">
          {chartDataFinal.length > 0 ? (
            <ResponsiveContainer width="100%" height={450}>
              <ComposedChart data={chartDataFinal} margin={{ right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), "MMM d, yy")}
                  stroke="#1F0318"
                />

                <YAxis yAxisId="left" orientation="left" stroke="#A30000" />
                <YAxis yAxisId="right" orientation="right" stroke="#004777" />

                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="close"
                  stroke="#A30000"
                />
                <Bar yAxisId="right" dataKey="volume" fill="#004777" />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <h1 className="text-center text-secondary text-2xl font-mono">
              Select a trade code to see chart
            </h1>
          )}
        </div>
      </div>
      {/* Chart Ends */}

      <hr className="text-accent my-3" />
    </>
  );
}
