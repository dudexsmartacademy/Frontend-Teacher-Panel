import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Archive,
  Edit,
  Eye,
  FileText,
  Link as LinkIcon,
  PlayCircle,
  Plus,
  Presentation,
  Search,
  RotateCcw,
  ClipboardList,
} from "lucide-react";
import { teacherAssignments } from "../../data/teacher/teacherData";
import CustomSelect from "../../components/CustomSelect";

type MaterialType =
  | "PDF"
  | "Video"
  | "Document"
  | "Presentation"
  | "Link"
  | "Assignment";

type MaterialStatus =
  | "Published"
  | "Draft"
  | "Archived";

type Material = {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  classId: string;
  className: string;
  subject: string;
  createdAt: string;
  status: MaterialStatus;
};

const initialMaterials: Material[] = [
  {
    id: "M001",
    title: "Python Basics Notes",
    description:
      "Introduction to Python programming and basic syntax.",
    type: "PDF",
    classId: "1",
    className: "AI & DS - Section B",
    subject: "Python",
    createdAt: "2026-09-05",
    status: "Published",
  },
  {
    id: "M002",
    title: "Python Functions Video",
    description:
      "Video explanation of Python functions and parameters.",
    type: "Video",
    classId: "1",
    className: "AI & DS - Section B",
    subject: "Python",
    createdAt: "2026-09-06",
    status: "Published",
  },
  {
    id: "M003",
    title: "Arrays Practice Assignment",
    description:
      "Practice problems based on arrays and array operations.",
    type: "Assignment",
    classId: "1",
    className: "AI & DS - Section B",
    subject: "Data Structures",
    createdAt: "2026-09-07",
    status: "Draft",
  },
];

export default function Materials() {
  const [materials, setMaterials] =
    useState<Material[]>(initialMaterials);

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] =
    useState<"All" | MaterialType>("All");

  const [statusFilter, setStatusFilter] =
    useState<"All" | MaterialStatus>("All");

  const [showArchived, setShowArchived] =
    useState(false);

  const authorizedClassIds = useMemo(
    () =>
      teacherAssignments
        .filter((assignment) => assignment.active)
        .map((assignment) => assignment.classId),
    []
  );

  const authorizedMaterials = useMemo(
    () =>
      materials.filter((material) =>
        authorizedClassIds.includes(material.classId)
      ),
    [materials, authorizedClassIds]
  );

  const filteredMaterials = authorizedMaterials.filter(
    (material) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        material.title
          .toLowerCase()
          .includes(searchText) ||
        material.description
          .toLowerCase()
          .includes(searchText) ||
        material.subject
          .toLowerCase()
          .includes(searchText) ||
        material.className
          .toLowerCase()
          .includes(searchText);

      const matchesType =
        typeFilter === "All" ||
        material.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" ||
        material.status === statusFilter;

      const matchesArchived = showArchived
        ? material.status === "Archived"
        : material.status !== "Archived";

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesArchived
      );
    }
  );

  const archiveMaterial = (id: string) => {
    const material = materials.find(
      (item) => item.id === id
    );

    if (!material) {
      return;
    }

    const authorized = teacherAssignments.some(
      (assignment) =>
        assignment.active &&
        assignment.classId === material.classId &&
        assignment.subject === material.subject
    );

    if (!authorized) {
      alert(
        "You are not authorized to modify this material."
      );
      return;
    }

    setMaterials((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: "Archived" }
          : item
      )
    );
  };

  const restoreMaterial = (id: string) => {
    const material = materials.find(
      (item) => item.id === id
    );

    if (!material) {
      return;
    }

    const authorized = teacherAssignments.some(
      (assignment) =>
        assignment.active &&
        assignment.classId === material.classId &&
        assignment.subject === material.subject
    );

    if (!authorized) {
      alert(
        "You are not authorized to modify this material."
      );
      return;
    }

    setMaterials((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: "Draft" }
          : item
      )
    );
  };

  const getMaterialIcon = (type: MaterialType) => {
    switch (type) {
      case "PDF":
        return <FileText size={18} />;

      case "Video":
        return <PlayCircle size={18} />;

      case "Document":
        return <FileText size={18} />;

      case "Presentation":
        return <Presentation size={18} />;

      case "Link":
        return <LinkIcon size={18} />;

      case "Assignment":
        return <ClipboardList size={18} />;

      default:
        return <FileText size={18} />;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Learning Materials
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage materials for your authorized classes and subjects.
          </p>
        </div>

        <Link
          to="/materials/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Plus size={18} />
          Add Material
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-5 grid gap-3 md:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search materials..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 outline-none focus:border-gray-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:items-center gap-3">
          <div className="w-full md:w-48">
            <CustomSelect
              value={typeFilter}
              onChange={(val) => setTypeFilter(val as "All" | MaterialType)}
              options={[
                { value: "All", label: "All Material Types" },
                { value: "PDF", label: "PDF" },
                { value: "Video", label: "Video" },
                { value: "Document", label: "Document" },
                { value: "Presentation", label: "Presentation" },
                { value: "Link", label: "Link" },
                { value: "Assignment", label: "Assignment" },
              ]}
            />
          </div>

          <div className="w-full md:w-48">
            <CustomSelect
              value={statusFilter}
              onChange={(val) => setStatusFilter(val as "All" | MaterialStatus)}
              options={[
                { value: "All", label: "All Status" },
                { value: "Published", label: "Published" },
                { value: "Draft", label: "Draft" },
                { value: "Archived", label: "Archived" },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mb-5">
        <button
          type="button"
          onClick={() =>
            setShowArchived((current) => !current)
          }
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {showArchived ? (
            <RotateCcw size={17} />
          ) : (
            <Archive size={17} />
          )}

          {showArchived
            ? "Show Active Materials"
            : "Show Archived Materials"}
        </button>
      </div>

      {/* Materials */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                  Material
                </th>

                <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                  Type
                </th>

                <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                  Class
                </th>

                <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                  Subject
                </th>

                <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                  Created
                </th>

                <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>

                <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map((material) => (
                  <tr
                    key={material.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {material.title}
                        </p>

                        <p className="mt-1 max-w-xs text-xs text-gray-500">
                          {material.description}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        {getMaterialIcon(material.type)}
                        {material.type}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {material.className}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {material.subject}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {material.createdAt}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          material.status === "Published"
                            ? "bg-green-100 text-green-700"
                            : material.status === "Draft"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {material.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/materials/${material.id}`}
                          title="View"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Eye size={17} />
                        </Link>

                        {material.status !==
                          "Archived" && (
                          <Link
                            to={`/materials/${material.id}/edit`}
                            title="Edit"
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Edit size={17} />
                          </Link>
                        )}

                        {material.status !==
                        "Archived" ? (
                          <button
                            type="button"
                            title="Archive"
                            onClick={() =>
                              archiveMaterial(
                                material.id
                              )
                            }
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Archive size={17} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            title="Restore"
                            onClick={() =>
                              restoreMaterial(
                                material.id
                              )
                            }
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <RotateCcw size={17} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-sm text-gray-500"
                  >
                    No learning materials found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}