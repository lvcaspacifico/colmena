import { classMerge } from "../../utils/Style/classMerge"

type Props = {
    label: string
    extraClassName?: string
    kpi: number
}

export function GenericDashboardKPI({ label, extraClassName, kpi }: Props ){
    return (
        <div className={classMerge("border-black border-1 rounded-lg  p-4  text-black", extraClassName)}>
            <p className="text-sm text-gray-700">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{kpi}</p>
        </div>
    )
}