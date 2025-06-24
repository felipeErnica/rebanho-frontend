import "./App.css"
import { Routes, Route, HashRouter } from "react-router-dom";
import { LoginDisplay } from "@/ui/features/auth/LoginDisplay";
import { PageDisplay } from "@/ui/shared/main-page/PageDisplay";

export const App = () => {

    return <HashRouter>
        <Routes>
            <Route path="/login" element={LoginDisplay()} />
            <Route path="/home" element={PageDisplay()} />
        </Routes>
    </HashRouter>
}
