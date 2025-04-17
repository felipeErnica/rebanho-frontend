import { JSX, ReactNode } from "react";
import { Label } from "./Label";
import { InputBox } from "./InputBox";

export const AbstractFilterDiv = (props: AbstractFilterDivProps): JSX.Element => {
    return <div className="grid grid-cols-1 grid-rows-[auto_1fr] gap-4">
        <Label label={`${props.mainTitle}:`} />
        {props.children}
    </div>
}

export const NumberFilterDiv = (props: NumberDateFilterProps): JSX.Element => {
    return <AbstractFilterDiv mainTitle={props.mainTitle}>
        <div className="grid grid-cols-[auto_1fr] grid-rows-2 gap-2">
            <Label label="De:" />
            <InputBox
                className="appearance-none"
                type="number"
                step={props.step}
            />
            <Label label="Até:" />
            <InputBox
                className="appearance-none"
                type="number"
                step={props.step}
            />
        </div>
    </AbstractFilterDiv>
}

export const DateFilterDiv = (props: NumberDateFilterProps): JSX.Element => {
    return <AbstractFilterDiv mainTitle={props.mainTitle}>
        <div className="grid grid-cols-[auto_1fr] grid-rows-2 gap-2">
            <Label label="De:" />
            <InputBox type="date" />
            <Label label="Até:" />
            <InputBox type="date" />
        </div>
    </AbstractFilterDiv>
}

interface NumberDateFilterProps {
    mainTitle: string;
    step?: string;
}

interface AbstractFilterDivProps {
    mainTitle: string;
    children: ReactNode | ReactNode[]
}
