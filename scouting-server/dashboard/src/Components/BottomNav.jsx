export default function BottomNavigation({
    activeTab,
    setActiveTab
}) {

    const tabs = [
        {
            id: "matches",
            label: "Overall Match View"
        },
        {
            id: "teams",
            label: "Overall Team View"
        },
        {
            id: "lookup",
            label: "Team Lookup"
        },
        {
            id: "graphs",
            label: "Graphs"
        },
        {
            id: "simulator",
            label: "Simulator"
        },
        {
            id: "data",
            label: "Data"
        }
    ];


    return (
        <nav className="bottom-navigation">

            {tabs.map(tab => (

                <button
                    key={tab.id}
                    className={
                        activeTab === tab.id
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab(tab.id)
                    }
                >
                    <span>
                        {tab.label}
                    </span>

                </button>

            ))}

        </nav>
    );
}
