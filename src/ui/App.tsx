import "./App.css"
import { Routes, Route, HashRouter } from "react-router-dom";
import { LoginDisplay } from "./features/auth/LoginDisplay";

export const App = () => {
    return <HashRouter>
        <Routes>
            <Route path="/login" element={LoginDisplay()} />
        </Routes>
    </HashRouter>
}
