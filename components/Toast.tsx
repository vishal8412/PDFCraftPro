// "use client";
// import React from "react";

// export default function Toast({
//   message,
//   link,
// }: {
//   message: string | null;
//   link: string | null;
// }) {
//   if (!message) return null;

//   return (
//     <div className="fixed bottom-4 right-4 bg-gray-900 text-white text-sm px-4 py-2 rounded shadow-lg flex items-center space-x-2">
//       <span>{message}</span>
//       {link && (
//         <>
//           <a
//             href={link}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="underline text-blue-400 hover:text-blue-300"
//           >
//             Open
//           </a>
//           <button
//             onClick={() => {
//               navigator.clipboard.writeText(link);
//             }}
//             className="underline text-yellow-400 hover:text-yellow-300"
//           >
//             Copy Link
//           </button>
//         </>
//       )}
//     </div>
//   );
// }

"use client";

export default function Toast({ message, link }: { message: string | null; link?: string | null }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-4 right-4 bg-brand text-white px-4 py-2 rounded shadow-lg flex items-center gap-2">
      <span>{message}</span>
      {link && (
        <a href={link} target="_blank" className="underline">
          Open
        </a>
      )}
    </div>
  );
}
