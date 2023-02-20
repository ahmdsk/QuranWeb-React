import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import SidebarBody from "./SidebarBody"
import SidebarTop from "./SidebarTop"

export default function Sidebar() {
    const apps = useContext(AppContext)

    return (
        <div className="sidebar" ref={apps.sidebar}>
            <SidebarTop sidebar={apps.sidebar} />
            <SidebarBody />
        </div>
    )
}