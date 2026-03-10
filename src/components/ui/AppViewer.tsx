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
        <div className="tinymce-student-view">
            <style>{`
                .tinymce-student-view { color: #1f2937; font-size: 1rem; line-height: 1.75; }
                .tinymce-student-view h1 { font-size: 2em; font-weight: 800; color: #111827; margin: 0.75em 0 0.4em; line-height: 1.2; }
                .tinymce-student-view h2 { font-size: 1.5em; font-weight: 700; color: #1f2937; margin: 0.75em 0 0.4em; line-height: 1.3; }
                .tinymce-student-view h3 { font-size: 1.25em; font-weight: 700; color: #374151; margin: 0.75em 0 0.4em; line-height: 1.4; }
                .tinymce-student-view h4 { font-size: 1.1em; font-weight: 600; color: #374151; margin: 0.6em 0 0.3em; }
                .tinymce-student-view h5, .tinymce-student-view h6 { font-size: 1em; font-weight: 600; color: #4b5563; margin: 0.5em 0 0.25em; }
                .tinymce-student-view p { margin: 0.6em 0; }
                .tinymce-student-view strong, .tinymce-student-view b { font-weight: 700; }
                .tinymce-student-view em, .tinymce-student-view i { font-style: italic; }
                .tinymce-student-view u { text-decoration: underline; }
                .tinymce-student-view s { text-decoration: line-through; }
                .tinymce-student-view a { color: #7c3aed; text-decoration: underline; }
                .tinymce-student-view a:hover { color: #5b21b6; }
                .tinymce-student-view ul { list-style-type: disc; padding-left: 1.75em; margin: 0.6em 0; }
                .tinymce-student-view ol { list-style-type: decimal; padding-left: 1.75em; margin: 0.6em 0; }
                .tinymce-student-view li { margin: 0.3em 0; }
                .tinymce-student-view ul ul, .tinymce-student-view ol ol, .tinymce-student-view ul ol, .tinymce-student-view ol ul { margin: 0.2em 0; }
                .tinymce-student-view blockquote { border-left: 4px solid #7c3aed; padding: 0.5em 1em; color: #6b7280; background: #f5f3ff; border-radius: 0 0.5rem 0.5rem 0; margin: 1em 0; }
                .tinymce-student-view code { background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 0.25rem; padding: 0.1em 0.4em; font-family: ui-monospace, monospace; font-size: 0.875em; color: #be185d; }
                .tinymce-student-view pre { background: #1e1e2e; color: #cdd6f4; border-radius: 0.75rem; padding: 1.25em; overflow-x: auto; font-family: ui-monospace, monospace; font-size: 0.875em; margin: 1em 0; line-height: 1.6; }
                .tinymce-student-view pre code { background: none; border: none; padding: 0; color: inherit; font-size: inherit; }
                .tinymce-student-view table { border-collapse: collapse; width: 100%; margin: 1em 0; }
                .tinymce-student-view th, .tinymce-student-view td { border: 1px solid #d1d5db; padding: 0.5em 0.75em; text-align: left; }
                .tinymce-student-view th { background: #f9fafb; font-weight: 700; }
                .tinymce-student-view tr:nth-child(even) td { background: #f9fafb; }
                .tinymce-student-view hr { border: none; border-top: 1px solid #e5e7eb; margin: 1.5em 0; }
                .tinymce-student-view img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 0.75em 0; }
                .tinymce-student-view iframe { max-width: 100%; border-radius: 0.75rem; margin: 1em 0; display: block; }
                .tinymce-student-view [style*="color"] { /* preserve inline color styles from TinyMCE */ }
            `}</style>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
}
