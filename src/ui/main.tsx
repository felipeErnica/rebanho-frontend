import 'dayjs/locale/pt-br';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { grey } from '@mui/material/colors'
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import GlobalStyles from '@mui/material/GlobalStyles'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers'

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
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='pt-br'>
                    <App />
                </LocalizationProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    </StrictMode>,
)
