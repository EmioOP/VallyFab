"use client";
import { useRouter } from "next/navigation";

interface Contact {
  _id: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
}

interface ContactsTableProps {
  contacts: Contact[];
}

export default function ContactsTable({ contacts }: ContactsTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Name
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Email
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Message
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Date
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {contacts.map((contact) => (
            <tr
              key={contact._id}
              onClick={(contactId) => {
                router.push(`/admin/contact/${contact._id}`);
              }}
              className="cursor-pointer"
            >
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                {contact.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                {contact.email}
              </td>
              <td className="px-3 py-4 text-sm text-gray-600 max-w-xs">
                {contact.content}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {new Date(contact.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
