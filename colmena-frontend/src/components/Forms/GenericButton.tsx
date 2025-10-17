import { classMerge } from "../../utils/Style/classMerge"

type Props = React.ComponentProps<"button"> & {
    isLoading?: boolean 
}
 
export function GenericButton({ children, isLoading, className, type = "button", ...rest}: Props){
    return(
        <button
        type={type}
        disabled={isLoading}
        {...rest}
        className={classMerge("w-80 h-12 mt-4 bg-colmena-orange hover:bg-colmena-orange-500 rounded-lg cursor-pointer text-white font-bold",className)}
        >
        {children}
        </button>
    )
}