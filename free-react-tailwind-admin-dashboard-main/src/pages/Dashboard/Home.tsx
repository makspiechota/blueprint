import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Business Blueprint Dashboard | Complete Business Architecture System"
        description="Dashboard for visualizing and managing business blueprints"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <h1 className="text-2xl font-bold mb-4">Business Blueprint Dashboard</h1>
          <p className="text-gray-600">
            Welcome to the Business Blueprint Dashboard. Select a layer from the sidebar to visualize your business architecture.
          </p>
        </div>
      </div>
    </>
  );
}
