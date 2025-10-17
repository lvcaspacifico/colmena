import { classMerge } from "../../utils/Style/classMerge"

type Props = React.ComponentProps<"a"> & {
  extraClassName?: string
  to?: string
  label?: string
  navigationFunction?: () => void
}

export function GenericLink({
  to = "#", label = "Click me", extraClassName, navigationFunction, ...rest }: Props) {
    
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (navigationFunction) {
      e.preventDefault()
      navigationFunction()
    }
  }

  return (
    <a href={to}
      onClick={handleClick}
      className={classMerge(
        "text-sm font-semibold text-gray-500 mt-10 mb-4 text-center hover:text-colmena-orange transition ease-linear underline", 
        extraClassName
      )} 
      {...rest}>
      {label}
    </a>
  )
}
