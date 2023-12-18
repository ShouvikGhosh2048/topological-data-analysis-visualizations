export default function ExplanationLayout ({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="p-5 max-w-2xl m-auto">
            {children}
        </div>
    );
}