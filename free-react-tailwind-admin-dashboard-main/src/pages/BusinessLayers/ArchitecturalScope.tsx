import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";
import ArchitecturalScopeVisualizer from "../../components/ArchitecturalScopeVisualizer";

export default function ArchitecturalScope() {
  const { architecturalScope } = useBusinessData();

  return (
    <>
      <PageMeta
        title="Architectural Scope | Business Blueprint Dashboard"
        description="Architectural Scope business layer visualization"
      />
      <ArchitecturalScopeVisualizer data={architecturalScope || {}} />
    </>
  );
}