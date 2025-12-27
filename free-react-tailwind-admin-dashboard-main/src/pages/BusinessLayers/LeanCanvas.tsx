import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";

export default function LeanCanvas() {
  const { leanCanvas } = useBusinessData();

  return (
    <>
      <PageMeta
        title="Lean Canvas | Business Blueprint Dashboard"
        description="Lean Canvas business layer visualization"
      />
      <div>
        <h1>Lean Canvas</h1>
        <pre>{JSON.stringify(leanCanvas, null, 2)}</pre>
      </div>
    </>
  );
}