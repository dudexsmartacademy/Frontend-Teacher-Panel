import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, X } from "lucide-react";
import { teacherAssignments } from "../../data/teacher/teacherData";
import CustomSelect from "../../components/CustomSelect";

type MaterialType =
  | "PDF"
  | "Video"
  | "Document"
  | "Presentation"
  | "Link"
  | "Assignment";

type Attachment = {
  name: string;
  type: string;
  size: number;
};

export default function CreateMaterial() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState<MaterialType>("PDF");
  const [url, setUrl] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const authorizedAssignments = useMemo(
    () =>
      teacherAssignments.filter(
        (assignment) => assignment.active
      ),
    []
  );

  const selectedClassAssignments = useMemo(
    () =>
      authorizedAssignments.filter(
        (assignment) => assignment.classId === classId
      ),
    [authorizedAssignments, classId]
  );

  const subjects = useMemo(
    () => [
      ...new Set(
        selectedClassAssignments.map(
          (assignment) => assignment.subject
        )
      ),
    ],
    [selectedClassAssignments]
  );

  const handleClassChange = (value: string) => {
    setClassId(value);
    setSubject("");
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (!files) {
      return;
    }

    const selectedFiles = Array.from(files);

    const newAttachments: Attachment[] =
      selectedFiles.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
      }));

    setAttachments(newAttachments);

    event.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((current) =>
      current.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const authorized = authorizedAssignments.some(
      (assignment) =>
        assignment.classId === classId &&
        assignment.subject === subject
    );

    if (!authorized) {
      alert(
        "You are not authorized to create material for this class and subject."
      );
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

    const material = {
      title,
      description,
      classId,
      subject,
      type,
      url,
      attachments,
      status: "Published",
      createdAt: new Date().toISOString(),
    };

    console.log("Material created:", material);

    navigate("/materials");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/materials"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Materials
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Add Material
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Add learning material for an authorized class and subject.
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
              placeholder="Enter material title"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>

          {/* Class */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Class
            </label>

            <CustomSelect
              value={classId}
              onChange={(val) => handleClassChange(val)}
              placeholder="Select Class"
              options={[
                ...new Map(
                  authorizedAssignments.map((assignment) => [
                    assignment.classId,
                    assignment,
                  ])
                ).values(),
              ].map((assignment) => ({
                value: assignment.classId,
                label: assignment.className,
              }))}
            />
          </div>

          {/* Subject */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Subject
            </label>

            <CustomSelect
              value={subject}
              onChange={(val) => setSubject(val)}
              placeholder="Select Subject"
              disabled={!classId}
              options={subjects.map((item) => ({
                value: item,
                label: item,
              }))}
            />
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
              placeholder="Enter material description"
              rows={5}
              required
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>

          {/* File Upload */}
          {type !== "Link" && type !== "Video" && (
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Material File
              </label>

              <div className="rounded-lg border-2 border-dashed border-gray-300 p-6">
                <div className="text-center">
                  <FileText
                    size={30}
                    className="mx-auto text-gray-400"
                  />

                  <p className="mt-2 text-sm font-medium text-gray-700">
                    Upload material
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    PDF, document, presentation or assignment file
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
              </div>

              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachments.map(
                    (attachment, index) => (
                      <div
                        key={`${attachment.name}-${index}`}
                        className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-2.5 sm:p-3 min-w-0 max-w-full"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
                          <FileText
                            size={18}
                            className="shrink-0 text-gray-500"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs sm:text-sm font-medium text-gray-800" title={attachment.name}>
                              {attachment.name}
                            </p>

                            <p className="text-[11px] sm:text-xs text-gray-500">
                              {(
                                attachment.size / 1024
                              ).toFixed(1)}{" "}
                              KB
                            </p>
                          </div>
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
            to="/materials"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Publish Material
          </button>
        </div>
      </form>
    </div>
  );
}