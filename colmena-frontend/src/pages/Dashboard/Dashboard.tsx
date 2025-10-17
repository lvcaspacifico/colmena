import { GenericLink } from "../../components/General/GenericLink";

export function Dashboard(){
    return (
        <div>
            <GenericLink label="Projects" to="/projects"></GenericLink>
            <br />
            <GenericLink label="Tasks" to="/tasks"></GenericLink>
            <br />
            <GenericLink label="Labels" to="/labels"></GenericLink>
        </div>
    )
}