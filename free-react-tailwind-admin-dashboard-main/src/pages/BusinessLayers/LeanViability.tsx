import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";

export default function LeanViability() {
  const { leanViability } = useBusinessData();

  return (
    <>
      <PageMeta
        title="Lean Viability | Business Blueprint Dashboard"
        description="Lean Viability business layer visualization"
      />
      <div>
        <h1>Lean Viability</h1>
        <pre>{JSON.stringify(leanViability, null, 2)}</pre>
      </div>
    </>
  );
}