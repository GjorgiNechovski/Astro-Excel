import { useState } from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onSetRoundNumbers: (decimals: number) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  onSetRoundNumbers,
}) => {
  const [decimals, setDecimals] = useState(2);

  return (
    <div
      style={{
        position: "fixed",
        top: y,
        left: x,
        background: "white",
        border: "1px solid #ccc",
        padding: "10px",
        zIndex: 1000,
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <h3>Cell Options</h3>
      <div style={{ marginBottom: "10px" }}>
        <label>
          Round to decimals:
          <input
            type="number"
            value={decimals}
            onChange={(e) => setDecimals(Number(e.target.value))}
            min={0}
            step={1}
            style={{ marginLeft: "5px", width: "50px" }}
          />
        </label>
        <button
          onClick={() => onSetRoundNumbers(decimals)}
          style={{ marginLeft: "10px" }}
        >
          Apply
        </button>
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ContextMenu;
