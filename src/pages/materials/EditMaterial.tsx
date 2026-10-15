import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ArrowLeft, FileText, X } from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import { teacherAssignments } from "../../data/teacher/teacherData";
import CustomSelect from "../../components/CustomSelect";

type MaterialType =
  | "PDF"
  | "Video"
  | "Document"
  | "Presentation"
  | "Link"
  | "Assignment";

type Material = {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  classId: string;
  className: string;
  subject: string;
  createdAt: string;
  status: "Published" | "Draft" | "Archived";
  url?: string;
  attachments?: string[];
};

const materials: Material[] = [
  {
    id: "M001",
    title: "Python Basics Notes",
    description:
      "Complete notes covering Python variables, data types and basic syntax.",
    type: "PDF",
    classId: "1",
    className: "AI & DS - Section B",
    subject: "Python",
    createdAt: "2026-09-05",
    status: "Published",
    attachments: ["python-basics-notes.pdf"],
  },
  {
    id: "M002",
    title: "Python Functions Video",
    description:
      "Video lesson explaining Python functions and function parameters.",
    type: "Video",
    classId: "1",
    className: "AI & DS - Section B",
    subject: "Python",
    createdAt: "2026-09-06",
    status: "Published",
    url: "https://example.com/python-functions",
  },
  {
    id: "M003",
    title: "Arrays Practice Assignment",
    description:
      "Practice assignment covering arrays and array operations.",
    type: "Assignment",
    classId: "2",
    className: "AI & DS - Section A",
    subject: "Data Structures",
    createdAt: "2026-09-07",
    status: "Draft",
    attachments: ["arrays-practice.pdf"],
  },
];

export default function EditMaterial() {
  const { id } = useParams();
  const navigate = useNavigate();

  const material = materials.find(
    (item) => item.id === id
  );

  const authorized = material
    ? teacherAssignments.some(
        (assignment) =>
          assignment.active &&
          assignment.classId === material.classId &&
          assignment.subject === material.subject
      )
    : false;

  const [title, setTitle] = useState(
    material?.title ?? ""
  );

  const [description, setDescription] = useState(
    material?.description ?? ""
  );

  const [type, setType] = useState<MaterialType>(
    material?.type ?? "PDF"
  );

  const [url, setUrl] = useState(
    material?.url ?? ""
  );

  const [attachments, setAttachments] = useState<
    string[]
  >(material?.attachments ?? []);

  const className =
    material?.className ?? "";

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (!files) {
      return;
    }

    const selectedFiles = Array.from(files);

    const newFiles = selectedFiles.map(
      (file) => file.name
    );

    setAttachments((current) => [
      ...current,
      ...newFiles,
    ]);

    event.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((current) =>
      current.filter(
        (_, itemIndex) => itemIndex !== index
      )
    );
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!material) {
      return;
    }

    if (!authorized) {
      alert(
        "You are not authorized to edit this material."
      );
      return;
    }

    if (material.status === "Archived") {
      alert("Archived material cannot be edited.");
      return;
    }

    if (
      (type === "Link" || type === "Video") &&
      !url.trim()
    ) {
      alert("Please enter the material URL.");
      return;
    }

    if (
      type !== "Link" &&
      type !== "Video" &&
      attachments.length === 0
    ) {
      alert("Please upload a material file.");
      return;
    }

    const updatedMaterial = {
      ...material,
      title,
      description,
      type,
      url,
      attachments,
    };

    console.log(
      "Material updated:",
      updatedMaterial
    );

    navigate(`/materials/${material.id}`);
  };

  if (!material) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Material Not Found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            The requested material does not exist.
          </p>

          <Link
            to="/materials"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
          >
            <ArrowLeft size={16} />
            Back to Materials
          </Link>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
          <h1 className="text-xl font-semibold text-red-700">
            Access Denied
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            You are not authorized to edit this material.
          </p>

          <Link
            to="/materials"
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
          >
            <ArrowLeft size={16} />
            Back to Materials
          </Link>
        </div>
      </div>
    );
  }

  if (material.status === "Archived") {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Material Archived
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Archived material cannot be edited.
          </p>

          <Link
            to={`/materials/${material.id}`}
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
          >
            <ArrowLeft size={16} />
            Back to Material
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          to={`/materials/${material.id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Material
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Edit Material
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update the learning material details.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl rounded-xl border border-gray-200 bg-white p-6"
      >
        <div className="grid gap-5 md:grid-cols-2">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Material Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>

          {/* Class */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Class
            </label>

            <input
              type="text"
              value={className}
              disabled
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600"
            />

            <p className="mt-1 text-xs text-gray-500">
              Class assignment cannot be changed.
            </p>
          </div>

          {/* Subject */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Subject
            </label>

            <input
              type="text"
              value={material.subject}
              disabled
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600"
            />

            <p className="mt-1 text-xs text-gray-500">
              Subject assignment cannot be changed.
            </p>
          </div>

          {/* Material Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Material Type
            </label>

            <CustomSelect
              value={type}
              onChange={(val) => setType(val as MaterialType)}
              options={[
                { value: "PDF", label: "PDF" },
                { value: "Video", label: "Video" },
                { value: "Document", label: "Document" },
                { value: "Presentation", label: "Presentation" },
                { value: "Link", label: "Link" },
                { value: "Assignment", label: "Assignment" },
              ]}
            />
          </div>

          {/* URL */}
          {(type === "Link" || type === "Video") && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Material URL
              </label>

              <input
                type="url"
                value={url}
                onChange={(e) =>
                  setUrl(e.target.value)
                }
                placeholder="https://..."
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
              />
            </div>
          )}

          {/* Description */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={5}
              required
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>

          {/* Attachments */}
          {type !== "Link" && type !== "Video" && (
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Material Files
              </label>

              <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                <FileText
                  size={30}
                  className="mx-auto text-gray-400"
                />

                <p className="mt-2 text-sm font-medium text-gray-700">
                  Add Material File
                </p>

                <label className="mt-4 inline-block cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Choose File

                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachments.map(
                    (attachment, index) => (
                      <div
                        key={`${attachment}-${index}`}
                        className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-2.5 sm:p-3 min-w-0 max-w-full"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
                          <FileText
                            size={18}
                            className="shrink-0 text-gray-500"
                          />

                          <span className="truncate text-xs sm:text-sm font-medium text-gray-800 min-w-0 flex-1" title={attachment}>
                            {attachment}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeAttachment(index)
                          }
                          className="shrink-0 p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                          title="Remove"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5">
          <Link
            to={`/materials/${material.id}`}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}