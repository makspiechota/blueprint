import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";
import LeanViabilityVisualizer from "../../components/LeanViabilityVisualizer";

export default function LeanViability() {
  const { leanViability, leanCanvas } = useBusinessData();

  return (
    <>
      <PageMeta
        title="Lean Viability | Business Blueprint Dashboard"
        description="Lean Viability business layer visualization"
      />
      <LeanViabilityVisualizer data={leanViability || {}} leanCanvasData={leanCanvas} />
    </>
  );
}