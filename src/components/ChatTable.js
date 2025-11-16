import "./ChatTable.css";

export default function ChatTable({ rows }) {
  if (!rows || rows.length === 0) return null;

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {Object.keys(rows[0]).map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((value, colIndex) => (
                <td key={colIndex}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
