import HelpPageLayout from "./HelpPageLayout";
import HelpBreadcrumbs from "./HelpBreadcrumbs";
import HelpHeader from "./HelpHeader";
import HelpAlert from "./HelpAlert";
import HelpStepGuide from "./HelpStepGuide";
import HelpFooter from "./HelpFooter";

export default function HelpDetailTemplate({ breadcrumb, title, subtitle, alert, steps }) {
    return (
        <HelpPageLayout>
            <HelpBreadcrumbs currentPage={breadcrumb} />
            <HelpHeader title={title} subtitle={subtitle} />
            <HelpAlert message={alert} />
            <HelpStepGuide steps={steps} />
            <HelpFooter />
        </HelpPageLayout>
    );
}
