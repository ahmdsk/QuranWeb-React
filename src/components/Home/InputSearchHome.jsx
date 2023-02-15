export default function InputSearchHome(props) {
    return (
        <div className="seacrhBar" ref={props.searchInput}>
            <input type="text" placeholder="Search Surah..." onChange={props.handleSearchSurah} />
        </div>
    )
}