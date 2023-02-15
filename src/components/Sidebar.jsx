import SidebarBody from "./SidebarBody"
import SidebarTop from "./SidebarTop"

export default function Sidebar(props) {
    return (
        <div className="sidebar" ref={props.sidebar}>
            <SidebarTop sidebar={props.sidebar} />
            <SidebarBody />
        </div>
    )
}