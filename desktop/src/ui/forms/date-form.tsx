import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MonthPicker } from "./month-picker";
import { YearInput } from "./year-input";

import { defaultMonth, defaultYear } from "../../utils";

const schema = yup.object().shape({
  month: yup
    .mixed()
    .test(
      "is-valid-month",
      'Month must be a number from 1 to 12 or a two-digit string from "01" to "12"',
      (value) => {
        if (typeof value === "string") {
          return /^(0[1-9]|1[0-2])$/.test(value);
        }
        if (typeof value === "number") {
          return value >= 1 && value <= 12;
        }
        return false;
      }
    )
    .required("Month is required"),
  year: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Year is required")
    .min(1850, "Year must be 1850 or later")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
});

type FormData = yup.InferType<typeof schema>;

interface DateForm {
  setQuery: (query: string) => void;
  setToggleView: (toggleView: boolean) => void;
}

export function DateForm({ setQuery, setToggleView }: DateForm) {
  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);

  const {
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      month: defaultMonth,
      year: defaultYear,
    },
  });

  const sendMonthYear = (month: string, year: number) => {
    if (year && month) {
      const dateQuery = `${month}-${year}`;

      setQuery(dateQuery);
      setToggleView(true);
    }
  };

  return (
    <div className="w-full sm:w-3/4">
      <form className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:w-44">
          <MonthPicker
            value={month}
            onChange={(value) => {
              setMonth(value);
              setValue("month", value, { shouldValidate: true });
            }}
          />
          {errors.month && (
            <p className="text-red-500 text-sm mt-1">{errors.month.message}</p>
          )}
        </div>
        <div className="w-full sm:w-32">
          <YearInput
            value={year}
            onChange={(value) => {
              console.log(value);
              // console.log(year);
              setYear(value);
              setValue("year", value, { shouldValidate: true });
            }}
            min={1850}
            max={new Date().getFullYear()}
            onBlurHandler={() => sendMonthYear(month, year)}
          />
          {errors.year && (
            <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-gray-100 text-gray-800 rounded-full px-6 py-2 shadow-md hover:bg-gray-200 focus:opacity-40 transition-all duration-300 ease-in-out"
        >
          Search
        </button>
        <button
          onClick={() => setToggleView(false)}
          className="bg-gray-100 text-gray-800 rounded-full px-6 py-2 shadow-md hover:bg-gray-200 focus:opacity-40 transition-all duration-300 ease-in-out"
        >
          Compare
        </button>
      </form>
    </div>
  );
}
