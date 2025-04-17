
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ContactsTable from "@/components/ContactsTable";
import { Spinner } from "@/components/ui/spinner"; // Assume you have a spinner component
// import { toast } from "react-hot-toast"; // Optional for notifications

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function AdminContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("/api/contacts");
        
        if (response.status === 401) {
          console.error("Unauthorized access");
          return router.push("/login");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }

        const data = await response.json();
        setContacts(data.contacts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch contacts");
        console.error("Failed to load contacts");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [router]);

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

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Contact Enquiries</h1>
      </div>
      
      {contacts.length > 0 ? (
        <ContactsTable contacts={contacts} />
      ) : (
        <div className="text-gray-500 mt-4">No contact enquiries found.</div>
      )}
    </div>
  );
}
