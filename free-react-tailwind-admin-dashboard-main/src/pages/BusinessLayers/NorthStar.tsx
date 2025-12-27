import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";

export default function NorthStar() {
  const { northStar } = useBusinessData();

  return (
    <>
      <PageMeta
        title="North Star | Business Blueprint Dashboard"
        description="North Star business layer visualization"
      />
      <div>
        <h1>North Star</h1>
        <pre>{JSON.stringify(northStar, null, 2)}</pre>
      </div>
    </>
  );
}