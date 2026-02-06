import { useEffect, useState } from "react";
import Header from "../components/Header";
import Table from "../components/Table";
import ComposeEmailModal from "../components/ComposeEmailModal";
import { getScheduledEmails, getSentEmails } from "../api/email.api";
import StatusBadge from "../components/StatusBadge";

export default function Dashboard() {
    const [scheduled, setScheduled] = useState([]);
    const [sent, setSent] = useState([]);
    const [tab, setTab] = useState("scheduled");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        const s1 = await getScheduledEmails();
        const s2 = await getSentEmails();
        setScheduled(s1.data);
        setSent(s2.data);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const scheduledColumns = [
        { 
            key: "toEmail", 
            label: "Recipient",
            render: (row) => (
                <div className="font-medium text-gray-900">
                    {row.email || "—"}
                </div>
            )
        },
        {
            key: "subject",
            label: "Subject",
            render: (row) => (
                <div className="text-gray-700 max-w-md truncate">
                    {row.subject || "—"}
                </div>
            )
        },
        {
            key: "scheduledAt",
            label: "Scheduled Time",
            render: (row) => (
                <div className="text-gray-600 text-sm">
                    {new Date(row.scheduledAt).toLocaleString()}
                </div>
            )
        },
        {
            key: "status",
            label: "Status",
            render: (row) => <StatusBadge status={row.status} />,
        },
    ];

    const sentColumns = [
        { 
            key: "toEmail", 
            label: "Recipient",
            render: (row) => (
                <div className="font-medium text-gray-900">
                    {row.email || "—"}
                </div>
            )
        },
        {
            key: "subject",
            label: "Subject",
            render: (row) => (
                <div className="text-gray-700 max-w-md truncate">
                    {row.subject || "—"}
                </div>
            )
        },
        {
            key: "sentAt",
            label: "Sent Time",
            render: (row) => (
                <div className="text-gray-600 text-sm">
                    {row.sentAt ? new Date(row.sentAt).toLocaleString() : "—"}
                </div>
            )
        },
        {
            key: "status",
            label: "Status",
            render: (row) => <StatusBadge status={row.status} />,
        },
        {
            key: "error",
            label: "Error",
            render: (row) =>
                row.error ? (
                    <div className="text-red-600 text-sm font-medium max-w-xs truncate">
                        {row.error}
                    </div>
                ) : (
                    <span className="text-gray-400">—</span>
                ),
        },
    ];

    const activeData = tab === "scheduled" ? scheduled : sent;
    const activeColumns = tab === "scheduled" ? scheduledColumns : sentColumns;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="p-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                                Email Dashboard
                            </h1>
                            <p className="text-gray-600 text-base">
                                Monitor and manage your email campaigns
                            </p>
                        </div>

                        <button
                            onClick={() => setOpen(true)}
                            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded font-medium shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2.5"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Compose Email
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 font-medium mb-1.5 uppercase tracking-wide">
                                        Scheduled
                                    </p>
                                    <p className="text-3xl font-semibold text-gray-900">
                                        {scheduled.length}
                                    </p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded">
                                    <svg
                                        className="w-7 h-7 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 font-medium mb-1.5 uppercase tracking-wide">
                                        Sent
                                    </p>
                                    <p className="text-3xl font-semibold text-gray-900">
                                        {sent.length}
                                    </p>
                                </div>
                                <div className="bg-green-50 p-3 rounded">
                                    <svg
                                        className="w-7 h-7 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 font-medium mb-1.5 uppercase tracking-wide">
                                        Total
                                    </p>
                                    <p className="text-3xl font-semibold text-gray-900">
                                        {scheduled.length + sent.length}
                                    </p>
                                </div>
                                <div className="bg-purple-50 p-3 rounded">
                                    <svg
                                        className="w-7 h-7 text-purple-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setTab("scheduled")}
                            className={`flex-1 px-8 py-4 text-sm font-medium transition-all duration-150 relative ${
                                tab === "scheduled"
                                    ? "text-gray-900 bg-white"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        >
                            {tab === "scheduled" && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                            )}
                            <div className="flex items-center justify-center gap-2.5">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Scheduled
                                <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-sm text-xs font-semibold ml-1">
                                    {scheduled.length}
                                </span>
                            </div>
                        </button>

                        <button
                            onClick={() => setTab("sent")}
                            className={`flex-1 px-8 py-4 text-sm font-medium transition-all duration-150 relative ${
                                tab === "sent"
                                    ? "text-gray-900 bg-white"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        >
                            {tab === "sent" && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                            )}
                            <div className="flex items-center justify-center gap-2.5">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Sent
                                <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-sm text-xs font-semibold ml-1">
                                    {sent.length}
                                </span>
                            </div>
                        </button>
                    </div>

                    {/* Table Content */}
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-gray-900"></div>
                                    <p className="text-sm text-gray-500">Loading emails...</p>
                                </div>
                            </div>
                        ) : (
                            <Table
                                columns={activeColumns}
                                data={activeData}
                                emptyText={
                                    tab === "scheduled"
                                        ? "No scheduled emails. Click 'Compose Email' to create one."
                                        : "No sent emails yet."
                                }
                            />
                        )}
                    </div>
                </div>
            </main>

            <ComposeEmailModal
                isOpen={open}
                onClose={() => {
                    setOpen(false);
                    loadData();
                }}
            />
        </div>
    );
}