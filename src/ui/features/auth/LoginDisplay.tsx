import { User } from "@/shared/entities/User"
import { JSX, useState } from "react"
import { authenticateUser } from "./api/user-authentication"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import Link from "@mui/material/Link"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Close from "@mui/icons-material/Close"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"

export const LoginDisplay = (): JSX.Element => {

    const [user, setUser] = useState<User>({})
    const [showPassword, setShowPassword] = useState(false)

    return <div className="h-screen w-screen flex flex-col gap-8 px-10 py-10" >
        <div className="flex flex-row-reverse">
            <IconButton
                onClick={() => window.electronEvents.closeLogin()}
            >
                <Close />
            </IconButton>
            <Typography className='grow' variant="h4">Entrar</Typography>
        </div>
        <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-row gap-1">
                <Typography variant="body1">Não tem uma conta?</Typography>
                <Link className="text-blue-400 cursor-pointer" variant="body1" underline="hover">Cadastre-se!</Link>
            </div>
            <TextField
                variant="outlined"
                label="Usuário"
                onChange={(event) => {
                    const currentUser = user
                    currentUser.name = event.currentTarget.value
                    setUser(currentUser)
                }}
            />
            <TextField
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                label="Senha"
                slotProps={{
                    input: {
                        endAdornment: <InputAdornment position="end">
                            <IconButton
                                tabIndex={-1}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                }}
                onChange={(event) => {
                    const currentUser = user
                    currentUser.password = event.currentTarget.value
                    setUser(currentUser)
                }}
            />
        </div>
        <div className="grid grid-rows-2 gap-4">
            <Button
                variant="contained"
                className="bg-gray-700"
                disableElevation
                onClick={() => {
                    authenticateUser(user)
                        .then((jwt) => {
                            const token = jwt.token
                            window.electronEvents.setAuthToken(token)
                            window.electronEvents.openMain()
                        })
                        .catch((err) => console.log(`falha: ${err}`))
                }}
            >
                Entrar
            </Button>
            <Button
                variant="outlined"
                onClick={() => window.electronEvents.closeLogin()}>
                Cancelar
            </Button>
        </div>
    </div>
}
