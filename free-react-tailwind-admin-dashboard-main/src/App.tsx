import { BrowserRouter as Router, Routes, Route } from "react-router";
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
            {/* Software Layers */}
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
