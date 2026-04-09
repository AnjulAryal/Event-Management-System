import HelpDetailTemplate from "../../components/help/HelpDetailTemplate";

const STEPS = [
    {
        title: "Go to the Event Page",
        description: "Navigate to the specific event page you have questions about from the Events list or your Dashboard."
    },
    {
        title: "Find Organizer Details",
        description: "Scroll down to the 'About Organizer' section where you can find the organizer's profile and contact information."
    },
    {
        title: "Submit a Query",
        description: "Click on the ",
        highlight: "Contact Organizer button to open a message form. Fill in your query and hit send."
    },
    {
        title: "Wait for Response",
        description: "Organizers typically respond within 24-48 hours. You will receive their reply via your registered email address."
    }
];

export default function ContactOrganizer() {
    return (
        <HelpDetailTemplate
            breadcrumb="How do I contact the organizer?"
            title="Help & Support"
            subtitle="How do I contact the organizer?"
            alert="Quickly get in touch with event organizers for specific event-related inquiries."
            steps={STEPS}
        />
    );
}
