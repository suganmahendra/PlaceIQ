import { useEffect, useState } from "react";
import { BlockNoteEditor, type PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

interface ViewerProps {
    initialContent?: string;
}

export function AppViewer({ initialContent }: ViewerProps) {
    const [initialBlocks, setInitialBlocks] = useState<PartialBlock[] | undefined | "loading">("loading");

    useEffect(() => {
        const loadData = async () => {
            if (!initialContent || initialContent.trim() === '') {
                setInitialBlocks(undefined);
                return;
            }

            try {
                const blocks = JSON.parse(initialContent);
                if (Array.isArray(blocks)) {
                    setInitialBlocks(blocks);
                    return;
                }
            } catch (e) {
                // Not JSON. Fallback to markdown parsing
            }

            // Try to parse as markdown for backward compatibility
            try {
                const editor = BlockNoteEditor.create();
                const blocks = await editor.tryParseMarkdownToBlocks(initialContent);
                setInitialBlocks(blocks);
            } catch (e) {
                setInitialBlocks(undefined);
            }
        };

        loadData();
    }, [initialContent]);

    if (initialBlocks === "loading") {
        return <div className="p-4 border border-gray-100 rounded-xl animate-pulse bg-gray-50 h-[200px] flex items-center justify-center text-gray-400">Loading Content...</div>;
    }

    // If there's no content to display, simply return a placeholder
    if (!initialBlocks || initialBlocks.length === 0) {
        return (
            <div className="text-gray-500 italic py-4">
                Detailed text content is not available for this lesson yet.
            </div>
        );
    }

    return <ViewerInstance initialBlocks={initialBlocks} />;
}

function ViewerInstance({ initialBlocks }: { initialBlocks: PartialBlock[] | undefined }) {
    const editor = useCreateBlockNote({
        initialContent: initialBlocks,
    });

    return (
        <div className="text-gray-800 prose prose-primary max-w-none text-lg">
            <BlockNoteView
                editor={editor}
                editable={false}
                theme="light"
            />
        </div>
    );
}
