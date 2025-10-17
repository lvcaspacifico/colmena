import { classMerge } from "../../utils/Style/classMerge"

type Props = React.ComponentProps<"h1"> & {
    label: string
    extraClassName?: string
}

export function GenericHeaderOne({ label, extraClassName, ...rest} : Props){

    return (
         <h1 
         
          className={classMerge(
        "text-3xl font-bold text-black text-center", 
          extraClassName
        )}  {...rest}>{label}</h1>
    );
}