import { useEffect, useState } from "react";
import { BlockNoteEditor, type PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

interface EditorProps {
    initialContent?: string;
    onChange: (jsonContent: string) => void;
}

export function AppEditor({ initialContent, onChange }: EditorProps) {
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
                // Not JSON. Fallback to markdown below.
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
        return <div className="p-4 border border-gray-200 rounded-xl animate-pulse bg-gray-50 h-[300px] flex items-center justify-center text-gray-400">Loading Editor...</div>;
    }

    return <EditorInstance initialBlocks={initialBlocks} onChange={onChange} />;
}

function EditorInstance({ initialBlocks, onChange }: { initialBlocks: PartialBlock[] | undefined, onChange: (json: string) => void }) {
    const editor = useCreateBlockNote({
        initialContent: initialBlocks,
    });

    return (
        <div className="border border-gray-300 rounded-xl overflow-hidden bg-white py-4 min-h-[300px]">
            <BlockNoteView
                editor={editor}
                onChange={() => {
                    onChange(JSON.stringify(editor.document));
                }}
            />
        </div>
    );
}
