import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";

export default function CustomersFactory() {
  const { aaarrMetrics } = useBusinessData();

  return (
    <>
      <PageMeta
        title="Customers Factory | Business Blueprint Dashboard"
        description="Customers Factory business layer visualization"
      />
      <div>
        <h1>Customers Factory</h1>
        <pre>{JSON.stringify(aaarrMetrics, null, 2)}</pre>
      </div>
    </>
  );
}