import { LockClosedIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

const options = ["Private", "Public"] as const;
type Visibility = (typeof options)[number];

interface SelectVisibilityProps {
  visibility: Visibility;
  onVisibilityChange: (visibility: "Private" | "Public") => void;
}

export default function SelectVisibility({
  visibility,
  onVisibilityChange,
}: SelectVisibilityProps) {
  return (
    <>
      <h2 className="font-medium text-base">Visibility</h2>
      <div className="inline-flex flex-row rounded-lg bg-gray-100 p-0.5 mt-1">
        {options.map((option) => {
          const selected = option === visibility;
          const Icon = option === "Private" ? LockClosedIcon : GlobeAltIcon;
          return selected ? (
            <button
              className="flex items-center rounded-md py-[0.4375rem] pl-2 pr-2 text-sm font-semibold lg:pr-3 bg-white shadow"
              onClick={() => onVisibilityChange(option)}
              key={option}
            >
              <Icon className="h-5 w-5 flex-none stroke-indigo-500" />
              <span className="ml-2 text-gray-900">{option}</span>
            </button>
          ) : (
            <button
              className="flex items-center rounded-md py-[0.4375rem] pl-2 pr-2 text-sm font-semibold lg:pr-3"
              onClick={() => onVisibilityChange(option)}
              key={option}
            >
              <Icon className="h-5 w-5 flex-none stroke-gray-600" />
              <span className="ml-2 text-gray-600">{option}</span>
            </button>
          );
        })}
      </div>
      {visibility === "Private" ? (
        <p className="mt-2 text-sm text-gray-500">
          File transport and storage are secured through end-to-end encryption
          (AES-CBC).
        </p>
      ) : (
        <p className="mt-2 text-sm text-gray-500">
          File is not encrypted and can be publicly accessed through a shared
          url.
        </p>
      )}
    </>
  );
}
