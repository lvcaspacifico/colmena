import { GenericLink } from "../General/GenericLink";

type BreadCrumbItem =
  | { type: "link"; label: string; to: string }
  | { type: "text"; label: string };


interface GenericBreadCrumbProps {
  items: BreadCrumbItem[];
}

export function GenericBreadCrumb({ items }: GenericBreadCrumbProps) {
  return (
    <nav className="bg-gray-200 mt-4 mx-4 p-4 rounded
    flex items-center text-center">
      {items.map((item, index) => (
        <span key={index} className="flex items-center">
          {item.type === "link" ? (
            <GenericLink to={item.to} label={item.label} className="m-0" />
          ) : (
            <span>{item.label}</span>
          )}
          {index < items.length - 1 && <span className="mx-2">/</span>}
        </span>
      ))}
    </nav>
  );
}
