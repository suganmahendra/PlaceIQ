import { useEffect, useState } from "react";

interface ViewerProps {
    initialContent?: string;
}

export function AppViewer({ initialContent }: ViewerProps) {
    const [html, setHtml] = useState<string | "loading">("loading");

    useEffect(() => {
        const loadParsedContent = async () => {
            if (!initialContent || initialContent.trim() === '') {
                setHtml('');
                return;
            }

            // Check if it's a legacy BlockNote JSON format
            try {
                const blocks = JSON.parse(initialContent);
                if (Array.isArray(blocks)) {
                    // Convert old BlockNote blocks to HTML
                    const { BlockNoteEditor } = await import('@blocknote/core');
                    const temp = BlockNoteEditor.create();
                    const convertedHtml = await temp.blocksToHTMLLossy(blocks);
                    setHtml(convertedHtml);
                    return;
                }
            } catch (_) { /* not json, fallback */ }

            // Otherwise, it's just raw HTML from TinyMCE
            setHtml(initialContent);
        };

        loadParsedContent();
    }, [initialContent]);

    if (html === "loading") {
        return (
            <div className="p-4 border border-gray-100 rounded-xl animate-pulse bg-gray-50 h-[200px] flex items-center justify-center text-gray-400">
                Loading Content...
            </div>
        );
    }

    if (!html) {
        return (
            <div className="text-gray-500 italic py-4">
                Detailed text content is not available for this lesson yet.
            </div>
        );
    }

    return (
        <div
            className="text-gray-800 prose prose-primary max-w-none text-lg tinymce-content"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
