import { classMerge } from "../../utils/Style/classMerge"
import { GenericHorizontalLine } from "../General/GenericHorizontalLine"

type Props = React.ComponentProps<"input"> & {
    extraClassName?: string
}

export function GenericDashboardSearchField({ extraClassName, ...rest } : Props ){
    return (
        <div className="my-4 flex flex-col gap-2 bg-gray-100">
        <GenericHorizontalLine/>
        <div className="mx-2">
            <input
            type="text"
            placeholder="Type a name..."
            {...rest}
            className={classMerge("py-2 pr-2 pl-4 rounded border border-gray-300 w-full bg-white text-sm", extraClassName)}
        />
        </div>
        <GenericHorizontalLine/>
        </div>
    )
}