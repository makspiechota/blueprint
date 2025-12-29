import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";
import CustomersFactoryVisualizer from "../../components/CustomersFactoryVisualizer";

export default function CustomersFactory() {
  const { aaarrMetrics, leanViability, leanCanvas } = useBusinessData();

  return (
    <>
      <PageMeta
        title="Customers Factory | Business Blueprint Dashboard"
        description="Customers Factory business layer visualization"
      />
      <CustomersFactoryVisualizer data={aaarrMetrics || {}} leanViabilityData={leanViability} leanCanvasData={leanCanvas} />
    </>
  );
}