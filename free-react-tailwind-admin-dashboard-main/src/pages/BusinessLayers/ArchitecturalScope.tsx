import { useParams } from 'react-router';
import { useEffect } from 'react';
import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";
import ArchitecturalScopeVisualizer from "../../components/ArchitecturalScopeVisualizer";
import LayerWrapper from "../../components/LayerWrapper";

export default function ArchitecturalScope() {
  const { productName: urlProductName } = useParams<{ productName: string }>();
  const { architecturalScope, setProductName, productName } = useBusinessData();

  useEffect(() => {
    if (urlProductName) setProductName?.(urlProductName);
  }, [urlProductName, setProductName]);

  return (
    <>
      <PageMeta
        title="Architectural Scope | Business Blueprint Dashboard"
        description="Architectural Scope business layer visualization"
      />
      <LayerWrapper
        layerKey="architecturalScope"
        title="Architectural Scope Not Found"
        description="The Architectural Scope layer hasn't been created yet. Use AI to generate it based on your Lean Canvas."
        resourceType="generate-architectural-scope"
        dependencies={['leanCanvas']}
      >
        <ArchitecturalScopeVisualizer data={architecturalScope} />
      </LayerWrapper>
    </>
  );
}