export default function Loader() {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-b-purple-500/60 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
        </div>
    );
}
