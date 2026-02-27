import { useEffect, useState } from "react";
import { BlockNoteEditor, type PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { Maximize2 } from "lucide-react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

interface EditorProps {
    initialContent?: string;
    onChange: (jsonContent: string) => void;
    /** If provided, fullscreen button calls this instead of managing its own state */
    onOpenFullscreen?: () => void;
}

export function AppEditor({ initialContent, onChange, onOpenFullscreen }: EditorProps) {
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
            } catch (_) { /* fallback to markdown */ }
            try {
                const editor = BlockNoteEditor.create();
                const blocks = await editor.tryParseMarkdownToBlocks(initialContent);
                setInitialBlocks(blocks);
            } catch (_) {
                setInitialBlocks(undefined);
            }
        };
        loadData();
    }, [initialContent]);

    if (initialBlocks === "loading") {
        return (
            <div className="p-4 border border-gray-200 rounded-xl animate-pulse bg-gray-50 h-[300px] flex items-center justify-center text-gray-400">
                Loading Editor...
            </div>
        );
    }

    return <EditorInstance initialBlocks={initialBlocks} onChange={onChange} onOpenFullscreen={onOpenFullscreen} />;
}

function EditorInstance({
    initialBlocks,
    onChange,
    onOpenFullscreen,
}: {
    initialBlocks: PartialBlock[] | undefined;
    onChange: (json: string) => void;
    onOpenFullscreen?: () => void;
}) {
    const editor = useCreateBlockNote({ initialContent: initialBlocks });

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            {/* Compact toolbar */}
            {onOpenFullscreen && (
                <div className="flex items-center justify-end px-3 py-1.5 border-b border-gray-100 bg-gray-50">
                    <button
                        onClick={onOpenFullscreen}
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-primary hover:bg-primary/5 px-2 py-1 rounded-lg transition-colors"
                        title="Open in Fullscreen"
                    >
                        <Maximize2 className="w-3.5 h-3.5" />
                        Fullscreen
                    </button>
                </div>
            )}
            <div className="py-2 min-h-[300px]">
                <BlockNoteView
                    editor={editor}
                    theme="light"
                    onChange={() => onChange(JSON.stringify(editor.document))}
                />
            </div>
        </div>
    );
}
