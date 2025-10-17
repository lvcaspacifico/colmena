import { useEffect, useState } from "react";
import Modal from "react-modal";
import { api } from "../../services/api";
import { GenericHeaderOne } from "../../components/Tipography/GenericHeaderOne";
import { GenericButton } from "../../components/Forms/GenericButton";
import { GenericBreadCrumb } from "../../components/General/GenericBreadCrumb";

type Label = {
  id: number;
  type: number;
  name: string;
  color: string;
};

type LabelFormData = {
  type: number;
  name: string;
  color: string;
};

const labelTypeMap: Record<number, string> = {
  1: "Global",
  2: "Project",
  3: "Task",
};

export function LabelsPage() {
  const [labels, setLabels] = useState<Label[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<LabelFormData>({
    type: 1,
    name: "",
    color: "#FFFFFF",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterType, setFilterType] = useState<number | "all">("all");

  useEffect(() => {
    fetchLabels();
  }, []);

  async function fetchLabels() {
    setIsLoading(true);
    try {
      const response = await api.get<Label[]>("/labels");
      setLabels(response.data);
      setErrorMessage(null);
    } catch {
      setErrorMessage("Unable to load labels.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenCreateModal() {
    setIsEditing(false);
    setFormData({
      type: 1,
      name: "",
      color: "#FFFFFF",
    });
    setIsFormModalOpen(true);
  }

  function handleOpenEditModal(label: Label) {
    setIsEditing(true);
    setSelectedLabel(label);
    setFormData({
      type: label.type,
      name: label.name,
      color: label.color,
    });
    setIsFormModalOpen(true);
  }

  function handleCloseFormModal() {
    setIsFormModalOpen(false);
    setSelectedLabel(null);
    setFormData({
      type: 1,
      name: "",
      color: "#FFFFFF",
    });
  }

  function handleOpenDeleteModal(label: Label) {
    setSelectedLabel(label);
    setIsDeleteModalOpen(true);
  }

  function handleCloseDeleteModal() {
    setIsDeleteModalOpen(false);
    setSelectedLabel(null);
  }

  async function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrorMessage("Label name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && selectedLabel) {
        await api.put(`/labels/${selectedLabel.id}`, formData);
      } else {
        await api.post("/labels", formData);
      }
      await fetchLabels();
      handleCloseFormModal();
      setErrorMessage(null);
    } catch {
      setErrorMessage(
        isEditing ? "Error updating label." : "Error creating label."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteLabel() {
    if (!selectedLabel) return;

    setIsSubmitting(true);
    try {
      await api.delete(`/labels/${selectedLabel.id}`);
      await fetchLabels();
      handleCloseDeleteModal();
      setErrorMessage(null);
    } catch {
      setErrorMessage("Error deleting label.");
      handleCloseDeleteModal();
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredLabels =
    filterType === "all"
      ? labels
      : labels.filter((label) => label.type === filterType);

  return (
    <>
      <GenericBreadCrumb
        items={[
          { type: "link", label: "Dashboard", to: "/" },
          { type: "text", label: "Labels" },
        ]}
      />

      <div className="m-4 flex flex-col items-start">
        <div className="w-full flex justify-between items-center mb-4">
          <GenericHeaderOne label="Labels" extraClassName="" />
        </div>

        <div className="w-full bg-white border-black border-1 rounded-lg p-6 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <label className="block text-black font-bold mb-2">
                Filter by Type
              </label>
              <select
                value={filterType}
                onChange={(e) =>
                  setFilterType(
                    e.target.value === "all" ? "all" : Number(e.target.value)
                  )
                }
                className="px-4 py-2 rounded bg-white text-black border border-gray-300 focus:outline-none focus:border-blue-400"
              >
                <option value="all">All Types</option>
                <option value={1}>Global</option>
                <option value={2}>Project</option>
                <option value={3}>Task</option>
              </select>
            </div>
            <GenericButton
              onClick={handleOpenCreateModal}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors w-auto h-auto mt-0"
            >
              + Add Label
            </GenericButton>
          </div>
        </div>

        {errorMessage && (
          <p className="text-sm text-red-200 font-bold mb-4">⚠️ {errorMessage}</p>
        )}

        <div className="w-full bg-white border-1 border-black rounded-lg overflow-hidden p-6">
          {isLoading ? (
            <p className="text-black">Loading labels...</p>
          ) : filteredLabels.length === 0 ? (
            <p className="text-black">
              {filterType === "all"
                ? "No labels found."
                : `No ${labelTypeMap[filterType as number]} labels found.`}
            </p>
          ) : (
            <div className="space-y-2">
              {filteredLabels.map((label) => (
                <div
                  key={label.id}
                  className="flex items-center justify-between bg-black text-white px-4 py-3 rounded"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded border-2 border-white"
                      style={{ backgroundColor: label.color }}
                    />
                    <span className="font-bold">{label.name}</span>
                    <span className="text-sm text-gray-300">
                      ({labelTypeMap[label.type]})
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <GenericButton
                      onClick={() => handleOpenEditModal(label)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white w-10 h-10 rounded transition-colors mt-0"
                    >
                      ✏️
                    </GenericButton>
                    <GenericButton
                      onClick={() => handleOpenDeleteModal(label)}
                      className="bg-red-600 hover:bg-red-700 text-white w-10 h-10 rounded transition-colors mt-0"
                    >
                      🗑️
                    </GenericButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isFormModalOpen}
        onRequestClose={handleCloseFormModal}
        className="bg-white border-black border-2 rounded-lg p-6 max-w-md mx-auto mt-20 outline-none"
        overlayClassName="fixed inset-0 bg-black/70 flex items-start justify-center overflow-y-auto"
      >
        <h2 className="text-2xl text-black font-bold mb-4">
          {isEditing ? "Edit Label" : "Create Label"}
        </h2>

        <form onSubmit={handleSubmitForm}>
          <div className="mb-4">
            <label className="block text-black font-medium mb-2">
              Label Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 rounded bg-white text-black border border-gray-300 focus:outline-none focus:border-blue-400"
              placeholder="Enter label name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-black font-medium mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: Number(e.target.value) })
              }
              className="w-full px-3 py-2 rounded bg-white text-black border border-gray-300 focus:outline-none focus:border-blue-400"
            >
              <option value={1}>Global</option>
              <option value={2}>Project</option>
              <option value={3}>Task</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-black font-medium mb-2">Color</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="w-16 h-10 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="flex-1 px-3 py-2 rounded bg-white text-black border border-gray-300 focus:outline-none focus:border-blue-400"
                placeholder="#FFFFFF"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleCloseFormModal}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:bg-gray-500"
            >
              {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleCloseDeleteModal}
        className="bg-white border-black border-2 rounded-lg p-6 max-w-md mx-auto mt-20 outline-none"
        overlayClassName="fixed inset-0 bg-black/70 flex items-start justify-center overflow-y-auto"
      >
        <h2 className="text-2xl text-black font-bold mb-4">Confirm Deletion</h2>
        <p className="text-black mb-6">
          Are you sure you want to delete the label "{selectedLabel?.name}"?
          This action cannot be undone.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCloseDeleteModal}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors disabled:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteLabel}
            disabled={isSubmitting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors disabled:bg-gray-500"
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </>
  );
}