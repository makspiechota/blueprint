import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";
import NorthStarVisualizer from "../../components/NorthStarVisualizer";

export default function NorthStar() {
  const { northStar } = useBusinessData();

  return (
    <>
      <PageMeta
        title="North Star | Business Blueprint Dashboard"
        description="North Star business layer visualization"
      />
      <NorthStarVisualizer data={northStar || {}} />
    </>
  );
}