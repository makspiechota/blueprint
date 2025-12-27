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
            <Route path="/north-star" element={<NorthStar />} />
            <Route path="/lean-canvas" element={<LeanCanvas />} />
            <Route path="/architectural-scope" element={<ArchitecturalScope />} />
            <Route path="/lean-viability" element={<LeanViability />} />
            <Route path="/customer-factory" element={<CustomersFactory />} />
            <Route path="/policy-charter" element={<PolicyCharter />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      </ChatProvider>
    </BusinessDataProvider>
  );
}
