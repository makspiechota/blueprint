import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";

export default function ArchitecturalScope() {
  const { architecturalScope } = useBusinessData();

  return (
    <>
      <PageMeta
        title="Architectural Scope | Business Blueprint Dashboard"
        description="Architectural Scope business layer visualization"
      />
      <div>
        <h1>Architectural Scope</h1>
        <pre>{JSON.stringify(architecturalScope, null, 2)}</pre>
      </div>
    </>
  );
}