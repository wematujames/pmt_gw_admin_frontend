"use client";

export default function SectionHeader({
  leadText,
  subText,
  icon,
}: {
  leadText: string;
  subText: string;
  icon: JSX.Element;
}) {
  return (
    <div className="flex flex-col mb-6">
      <div className="flex items-center gap-2 text-gray-800">
        {/* We use your primary brand color for the icon */}
        <span className="text-xl text-[#142868] flex items-center">{icon}</span>
        <h3 className="text-lg font-bold m-0 tracking-tight">{leadText}</h3>
      </div>
      <p className="text-sm text-gray-500 m-0 mt-1 font-medium">{subText}</p>
    </div>
  );
}