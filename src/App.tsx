import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar, Footer, ToastProvider } from "@/components";
import Home from "@/pages/Home";
import PublishRecipe from "@/pages/PublishRecipe";
import Profile from "@/pages/Profile";
import RecipeDetail from "@/pages/RecipeDetail";
import PotluckList from "@/pages/PotluckList";
import PotluckDetail from "@/pages/PotluckDetail";
import KitchenList from "@/pages/KitchenList";
import KitchenDetail from "@/pages/KitchenDetail";
import Admin from "@/pages/Admin";
import SpecialEditor from "@/pages/SpecialEditor";
import SpecialList from "@/pages/SpecialList";
import SpecialDetail from "@/pages/SpecialDetail";

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route path="/publish" element={<PublishRecipe />} />
              <Route path="/potlucks" element={<PotluckList />} />
              <Route path="/potluck/:id" element={<PotluckDetail />} />
              <Route path="/kitchens" element={<KitchenList />} />
              <Route path="/kitchen/:id" element={<KitchenDetail />} />
              <Route path="/specials" element={<SpecialList />} />
              <Route path="/special/:id" element={<SpecialDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/special/:id" element={<SpecialEditor />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ToastProvider>
  );
}
