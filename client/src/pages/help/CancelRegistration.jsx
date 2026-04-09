import HelpDetailTemplate from "../../components/help/HelpDetailTemplate";

const STEPS = [
    {
        title: "Go to My Events",
        description: "Navigate to the My Events section from your dashboard sidebar. This is where all your upcoming and past bookings are curated."
    },
    {
        title: "Find your registration",
        description: "Locate the specific event you wish to cancel from your registered events list. Use the search bar if you have multiple upcoming events."
    },
    {
        title: "Click \"Cancel Registration\"",
        description: "Open the event detail view and click the ",
        highlight: "Cancel Registration button located at the bottom of the ticket summary."
    },
    {
        title: "Confirm cancellation",
        description: "A confirmation prompt will appear. Carefully review the details and confirm to complete the cancellation process. You will receive an email confirmation shortly after."
    }
];

export default function CancelRegistration() {
    return (
        <HelpDetailTemplate
            breadcrumb="Can I cancel my registration?"
            title="Help & Support"
            subtitle="Can I cancel my Registration?"
            alert="Yes, you can cancel the event from the My Events section."
            steps={STEPS}
        />
    );
}
