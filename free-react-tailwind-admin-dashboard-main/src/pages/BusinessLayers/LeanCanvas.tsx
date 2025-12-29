import { useParams } from 'react-router';
import { useEffect } from 'react';
import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";
import LeanCanvasVisualizer from "../../components/LeanCanvasVisualizer";

export default function LeanCanvas() {
  const { productName: urlProductName } = useParams<{ productName: string }>();
  const { leanCanvas, setProductName, productName } = useBusinessData();

  useEffect(() => {
    if (urlProductName) setProductName?.(urlProductName);
  }, [urlProductName, setProductName]);

  return (
    <>
      <PageMeta
        title="Lean Canvas | Business Blueprint Dashboard"
        description="Lean Canvas business layer visualization"
      />
      <LeanCanvasVisualizer canvas={leanCanvas || {}} productName={productName} />
    </>
  );
}