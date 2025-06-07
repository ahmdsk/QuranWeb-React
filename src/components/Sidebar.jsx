import { useContext } from "react"
import { AppContext } from '../features/context/AppContext'
import SidebarBody from "./SidebarBody"
import SidebarTop from "./SidebarTop"

export default function Sidebar() {
    const apps = useContext(AppContext)

    return (
        <div 
            ref={apps.sidebar}
            className="fixed inset-y-0 left-0 z-50 w-64 -translate-x-full transform bg-background shadow-lg transition-transform duration-300 ease-in-out"
        >
            <SidebarTop sidebar={apps.sidebar} />
            <SidebarBody />
        </div>
    )
}