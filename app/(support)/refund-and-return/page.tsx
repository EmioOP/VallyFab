// app/policies/refunds-returns/page.tsx

export default function RefundsReturnsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Returns & Refunds Policy
        </h1>

        {/* Full introductory paragraph */}
        <p className="text-gray-600 mb-8">
          At Vally Fabrics and Fashion, we want you to love your purchase! If
          for any reason you're not completely satisfied, we're here to help.
          Please review our refund and return policy below:
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Refunds</h2>
          <div className="text-gray-600 space-y-4">
            <p>
              We offer a 7-day refund policy for purchases. Returned items must
              be received by us within 7 days of delivery, in new, unused
              condition, with all tags attached. Items that are damaged, soiled,
              or carry strong scents (such as perfumes) will not qualify for a
              refund.
            </p>
            <p>
              Once we receive the returned goods, they will be inspected, and
              the refund will be processed. Please allow 7-14 days for the
              refund to reflect in your account.
            </p>
          </div>
        </section>

        {/* Rest of sections maintain original paragraph structure */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Exchanges
          </h2>
          <p className="text-gray-600">
            We offer exchanges for full-priced items. If you wish to exchange an
            item, please contact our customer service team at{" "}
            <a
              href="mailto:enquiry@vallyfab.com"
              className="text-blue-600 hover:underline"
            >
              enquiry@vallyfab.com
            </a>
            , and we’ll help facilitate the process.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Non-Returnable Items
          </h2>
          <p className="text-gray-600">
            For hygiene reasons, we cannot accept returns on knitted toys and
            accessories like earrings. Sale items and gift cards are also
            non-returnable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Damaged or Defective Items
          </h2>
          <p className="text-gray-600">
            If you receive a damaged or defective item, please contact us
            immediately at{" "}
            <a
              href="mailto:enquiry@vallyfab.com"
              className="text-blue-600 hover:underline"
            >
              enquiry@vallyfab.com
            </a>
            . We will arrange for a return or exchange at no additional cost to
            you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Late or Missing Refunds
          </h2>
          <div className="text-gray-600 space-y-4">
            <p>
              If you haven't received your refund after the return is processed,
              please first check your bank account or contact your bank, as
              refunds may take some time to process. If the issue persists, feel
              free to reach out to our customer care team at{" "}
              <a
                href="mailto:enquiry@vallyfab.com"
                className="text-blue-600 hover:underline"
              >
                enquiry@vallyfab.com
              </a>
              .
            </p>
          </div>
        </section>

        <div className="mt-8 border-t pt-6">
          <p className="text-sm text-gray-500 italic">
            By making a purchase with Vally Fabrics and Fashion, you agree to
            this return policy as part of our terms and conditions.
          </p>
          <p className="text-sm text-gray-500 mt-2">Effective Date: []</p>
        </div>
      </div>
    </main>
  );
}
