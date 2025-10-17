import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { GenericButton } from "../Forms/GenericButton";

type GenericMarkdownRenderFieldProps = {
  initialContent: string;
  onSave: (content: string) => Promise<void>;
  isReadOnly?: boolean;
  minHeight?: string;
  maxHeight?: string;
};

export function GenericMarkdownRenderField({
  initialContent,
  onSave,
  isReadOnly = false,
  minHeight = "min-h-64",
  maxHeight = "max-h-96",
}: GenericMarkdownRenderFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleEdit() {
    setIsEditing(true);
    setShowPreview(false);
    setEditedContent(initialContent);
  }

  function handleCancel() {
    setIsEditing(false);
    setShowPreview(false);
    setEditedContent(initialContent);
    setErrorMessage(null);
  }

  async function handleSave() {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      await onSave(editedContent);
      setIsEditing(false);
      setShowPreview(false);
    } catch (error) {
      setErrorMessage("Error saving content");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="bg-white border-black border-1 rounded-lg p-6 mb-4 h-full">
      <div className="flex justify-between items-center mb-3">
        {!isEditing ? (
          <div
            className={`w-full ${minHeight} task-content-markdown bg-gray-50 border border-gray-200 rounded p-4 ${maxHeight} overflow-y-auto prose prose-sm max-w-none`}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {initialContent}
            </ReactMarkdown>
          </div>
        ) : showPreview ? (
          <div
            className={`w-full ${minHeight} bg-gray-50 border border-gray-200 rounded p-4 ${maxHeight} overflow-y-auto prose prose-sm max-w-none`}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {editedContent}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className={`w-full ${minHeight} p-3 rounded bg-gray-50 text-black font-mono text-sm border border-gray-300 focus:outline-none focus:border-blue-400`}
            placeholder="Enter markdown content..."
          />
        )}
      </div>

      {errorMessage && (
        <p className="text-sm text-red-500 font-bold mb-2">⚠️ {errorMessage}</p>
      )}

      {!isReadOnly && (
        <>
          {!isEditing ? (
            <GenericButton
              onClick={handleEdit}
              extraClassName="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors w-auto h-auto mt-0"
            >
              Edit Content
            </GenericButton>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="bg-blue-500 hover:cursor-pointer hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                {showPreview ? "Edit" : "Preview"}
              </button>
              <GenericButton
                onClick={handleSave}
                disabled={isSaving}
                extraClassName="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors w-auto h-auto mt-0 disabled:bg-gray-500"
              >
                {isSaving ? "Saving..." : "Save"}
              </GenericButton>
              <button
                onClick={handleCancel}
                className="bg-red-500 hover:bg-red-400 hover:cursor-pointer text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}