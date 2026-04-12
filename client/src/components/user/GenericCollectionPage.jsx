import { useState, useEffect, useCallback, useMemo } from "react";
import UserPageContainer from "./UserPageContainer";
import UserPageHeader from "./UserPageHeader";
import UserSearch from "./UserSearch";
import UserFilterBar from "./UserFilterBar";
import UserEmptyState from "./UserEmptyState";

export default function GenericCollectionPage({ 
    title, 
    subtitle, 
    highlightWord,
    rightElement,
    items = [], 
    categories = [],
    renderItem,
    searchPlaceholder,
    emptyState = { icon: "🔍", title: "No results", description: "Try adjusting your search" },
    filterLogic, // optional custom filter logic
    recommendedItems = [],
    renderRecommendedItem,
    showSearch = true,
    showFilters = true
}) {
    const [query, setQuery] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("All Categories");
    const [filteredItems, setFilteredItems] = useState(items);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const hasActiveFilters = useMemo(() => 
        query.trim() !== "" || date !== "" || category !== "All Categories",
    [query, date, category]);

    const handleApplyFilters = useCallback(() => {
        let filtered = [...items];

        if (filterLogic) {
            filtered = filterLogic(items, { query, date, category });
        } else {
            if (query.trim()) {
                const q = query.toLowerCase();
                filtered = filtered.filter(item => 
                    (item.title || item.name || "").toLowerCase().includes(q) ||
                    (item.location || item.role || "").toLowerCase().includes(q) ||
                    (item.description || item.category || "").toLowerCase().includes(q)
                );
            }
            if (category !== "All Categories") {
                filtered = filtered.filter(item => (item.category || "").toLowerCase() === category.toLowerCase());
            }
            if (date) {
                const selectedDate = new Date(date).toDateString();
                filtered = filtered.filter(item => {
                    if (!item.date) return false;
                    return new Date(item.date).toDateString() === selectedDate;
                });
            }
        }
        setFilteredItems(filtered);
    }, [items, query, date, category, filterLogic]);

    useEffect(() => {
        handleApplyFilters();
    }, [handleApplyFilters]);

    return (
        <UserPageContainer isMobile={isMobile}>
            {showSearch && <UserSearch value={query} onChange={setQuery} placeholder={searchPlaceholder} />}
            {showFilters && (
                <UserFilterBar 
                    date={date} setDate={setDate}
                    category={category} setCategory={setCategory}
                    categories={categories}
                    onApply={handleApplyFilters}
                    onReset={() => { setQuery(""); setDate(""); setCategory("All Categories"); }}
                    hasActiveFilters={hasActiveFilters}
                />
            )}
            <UserPageHeader 
                title={title} subtitle={subtitle} highlightWord={highlightWord} 
                rightElement={rightElement}
            />
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item, idx) => renderItem(item, idx))}
                </div>
            ) : (
                <UserEmptyState {...emptyState} />
            )}

            {/* Recommended Section */}
            {!hasActiveFilters && recommendedItems.length > 0 && (
                <div className="mt-16 space-y-6">
                    <UserPageHeader title="Recommend for You" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendedItems.map((item, idx) => 
                            renderRecommendedItem ? renderRecommendedItem(item, idx) : renderItem(item, idx)
                        )}
                    </div>
                </div>
            )}
        </UserPageContainer>
    );
}
