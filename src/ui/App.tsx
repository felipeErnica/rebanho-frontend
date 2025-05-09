import "./App.css"
import { Routes, Route, HashRouter } from "react-router-dom";
import { LoginDisplay } from "./features/auth/LoginDisplay";
import { HomePage } from "./features/home/HomePage";

export const App = () => {

    return <HashRouter>
        <Routes>
            <Route path="/login" element={LoginDisplay()} />
            <Route path="/home" element={HomePage()} />
        </Routes>
    </HashRouter>
}
