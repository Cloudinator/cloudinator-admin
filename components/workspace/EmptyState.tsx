import { FolderX } from 'lucide-react'; // You can use any icon that fits the context

export function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4 ">
            <FolderX className="h-12 w-12 text-purple-500" /> {/* Icon for visual appeal */}
            <p className="text-lg text-muted-foreground">{message}</p>
        </div>
    );
}