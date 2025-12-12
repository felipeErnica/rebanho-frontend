import { JSX, useState } from "react"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import Close from "@mui/icons-material/Close"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import { SubmitHandler, useForm } from "react-hook-form"
import { JwtToken, User } from "@utils/Entities"
import { APIError, authUser } from "@utils/ApiRequest"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { Alert, AlertTitle, Collapse } from "@mui/material"

export const LoginDisplay = (): JSX.Element => {

    const { control, handleSubmit } = useForm<User>()
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<APIError>()

    const onSubmit: SubmitHandler<User> = (data: User) => {
        authUser(data)
            .then((response: JwtToken) => {
                const token = response.token
                window.electronEvents.setAuthToken(token)
                window.electronEvents.openMain()
            })
            .catch(error => setError(error))
    }

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
            <Collapse in={!!error}>
                <Alert severity="error" onClose={() => setError(undefined)}>
                    <AlertTitle>{error?.title}</AlertTitle>
                    {error?.message}
                </Alert>
            </Collapse>
            <div className="flex flex-row gap-1">
                <Typography variant="body1">Não tem uma conta?</Typography>
                <Link className="text-blue-400 cursor-pointer" variant="body1" underline="hover">Cadastre-se!</Link>
            </div>
            <FormTextField
                formProps={{ control, name: 'name' }}
                size="medium"
                variant="outlined"
                label="Usuário"
            />
            <FormTextField
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                size="medium"
                label="Senha"
                formProps={{ control, name: 'password' }}
                endAdornment={(
                    <InputAdornment position="end">
                        <IconButton
                            tabIndex={-1}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                )}
            />
        </div>
        <div className="grid grid-rows-2 gap-4">
            <Button
                variant="contained"
                className="bg-gray-700"
                disableElevation
                onClick={handleSubmit(onSubmit)}
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
