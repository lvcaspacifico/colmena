import { classMerge } from "../../utils/Style/classMerge";

type Props = React.ComponentProps<"input"> & {
    legend?:string
    fieldSetExtraClassName?: string
}

export function GenericDateInput({ legend, fieldSetExtraClassName, ...rest}: Props) {
    return (
        <fieldset className={classMerge("flex flex-1 w-80 max-h-20 mb-2 text-black", fieldSetExtraClassName)}>
            
                {legend && <legend className=" text-xxs font-medium mb-2 text-inherit"> {legend}</legend>} 

                <input  type="date" className="w-full h-12 rounded-lg border border-stone-950
                 px-4 text-sm text-gray-500 bg-transparent
                outline-none focus:border-2 placeholder-gray-300" {...rest} />
        </fieldset>
    )
}