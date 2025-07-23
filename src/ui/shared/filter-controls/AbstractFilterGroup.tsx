import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

type AbstractFilterDivProps = {
    mainTitle: string;
    children: ReactNode | ReactNode[]
}

export const AbstractFilterGroup = (props: AbstractFilterDivProps) => {
    return <div className="flex flex-col gap-2">
        <Typography variant="subtitle1">{`${props.mainTitle}:`}</Typography>
        {props.children}
    </div >
}

