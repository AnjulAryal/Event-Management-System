const Footer = () => {
    return (
        <footer className="bg-white border-t py-6 mt-auto">
            <div className="container mx-auto px-4 text-center text-neutral-500">
                <p>&copy; {new Date().getFullYear()} Visioneries | Eventify. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;