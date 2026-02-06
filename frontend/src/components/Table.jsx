export default function Table({ columns, data, emptyText }) {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-16 px-4">
                <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                </svg>
                <p className="text-gray-500 text-sm">{emptyText}</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {data.map((row, idx) => (
                        <tr
                            key={row.id || idx}
                            className="hover:bg-gray-50 transition-colors"
                        >
                            {columns.map((col) => (
                                <td
                                    key={col.key}
                                    className="px-6 py-4 whitespace-nowrap text-sm"
                                >
                                    {col.render ? col.render(row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}