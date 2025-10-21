import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";

// Import Tiptap dan semua ekstensi yang dibutuhkan
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import { TextStyle } from "@tiptap/extension-text-style";

// --- Komponen Toolbar (Tidak ada perubahan di sini) ---
const MenuBar = ({ editor }) => {
    if (!editor) return null;
    return (
        <div className="border p-2 space-x-2 bg-gray-50 rounded-t-md flex flex-wrap items-center gap-x-4 gap-y-2">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`px-2 py-1 rounded ${
                    editor.isActive("bold")
                        ? "bg-gray-800 text-white"
                        : "bg-gray-200"
                }`}
            >
                Bold
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`px-2 py-1 rounded ${
                    editor.isActive("italic")
                        ? "bg-gray-800 text-white"
                        : "bg-gray-200"
                }`}
            >
                Italic
            </button>
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={`px-2 py-1 rounded ${
                    editor.isActive("heading", { level: 2 })
                        ? "bg-gray-800 text-white"
                        : "bg-gray-200"
                }`}
            >
                Judul Bab
            </button>
            <div className="border-l pl-2 ml-2 space-x-2">
                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().setTextAlign("left").run()
                    }
                    className={
                        editor.isActive({ textAlign: "left" })
                            ? "font-bold"
                            : ""
                    }
                >
                    Left
                </button>
                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().setTextAlign("center").run()
                    }
                    className={
                        editor.isActive({ textAlign: "center" })
                            ? "font-bold"
                            : ""
                    }
                >
                    Center
                </button>
                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().setTextAlign("justify").run()
                    }
                    className={
                        editor.isActive({ textAlign: "justify" })
                            ? "font-bold"
                            : ""
                    }
                >
                    Justify
                </button>
            </div>
            <div className="border-l pl-2 ml-2 flex items-center space-x-2">
                <select
                    onChange={(e) =>
                        editor
                            .chain()
                            .focus()
                            .setFontFamily(e.target.value)
                            .run()
                    }
                    className="text-sm border-gray-300 rounded"
                >
                    <option value="">Default Font</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Arial">Arial</option>
                </select>
            </div>
        </div>
    );
};

export default function Edit({ auth, laporan }) {
    const { flash } = usePage().props;
    const sections = laporan?.sections || [];
    const [activeSection, setActiveSection] = useState(
        sections.length > 0 ? sections[0] : null
    );
    const [isProcessing, setIsProcessing] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            FontFamily,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
        ],
        content: activeSection?.content || "",
        editable: !!activeSection,
        editorProps: {
            attributes: {
                class: "prose max-w-full h-96 p-4 border-t-0 border rounded-b-md focus:outline-none overflow-y-auto",
            },
        },
    });

    useEffect(() => {
        if (editor) {
            const newContent = activeSection?.content || "";
            if (editor.getHTML() !== newContent) {
                editor.commands.setContent(newContent);
            }
            editor.setEditable(!!activeSection);
        }
    }, [activeSection, editor]);

    const handleSaveSection = () => {
        if (!activeSection || !editor) return;
        setIsProcessing(true);

        router.put(
            route("sections.update", activeSection.id),
            {
                content: editor.getHTML(),
            },
            {
                preserveScroll: true,
                onFinish: () => setIsProcessing(false),
            }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Editor: {laporan.judul}
                </h2>
            }
        >
            <Head title="Editor Laporan" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash && flash.success && (
                        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg shadow">
                            {flash.success}
                        </div>
                    )}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/4 p-6 border-b md:border-b-0 md:border-r">
                                <h3 className="font-semibold mb-4">
                                    Outline Laporan
                                </h3>
                                <ul>
                                    {sections.map((section) => (
                                        <li key={section.id} className="mb-2">
                                            <button
                                                onClick={() =>
                                                    setActiveSection(section)
                                                }
                                                className={`w-full text-left p-2 rounded ${
                                                    activeSection?.id ===
                                                    section.id
                                                        ? "bg-indigo-100 font-bold text-indigo-700"
                                                        : "hover:bg-gray-100"
                                                }`}
                                            >
                                                {section.title}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="w-full md:w-3/4 p-6">
                                {activeSection ? (
                                    <>
                                        <h2 className="text-2xl font-bold mb-4">
                                            {activeSection.title}
                                        </h2>
                                        <MenuBar editor={editor} />
                                        <EditorContent editor={editor} />

                                        {/* --- BAGIAN YANG DITAMBAHKAN --- */}
                                        <div className="mt-4 flex items-center gap-4">
                                            <button
                                                onClick={handleSaveSection}
                                                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md disabled:bg-indigo-300 shadow hover:bg-indigo-700"
                                                disabled={isProcessing}
                                            >
                                                {isProcessing
                                                    ? "Menyimpan..."
                                                    : "Simpan Perubahan"}
                                            </button>

                                            <a
                                                href={route(
                                                    "laporan.preview",
                                                    laporan.id
                                                )}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md shadow hover:bg-gray-600"
                                            >
                                                Preview Laporan
                                            </a>

                                            <a
                                                href={route(
                                                    "laporan.download.pdf",
                                                    { laporan: laporan.id }
                                                )}
                                                className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                            >
                                                Download PDF (Rapi)
                                            </a>
                                            <a
                                                href={route(
                                                    "laporan.download.docx",
                                                    { laporan: laporan.id }
                                                )}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                            >
                                                Download DOCX (Bisa Edit)
                                            </a>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-10 h-full flex flex-col items-center justify-center text-gray-500">
                                        <p className="font-semibold text-lg">
                                            Pilih bab dari outline di kiri.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
