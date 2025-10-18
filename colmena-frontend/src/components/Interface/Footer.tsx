import { GenericLink } from "../General/GenericLink";

export function Footer(){
    return (
            <footer className="w-full flex flex-row min-h-8 mt-auto justify-center items-center bg-colmena-orange">
                    <p className="my-4 text-sm">© 2025 Colmena. All rights reserved. Made with ☕ by <GenericLink className="text-white no-underline  hover:text-blue-600 hover:underline" label="@lvcaspacifico" to="https://github.com/lvcaspacifico"/></p>
            </footer>
    )
}