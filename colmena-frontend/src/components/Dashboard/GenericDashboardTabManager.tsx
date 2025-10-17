type Tab = {
  id: TabId;
  label: string;
};

type TabId = "shared" | "other";

type Props = {
  tabs: Tab[];
  activeTab: string;
  onClickCustom: (id: TabId) => void;
};

export function GenericDashboardTabManager({ tabs, activeTab, onClickCustom }: Props) {
  return (
    <div className="flex gap-1 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onClickCustom(tab.id)}
          className={`hover:cursor-pointer px-2 py-1 text-sm ${activeTab === tab.id ? "border-b-2 border-blue-500 text-black" : "border-b-2"}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}