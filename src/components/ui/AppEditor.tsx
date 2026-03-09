import { useEffect, useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface EditorProps {
    initialContent?: string;
    onChange: (htmlContent: string) => void;
}

const TINYMCE_INIT = {
    height: 500,
    menubar: true,
    plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | blocks | ' +
        'bold italic forecolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | image media code | help',
    content_style: 'body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:15px; background: #fff; padding: 1rem; }',
    branding: false,
    promotion: false,
    skin: 'oxide',
};

export function AppEditor({ initialContent, onChange }: EditorProps) {
    const [content, setContent] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;

        const loadParsedContent = async () => {
            if (!initialContent || initialContent.trim() === '') {
                setContent('');
                setLoading(false);
                return;
            }

            // Check if it's legacy BlockNote JSON
            try {
                const blocks = JSON.parse(initialContent);
                if (Array.isArray(blocks)) {
                    // Convert legacy blocks to lossy HTML
                    const { BlockNoteEditor } = await import('@blocknote/core');
                    const temp = BlockNoteEditor.create();
                    const html = await temp.blocksToHTMLLossy(blocks);
                    setContent(html);
                    setLoading(false);
                    return;
                }
            } catch (_) { /* not json, just use as raw html */ }

            // Otherwise just use raw string (assuming it's HTML from TinyMCE)
            setContent(initialContent);
            setLoading(false);
        };
        loadParsedContent();
        initialized.current = true;
    }, [initialContent]);

    if (loading) {
        return (
            <div className="p-4 border border-gray-200 rounded-xl animate-pulse bg-gray-50 h-[300px] flex items-center justify-center text-gray-400">
                Loading Editor...
            </div>
        );
    }

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY || "ellrykogqoljz2bou2vg7kgw0xo2pyw6mbzrj4rkbihh2q3p"}
                initialValue={content}
                onEditorChange={(newContent) => onChange(newContent)}
                init={TINYMCE_INIT}
            />
        </div>
    );
}
