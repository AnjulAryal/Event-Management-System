import HelpDetailTemplate from "../../components/help/HelpDetailTemplate";

const STEPS = [
    {
        title: "Check your confirmation email",
        description: "After a successful registration, an automated confirmation email is sent to your registered email address with your e-tickets attached."
    },
    {
        title: "Visit your Dashboard",
        description: "Log in to your account and go to the My Events section. All your active registrations and tickets will be listed there for easy access."
    },
    {
        title: "Download or Print",
        description: "In the event detail view, you can click the ",
        highlight: "Download Ticket button to save a PDF copy or print it for physical entry."
    },
    {
        title: "Contact Support if Missing",
        description: "If you cannot find your tickets in neither your email nor dashboard, please reach out via our contact form for immediate assistance."
    }
];

export default function FindTickets() {
    return (
        <HelpDetailTemplate
            breadcrumb="Where can I find my tickets?"
            title="Help & Support"
            subtitle="Where can I find my tickets?"
            alert="Your tickets are emailed after registration. This guide covers how to access them via email and dashboard."
            steps={STEPS}
        />
    );
}
