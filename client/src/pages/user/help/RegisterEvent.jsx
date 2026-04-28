import HelpDetailTemplate from "../../../components/help/HelpDetailTemplate";

const STEPS = [
    {
        title: "Find your event",
        description: "Browse the Events page or use the search bar to find the specific event you are interested in attending."
    },
    {
        title: "Review event details",
        description: "Click on the event card to view full details, including date, time, location, speakers, and ticket pricing options."
    },
    {
        title: "Choose tickets & checkout",
        description: "Select the number of tickets you need and click the ",
        highlight: "Register Now button to proceed to the secure checkout page."
    },
    {
        title: "Confirmation",
        description: "Once payment is successful (if applicable), you will receive an onscreen confirmation and an email with your entry tickets."
    }
];

export default function RegisterEvent() {
    return (
        <HelpDetailTemplate
            breadcrumb="How do I register for an event?"
            title="Help & Support"
            subtitle="How do I register for an event?"
            alert="Follow these simple steps to secure your spot at the next Eventify event."
            steps={STEPS}
        />
    );
}
