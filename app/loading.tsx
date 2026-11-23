import { Loader2, Scissors } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4">
            <div className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <Scissors className="h-8 w-8 text-primary" />
                </div>

                <h2 className="mt-5 text-2xl font-bold">
                    SalonBook
                </h2>

                <div className="mt-5 flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />

                    <p className="text-sm font-medium text-muted-foreground">
                        Loading, please wait...
                    </p>
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                    Preparing your experience.
                </p>

            </div>
        </div>
    );
}