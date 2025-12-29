import PageMeta from "../../components/common/PageMeta";
import C4Visualizer from "../../components/C4Visualizer";

export default function C4() {
  return (
    <>
      <PageMeta
        title="C4 Architecture | Software Layers"
        description="C4 Model software architecture diagrams"
      />
      <C4Visualizer />
    </>
  );
}
