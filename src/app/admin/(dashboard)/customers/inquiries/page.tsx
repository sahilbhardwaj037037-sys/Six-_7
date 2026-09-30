export const dynamic = "force-dynamic";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { updateInquiryStatus, deleteInquiry } from "@/lib/actions/admin-inquiries";
import Link from "next/link";
import { Mail, Trash2, CheckCircle, Clock } from "lucide-react";

export default async function AdminInquiriesPage() {
  await requireAdmin();

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Customer Inquiries</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and respond to dispatches from the contact concierge.</p>
        </div>
        <Link
          href="/admin/customers"
          className="text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 px-4 py-2 rounded-sm shadow-sm transition-colors"
        >
          ← Back to Customers
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        {inquiries.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">
            No customer inquiries received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-gray-700 font-semibold">
                <tr>
                  <th className="px-6 py-3">Sender</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Order Ref</th>
                  <th className="px-6 py-3">Message</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{inq.fullName}</div>
                      <a href={`mailto:${inq.email}`} className="text-xs text-gray-500 hover:underline flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {inq.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 uppercase font-mono">
                        {inq.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-600">
                      {inq.orderNumber || "—"}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-gray-700" title={inq.message}>
                      {inq.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {inq.status === "RESOLVED" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-200 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" /> Resolved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-sm border border-amber-200 font-medium">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                      {new Date(inq.createdAt).toLocaleDateString()} {new Date(inq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <form action={async () => {
                        "use server";
                        const nextStatus = inq.status === "RESOLVED" ? "PENDING" : "RESOLVED";
                        await updateInquiryStatus(inq.id, nextStatus);
                      }} className="inline">
                        <button
                          type="submit"
                          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2.5 py-1 rounded-sm transition-colors"
                        >
                          {inq.status === "RESOLVED" ? "Mark Pending" : "Resolve"}
                        </button>
                      </form>
                      <form action={async () => {
                        "use server";
                        await deleteInquiry(inq.id);
                      }} className="inline">
                        <button
                          type="submit"
                          onClick={(e) => {
                            if (!confirm("Delete this inquiry?")) e.preventDefault();
                          }}
                          className="text-xs text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-sm transition-colors"
                        >
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
