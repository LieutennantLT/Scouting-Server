export default function BottomNavigation({
    activeTab,
    setActiveTab
}) {

    const tabs = [
        {
            id: "matches",
            icon: "📋",
            label: "Overall Match View"
        },
        {
            id: "teams",
            icon: "👥",
            label: "Overall Team View"
        },
        {
            id: "lookup",
            icon: "🔍",
            label: "Team Lookup"
        },
        {
            id: "graphs",
            icon: "📊",
            label: "Graphs"
        },
        {
            id: "simulator",
            icon: "🎮",
            label: "Simulator"
        },
        {
            id: "data",
            icon: "💾",
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

                    <span className="nav-icon">
                        {tab.icon}
                    </span>

                    <span>
                        {tab.label}
                    </span>

                </button>

            ))}

        </nav>
    );
}
