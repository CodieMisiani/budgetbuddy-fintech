export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-4">Upgrade to BudgetBuddy Premium</h1>
      <div className="bg-white rounded shadow p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-2">Premium Features</h2>
        <ul className="mb-4 list-disc ml-6 text-gray-700">
          <li>Advanced analytics and spending insights</li>
          <li>Export to CSV/Excel</li>
          <li>Multi-account support</li>
          <li>Priority support</li>
        </ul>
        <div className="mb-4 text-gray-500">More features coming soon!</div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded opacity-50 cursor-not-allowed" disabled>
          Stripe Integration Coming Soon
        </button>
      </div>
    </div>
  );
}
