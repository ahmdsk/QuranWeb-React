import { Surah } from "@/types";
import { Link } from "react-router-dom";

export default function HeaderSurah(props: {
    surah: Surah | null
}) {
    return (
        <div className="topBar">
            <div className="title-home">
                <Link to="/home"><img src="/back.svg" alt="" /></Link>
                <span>{props.surah?.namaLatin}</span>
            </div>
        </div>
    )
}