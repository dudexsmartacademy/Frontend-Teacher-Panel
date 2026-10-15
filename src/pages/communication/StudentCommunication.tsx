import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Megaphone,
  MessageCircle,
  LifeBuoy,
  StickyNote,
  Plus,
  Search,
  Archive,
  RotateCcw,
  Trash2,
  Eye,
  Edit,
} from "lucide-react";

import { teacherAssignments } from "../../data/teacher/teacherData";
import DeleteModal from "../../components/DeleteModal";

type CommunicationType =
  | "Announcements"
  | "Support Requests"
  | "Class Discussion"
  | "Teacher Notes";

type CommunicationItem = {
  id: number;
  title: string;
  content: string;
  className: string;
  classId: string;
  subject: string;
  student?: string;
  status: string;
  date: string;
  archived?: boolean;
};

const initialAnnouncements: CommunicationItem[] = [
  {
    id: 1,
    title: "Python Assessment Reminder",
    content:
      "Python Fundamentals Assessment is scheduled for 10 September.",
    className: "AI & DS - Section B",
    classId: "1",
    subject: "Python",
    status: "Published",
    date: "2026-09-08",
  },
  {
    id: 2,
    title: "Data Structures Class Update",
    content:
      "Unit 1 revision will be covered in the upcoming class.",
    className: "AI & DS - Section A",
    classId: "2",
    subject: "Data Structures",
    status: "Published",
    date: "2026-09-08",
  },
];

const initialSupportRequests: CommunicationItem[] = [
  {
    id: 1,
    title: "Assessment Access Issue",
    content:
      "Student is unable to access the assigned assessment.",
    className: "AI & DS - Section B",
    classId: "1",
    subject: "Python",
    student: "Arun Kumar",
    status: "Open",
    date: "2026-09-08",
  },
  {
    id: 2,
    title: "Material Access Request",
    content:
      "Student requested access to the Python study material.",
    className: "AI & DS - Section B",
    classId: "1",
    subject: "Python",
    student: "Priya Sharma",
    status: "Resolved",
    date: "2026-09-07",
  },
];

const initialDiscussions: CommunicationItem[] = [
  {
    id: 1,
    title: "Python Functions Discussion",
    content:
      "Students are discussing function arguments and return values.",
    className: "AI & DS - Section B",
    classId: "1",
    subject: "Python",
    status: "Active",
    date: "2026-09-08",
  },
  {
    id: 2,
    title: "Data Structures Questions",
    content: "Discussion related to stacks and queues.",
    className: "AI & DS - Section A",
    classId: "2",
    subject: "Data Structures",
    status: "Active",
    date: "2026-09-07",
  },
];

const initialTeacherNotes: CommunicationItem[] = [
  {
    id: 1,
    title: "Follow-up Required",
    content:
      "Follow up with students having incomplete assessments.",
    className: "AI & DS - Section B",
    classId: "1",
    subject: "Python",
    status: "Private",
    date: "2026-09-08",
  },
  {
    id: 2,
    title: "Attendance Follow-up",
    content:
      "Review students with pending attendance corrections.",
    className: "CSE - Section A",
    classId: "3",
    subject: "Programming",
    status: "Private",
    date: "2026-09-07",
  },
];

const tabs: {
  label: CommunicationType;
  icon: ReactNode;
}[] = [
  {
    label: "Announcements",
    icon: <Megaphone size={18} />,
  },
  {
    label: "Support Requests",
    icon: <LifeBuoy size={18} />,
  },
  {
    label: "Class Discussion",
    icon: <MessageCircle size={18} />,
  },
  {
    label: "Teacher Notes",
    icon: <StickyNote size={18} />,
  },
];

