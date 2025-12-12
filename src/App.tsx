import "./App.css"
import { HashRouter, Route, Routes } from 'react-router'
import { LoginDisplay } from "./components/features/auth/LoginDisplay";
import { PageDisplay } from "./components/shared/main-page/PageDisplay";

export const App = () => {
    return <HashRouter>
        <Routes>
            <Route>
                <Route index element={<LoginDisplay />} />
                <Route path="home" element={<PageDisplay />} />
            </Route>
        </Routes>
    </HashRouter>
}
