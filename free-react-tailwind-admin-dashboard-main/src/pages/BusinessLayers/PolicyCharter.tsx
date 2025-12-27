import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";

export default function PolicyCharter() {
  const { policyCharter } = useBusinessData();

  return (
    <>
      <PageMeta
        title="Policy Charter | Business Blueprint Dashboard"
        description="Policy Charter business layer visualization"
      />
      <div>
        <h1>Policy Charter</h1>
        <pre>{JSON.stringify(policyCharter, null, 2)}</pre>
      </div>
    </>
  );
}