export default function StudentCommunication() {
  const [activeTab, setActiveTab] =
    useState<CommunicationType>("Announcements");

  const [search, setSearch] = useState("");

  const [showArchived, setShowArchived] = useState(false);

  const [announcements, setAnnouncements] = useState(
    initialAnnouncements
  );

  const [supportRequests, setSupportRequests] = useState(
    initialSupportRequests
  );

  const [discussions, setDiscussions] = useState(
    initialDiscussions
  );

  const [teacherNotes, setTeacherNotes] = useState(
    initialTeacherNotes
  );

  const getItems = (): CommunicationItem[] => {
    switch (activeTab) {
      case "Announcements":
        return announcements;

      case "Support Requests":
        return supportRequests;

      case "Class Discussion":
        return discussions;

      case "Teacher Notes":
        return teacherNotes;

      default:
        return [];
    }
  };

  const setItems = (
    items: CommunicationItem[]
  ) => {
    switch (activeTab) {
      case "Announcements":
        setAnnouncements(items);
        break;

      case "Support Requests":
        setSupportRequests(items);
        break;

      case "Class Discussion":
        setDiscussions(items);
        break;

      case "Teacher Notes":
        setTeacherNotes(items);
        break;
    }
  };

  const authorizedItems = useMemo(() => {
    const activeAssignments = teacherAssignments.filter(
      (assignment) => assignment.active
    );

    return getItems().filter((item) =>
      activeAssignments.some(
        (assignment) =>
          assignment.classId === item.classId &&
          assignment.subject === item.subject
      )
    );
  }, [
    activeTab,
    announcements,
    supportRequests,
    discussions,
    teacherNotes,
  ]);

  const filteredItems = authorizedItems.filter((item) => {
    if (!showArchived && item.archived) {
      return false;
    }

    if (showArchived && !item.archived) {
      return false;
    }

    const value = `${item.title} ${item.content} ${
      item.className
    } ${item.subject} ${item.student ?? ""}`.toLowerCase();

    return value.includes(search.toLowerCase());
  });

  const handleArchive = (id: number) => {
    const item = getItems().find(
      (communication) => communication.id === id
    );

    if (!item) {
      return;
    }

    const authorized = teacherAssignments.some(
      (assignment) =>
        assignment.active &&
        assignment.classId === item.classId &&
        assignment.subject === item.subject
    );

    if (!authorized) {
      alert(
        "You are not authorized to modify this communication."
      );
      return;
    }

    const updatedItems = getItems().map((communication) =>
      communication.id === id
        ? {
            ...communication,
            archived: true,
            status: "Archived",
          }
        : communication
    );

    setItems(updatedItems);

    console.log("Communication archived:", item);
  };

  const handleRestore = (id: number) => {
    const item = getItems().find(
      (communication) => communication.id === id
    );

    if (!item) {
      return;
    }

    const authorized = teacherAssignments.some(
      (assignment) =>
        assignment.active &&
        assignment.classId === item.classId &&
        assignment.subject === item.subject
    );

    if (!authorized) {
      alert(
        "You are not authorized to modify this communication."
      );
      return;
    }

    const restoredStatus =
      item.status === "Archived"
        ? item.student
          ? "Open"
          : "Published"
        : item.status;

    const updatedItems = getItems().map((communication) =>
      communication.id === id
        ? {
            ...communication,
            archived: false,
            status: restoredStatus,
          }
        : communication
    );

    setItems(updatedItems);

    console.log("Communication restored:", item);
  };

  const [commToDelete, setCommToDelete] = useState<CommunicationItem | null>(null);

  const requestDelete = (id: number) => {
    const item = getItems().find(
      (communication) => communication.id === id
    );

    if (!item) {
      return;
    }

    const authorized = teacherAssignments.some(
      (assignment) =>
        assignment.active &&
        assignment.classId === item.classId &&
        assignment.subject === item.subject
    );

    if (!authorized) {
      alert(
        "You are not authorized to delete this communication."
      );
      return;
    }

    setCommToDelete(item);
  };

  const handleConfirmDelete = () => {
    if (!commToDelete) return;

    const updatedItems = getItems().filter(
      (communication) => communication.id !== commToDelete.id
    );

    setItems(updatedItems);
    setCommToDelete(null);
  };

  const handleCreate = () => {
    window.location.href = `/communication/create?type=${encodeURIComponent(
      activeTab
    )}`;
  };

  const getIcon = () => {
    switch (activeTab) {
      case "Announcements":
        return <Megaphone size={20} />;

      case "Support Requests":
        return <LifeBuoy size={20} />;

      case "Class Discussion":
        return <MessageCircle size={20} />;

      case "Teacher Notes":
        return <StickyNote size={20} />;

      default:
        return <MessageCircle size={20} />;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Student Communication
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage controlled communication with students.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="flex w-fit items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Plus size={18} />

          Create{" "}
          {activeTab === "Teacher Notes"
            ? "Note"
            : activeTab}
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => {
                setActiveTab(tab.label);
                setSearch("");
              }}
              className={`flex items-center gap-2 border-b-2 px-5 py-4 text-sm font-medium ${
                activeTab === tab.label
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Archive Filter */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowArchived(!showArchived)}
            className={`flex w-fit items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium ${
              showArchived
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Archive size={17} />

            {showArchived
              ? "Showing Archived"
              : "Show Archived"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
            <MessageCircle
              size={40}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-sm text-gray-500">
              No {showArchived ? "archived " : ""}
              {activeTab.toLowerCase()} found.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                {/* Communication Information */}
                <div className="flex min-w-0 gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                    {getIcon()}
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900">
                      {item.title}
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {item.content}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="rounded-md bg-gray-100 px-2 py-1">
                        {item.className}
                      </span>

                      <span className="rounded-md bg-gray-100 px-2 py-1">
                        {item.subject}
                      </span>

                      {item.student && (
                        <span className="rounded-md bg-gray-100 px-2 py-1">
                          Student: {item.student}
                        </span>
                      )}

                      <span className="rounded-md bg-gray-100 px-2 py-1">
                        {item.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex flex-col gap-3 lg:items-end">
                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                      item.status === "Open"
                        ? "bg-yellow-50 text-yellow-700"
                        : item.status === "Resolved"
                          ? "bg-green-50 text-green-700"
                          : item.status === "Active"
                            ? "bg-blue-50 text-blue-700"
                            : item.status === "Private"
                              ? "bg-gray-100 text-gray-700"
                              : item.status === "Archived"
                                ? "bg-gray-200 text-gray-600"
                                : "bg-green-50 text-green-700"
                    }`}
                  >
                    {item.status}
                  </span>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/communication/${item.id}`}
                      className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Eye size={15} />
                      View
                    </Link>

                    {!item.archived &&
                      item.status !== "Private" && (
                        <Link
                          to={`/communication/${item.id}/edit`}
                          className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <Edit size={15} />
                          Edit
                        </Link>
                      )}

                    {!item.archived ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleArchive(item.id)
                        }
                        className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <Archive size={15} />
                        Archive
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          handleRestore(item.id)
                        }
                        className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <RotateCcw size={15} />
                        Restore
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        requestDelete(item.id)
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!commToDelete}
        onClose={() => setCommToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Communication"
        itemName={commToDelete ? `${commToDelete.title} (${commToDelete.className})` : undefined}
        message="Are you sure you want to delete this communication entry? This action cannot be undone."
      />
    </div>
  );
}