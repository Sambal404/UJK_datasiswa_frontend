export default function Table({ columns, data, onEdit, onDelete }) {
    return (
        <div className="w-full overflow-x-auto border border-border rounded-lg bg-surface shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-background border-b border-border text-sm text-muted">
                        <th className="p-3">No</th>

                        {columns.map((col, idx) => (
                            <th key={idx} className="p-3">
                                {col.header}
                            </th>
                        ))}

                        {(onEdit || onDelete) && (
                            <th className="p-3 text-center">
                                Aksi
                            </th>
                        )}
                    </tr>
                </thead>

                <tbody className="divide-y divide-border text-sm text-text">
                    {data && data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr
                                key={row.id || rowIndex}
                                className="hover:bg-background/50 transition"
                            >
                                <td className="p-3 text-muted">
                                    {rowIndex + 1}
                                </td>

                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className="p-3">
                                        {typeof col.accessor === 'function'
                                            ? col.accessor(row, rowIndex)
                                            : row[col.accessor]}
                                    </td>
                                ))}

                                {(onEdit || onDelete) && (
                                    <td className="p-3 text-center space-x-2">
                                        {onEdit && (
                                            <button
                                                type="button"
                                                onClick={() => onEdit(row)}
                                                className="text-warning hover:underline font-medium text-xs px-2 py-1 bg-warning/10 rounded"
                                            >
                                                Edit
                                            </button>
                                        )}

                                        {onDelete && (
                                            <button
                                                type="button"
                                                onClick={() => onDelete(row)}
                                                className="text-danger hover:underline font-medium text-xs px-2 py-1 bg-danger/10 rounded"
                                            >
                                                Hapus
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={
                                    columns.length +
                                    ((onEdit || onDelete) ? 2 : 1)
                                }
                                className="p-6 text-center text-muted"
                            >
                                Tidak ada data tersedia.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

