import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";
import LeanCanvasVisualizer from "../../components/LeanCanvasVisualizer";

export default function LeanCanvas() {
  const { leanCanvas } = useBusinessData();

  return (
    <>
      <PageMeta
        title="Lean Canvas | Business Blueprint Dashboard"
        description="Lean Canvas business layer visualization"
      />
      <LeanCanvasVisualizer canvas={leanCanvas || {}} />
    </>
  );
}