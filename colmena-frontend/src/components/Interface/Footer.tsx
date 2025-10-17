import { GenericLink } from "../General/GenericLink";

export function Footer(){
    return (
            <footer className="w-full flex flex-row min-h-16 mt-auto justify-center items-center bg-colmena-orange">
                    <p className="mt-4 text-sm">Made with ☕ by <GenericLink className="text-white no-underline  hover:text-blue-600 hover:underline" label="@lvcaspacifico" to="https://github.com/lvcaspacifico"/></p>
            </footer>
    )
}