import PageMeta from "../../components/common/PageMeta";
import { useBusinessData } from "../../context/BusinessDataContext";
import PolicyCharterVisualizer from "../../components/PolicyCharterVisualizer";

export default function PolicyCharter() {
  const { policyCharter } = useBusinessData();

  return (
    <>
      <PageMeta
        title="Policy Charter | Business Blueprint Dashboard"
        description="Policy Charter business layer visualization"
      />
      <PolicyCharterVisualizer charter={policyCharter || {}} />
    </>
  );
}