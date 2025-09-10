// "use client";
// import React from "react";

// export default function Recents({
//   recents,
//   onOpen,
// }: {
//   recents: { id: string; name: string; date: number }[];
//   onOpen: (item: any) => void;
// }) {
//   return (
//     <div className="w-48 bg-gray-100 border-r overflow-auto p-2 text-sm">
//       <h2 className="font-semibold mb-2">Recent Files</h2>
//       {recents.length === 0 && <p className="text-gray-500">No recents</p>}
//       <ul>
//         {recents.map((r) => (
//           <li
//             key={r.id}
//             className="cursor-pointer hover:bg-gray-200 p-1 rounded"
//             onClick={() => onOpen(r)}
//           >
//             {r.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

"use client";

export default function Recents() {
  const items = [
    { id: 1, name: "Contract.pdf", date: "2023-09-01" },
    { id: 2, name: "Invoice.pdf", date: "2023-09-02" },
  ];

  return (
    <div className="hidden md:flex border-t bg-white p-3 text-sm gap-4 overflow-x-auto">
      {items.map((i) => (
        <div key={i.id} className="px-3 py-2 border rounded hover:bg-gray-50">
          {i.name}
        </div>
      ))}
    </div>
  );
}
