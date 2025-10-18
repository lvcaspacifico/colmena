type GenericLabelProps = {
  name: string;
  color: string;
  onRemove?: () => void;
  showRemoveButton?: boolean;
};

export function GenericLabel({
  name,
  color,
  onRemove,
  showRemoveButton = true,
}: GenericLabelProps) {
  return (
    <div
      className="flex items-center gap-1 bg-white border-1 rounded px-2 py-1 text-xs font-semibold"
      style={{
        borderColor: color,
        color: color,
      }}
    >
      <span>🏷️ {name}</span>
      {showRemoveButton && onRemove && (
        <button
          onClick={onRemove}
          className="font-bold hover:cursor-pointer"
          style={{ color: color }}
        >
          ✕
        </button>
      )}
    </div>
  );
}