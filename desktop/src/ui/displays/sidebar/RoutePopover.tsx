import { useState } from "react";

import { Eye, BarChart2 } from "lucide-react";

interface RouteButtonProps {
  onVisualize: () => void;
  onCompare: () => void;
  label: string;
}

export const RouteButton = ({
  onVisualize,
  onCompare,
  label,
}: RouteButtonProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: open ? "block" : "none" }}>
      <button className="bg-transparent text-rose-900 hover:text-rose-900 hover:bg-transparent hover:underline focus:text-rose-900 focus:underline p-0 m-0 h-4">
        <span className=" text-rose-900">{label}</span>
      </button>
      <div className="flex flex-col space-y-2">
        <button
          onClick={() => {
            onVisualize();
            setOpen(false);
          }}
          className="flex items-center text-sm  bg-transparent hover:underline focus:outline-none focus:text-rose-900"
        >
          <Eye className="mr-2 h-4 w-4" />
          Visualize
        </button>
        <button
          onClick={() => {
            onCompare();
            setOpen(false);
          }}
          className="flex items-center text-sm text-blue-600  bg-transparenthover:underline focus:outline-none focus:text-rose-900"
        >
          <BarChart2 className="mr-2 h-4 w-4" />
          Compare
        </button>
      </div>
    </div>
  );
};
