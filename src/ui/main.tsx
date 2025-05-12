import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { createTheme, GlobalStyles, StyledEngineProvider, ThemeProvider } from '@mui/material'
import { grey } from '@mui/material/colors'

const theme = createTheme({
    palette: {
        primary: { main: grey[700] },
    },
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <StyledEngineProvider enableCssLayer >
            <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
            <ThemeProvider theme={theme} >
                <App />
            </ThemeProvider>
        </StyledEngineProvider>
    </StrictMode>,
)
