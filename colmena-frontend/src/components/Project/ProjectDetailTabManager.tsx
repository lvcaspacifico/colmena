type TabId = "tasks" | "labels" | "users";

type Tab = {
  id: TabId;
  label: string;
};

type Props = {
  tabs: Tab[];
  activeTab: TabId;
  onChange: (id: TabId) => void;
};

export function ProjectDetailTabManager({ tabs, activeTab, onChange }: Props) {
  return (
    <div className="flex border-b border-blue-400 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 px-4 py-3 text-black font-medium transition-colors ${
            activeTab === tab.id ? "bg-blue-700" : "hover:bg-blue-500"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
