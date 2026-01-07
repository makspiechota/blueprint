import { HashRouter as Router, Routes, Route } from "react-router";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { BusinessDataProvider } from "./context/BusinessDataContext";
import { ChatProvider } from "./context/ChatContext";
import NorthStar from "./pages/BusinessLayers/NorthStar";
import LeanCanvas from "./pages/BusinessLayers/LeanCanvas";
import ArchitecturalScope from "./pages/BusinessLayers/ArchitecturalScope";
import LeanViability from "./pages/BusinessLayers/LeanViability";
import CustomersFactory from "./pages/BusinessLayers/CustomersFactory";
import PolicyCharter from "./pages/BusinessLayers/PolicyCharter";
import Misc from "./pages/BusinessLayers/Misc";
import Roadmap from "./pages/BusinessLayers/Roadmap";
import ComingSoon from "./pages/BusinessLayers/ComingSoon";
import C4 from "./pages/SoftwareLayers/C4";

export default function App() {
  return (
    <BusinessDataProvider>
      <ChatProvider>
        <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<NorthStar />} />
            <Route path="/:productName/north-star" element={<NorthStar />} />
            <Route path="/:productName/lean-canvas" element={<LeanCanvas />} />
            <Route path="/:productName/architectural-scope" element={<ArchitecturalScope />} />
            <Route path="/:productName/lean-viability" element={<LeanViability />} />
            <Route path="/:productName/customer-factory" element={<CustomersFactory />} />
            <Route path="/:productName/policy-charter" element={<PolicyCharter />} />
            <Route path="/:productName/misc" element={<Misc />} />
             <Route path="/:productName/roadmap" element={<Roadmap />} />
             <Route path="/:productName/backlog" element={<ComingSoon />} />
              <Route path="/:productName/subdomains" element={<ComingSoon />} />
              <Route path="/:productName/bounded-contexts" element={<ComingSoon />} />
              <Route path="/:productName/contexts-map" element={<ComingSoon />} />
              <Route path="/:productName/event-storming" element={<ComingSoon />} />
              {/* Software Layers */}
              <Route path="/:productName/c4" element={<C4 />} />
              <Route path="/:productName/terraform" element={<ComingSoon />} />
              <Route path="/:productName/tripwire" element={<ComingSoon />} />
             <Route path="/:productName/c4" element={<C4 />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      </ChatProvider>
    </BusinessDataProvider>
  );
}
