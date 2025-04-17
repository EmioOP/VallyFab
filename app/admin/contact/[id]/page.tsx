"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
// import { toast } from "react-hot-toast";
import { useParams } from "next/navigation";
import { useNotification } from "@/components/Notification";


interface Contact {
  _id: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
  isContactedByTeam: boolean;
}

export default function SingleContactPage() {
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  // Get ID from URL
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch(`/api/contacts/${id}`);

        if (response.status === 401) {
          console.error("Unauthorized access");
          router.push("/login");
          return;
        }

        if (response.status === 404) {
          setError("Contact not found");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch contact");
        }

        const data = await response.json();
        setContact(data.contact);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch contact"
        );
        console.error("Failed to load contact");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContact();
    }
  }, [id, router]);

  const handleUpdateContactStatus = async () => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("Unable to edit contact status");
      }

      if (contact) {
        setContact({ ...contact, isContactedByTeam: true });
      }
      showNotification("Update successful!", "success")
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="h-12 w-12 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!contact) {
    return null;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="mb-6 text-gray-600 hover:text-gray-900 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to List
      </button>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="flex justify-between px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Contact Details
          </h3>
          <button
            className="bg-secondary p-1 rounded"
            onClick={handleUpdateContactStatus}
          >
            Update Contacted Client
          </button>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {contact.name}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {contact.email}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(contact.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Message</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                {contact.content}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Contacted By Team
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                {contact.isContactedByTeam ? "Yes" : "No"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
