import { useState } from "react";
import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";

type FinancialData = {
  month: string;
  income: number[];
  expenses: number[];
};

const initialData: FinancialData[] = [
  { month: "Jan", income: [1000, 2000], expenses: [800, 1200] },
  { month: "Feb", income: [1500, 2500], expenses: [900, 1300] },
];

export const loader: LoaderFunction = async () => {
  return json(initialData);
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const updatedData = JSON.parse(formData.get("updatedData") as string);
  return json(updatedData);
};

export default function Finances() {
  const data = useLoaderData<FinancialData[]>();
  const fetcher = useFetcher();

  const handleCellChange = (
    monthIndex: number,
    type: "income" | "expenses",
    cellIndex: number,
    value: string
  ) => {
    const updatedData = [...data];
    updatedData[monthIndex][type][cellIndex] = parseFloat(value) || 0;
    fetcher.submit({ updatedData: JSON.stringify(updatedData) }, { method: "post" });
  };

  return (
    <div className="p-4">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th>Month</th>
            <th colSpan={2}>Income</th>
            <th colSpan={2}>Expenses</th>
          </tr>
        </thead>
        <tbody>
          {data.map((monthData, monthIndex) => (
            <tr key={monthData.month}>
              <td>{monthData.month}</td>
              {monthData.income.map((value, cellIndex) => (
                <td key={cellIndex}>
                  <input
                    type="text"
                    defaultValue={value}
                    className="border p-1"
                    onChange={(e) =>
                      handleCellChange(monthIndex, "income", cellIndex, e.target.value)
                    }
                  />
                </td>
              ))}
              {monthData.expenses.map((value, cellIndex) => (
                <td key={cellIndex}>
                  <input
                    type="text"
                    defaultValue={value}
                    className="border p-1"
                    onChange={(e) =>
                      handleCellChange(monthIndex, "expenses", cellIndex, e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
