import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import axios from "axios";

// Import Tiptap dan semua ekstensi yang dibutuhkan
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import { TextStyle } from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";

// Komponen Toolbar
const MenuBar = ({ editor, onImageUpload }) => {
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            setIsUploading(true);
            try {
                const figureHtml = await onImageUpload(file);
                if (figureHtml) {
                    // Insert figure HTML directly
                    editor.chain().focus().insertContent(figureHtml).run();
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Gagal mengupload gambar: ' + (error.message || 'Unknown error'));
            } finally {
                setIsUploading(false);
            }
        };
        input.click();
    };

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
            <div className="border-l pl-2 ml-2">
                <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={isUploading}
                    className={`px-2 py-1 rounded ${
                        isUploading
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    title="Insert Image"
                >
                    {isUploading ? "Uploading..." : "🖼️ Image"}
                </button>
            </div>
        </div>
    );
};

// Helper function untuk generate nomor otomatis
const getSectionNumber = (section, allSections, parentNumber = null) => {
    if (parentNumber === null) {
        // Root section
        const rootSections = allSections.filter(s => !s.parent_id).sort((a, b) => (a.order || 0) - (b.order || 0));
        const index = rootSections.findIndex(s => s.id === section.id);
        return index >= 0 ? `${index + 1}.` : '';
    } else {
        // Sub-section
        const siblings = allSections.filter(s => s.parent_id === section.parent_id).sort((a, b) => (a.order || 0) - (b.order || 0));
        const index = siblings.findIndex(s => s.id === section.id);
        return index >= 0 ? `${parentNumber}${index + 1}.` : `${parentNumber}?.`;
    }
};

// Komponen Section Item dengan nested support dan auto-numbering
const SectionItem = ({ section, activeSection, onSelect, onAddSubSection, onEditTitle, onDelete, laporanId, allSections, parentNumber = null }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(section.title);
    const isActive = activeSection?.id === section.id;
    const hasChildren = section.children && section.children.length > 0;
    const sectionNumber = getSectionNumber(section, allSections, parentNumber);

    const handleSaveTitle = async () => {
        try {
            await axios.put(route('sections.update', section.id), {
                title: editTitle,
            });
            setIsEditing(false);
            router.reload({ only: ['laporan'], preserveScroll: true });
        } catch (error) {
            console.error('Error updating title:', error);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Yakin ingin menghapus "${section.title}"? Semua sub-bab di dalamnya juga akan terhapus.`)) {
            return;
        }
        try {
            await axios.delete(route('sections.destroy', section.id));
            router.reload({ only: ['laporan'], preserveScroll: true });
        } catch (error) {
            console.error('Error deleting section:', error);
        }
    };

    return (
        <li className="mb-2">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onSelect(section)}
                    className={`flex-1 text-left p-3 rounded-xl transition-all duration-200 ${
                        isActive
                            ? "bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-200"
                            : "bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200"
                    }`}
                >
                    {isEditing ? (
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={handleSaveTitle}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveTitle();
                                if (e.key === 'Escape') {
                                    setIsEditing(false);
                                    setEditTitle(section.title);
                                }
                            }}
                            className="w-full px-2 py-1 rounded bg-white text-gray-900 border border-gray-300"
                            autoFocus
                        />
                    ) : (
                        <span>
                            {sectionNumber && <span className="font-semibold text-indigo-600 mr-1">{sectionNumber}</span>}
                            {section.title}
                        </span>
                    )}
                </button>
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                            <button
                                onClick={() => {
                                    onAddSubSection(section.id);
                                    setShowMenu(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                            >
                                + Tambah Sub-bab
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(true);
                                    setShowMenu(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                ✏️ Edit Judul
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete();
                                    setShowMenu(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                            >
                                🗑️ Hapus
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {hasChildren && (
                <ul className="mt-2 ml-6 space-y-1">
                    {section.children.map((child, idx) => (
                        <SectionItem
                            key={child.id}
                            section={child}
                            activeSection={activeSection}
                            onSelect={onSelect}
                            onAddSubSection={onAddSubSection}
                            onEditTitle={onEditTitle}
                            onDelete={onDelete}
                            laporanId={laporanId}
                            allSections={allSections}
                            parentNumber={sectionNumber}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default function Edit({ auth, laporan }) {
    const { flash } = usePage().props;
    // Filter hanya root sections (tidak punya parent_id) dan urutkan
    const allSections = (laporan?.sections || []).sort((a, b) => (a.order || 0) - (b.order || 0));
    const rootSections = allSections.filter(s => !s.parent_id);
    const [activeSection, setActiveSection] = useState(
        rootSections.length > 0 ? rootSections[0] : null
    );
    const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'saved', null
    const [isProcessing, setIsProcessing] = useState(false);
    const [showAddSectionModal, setShowAddSectionModal] = useState(false);
    const [newSectionTitle, setNewSectionTitle] = useState('');
    const [newSectionParentId, setNewSectionParentId] = useState(null);
    const [isImporting, setIsImporting] = useState(false);

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post(route('images.upload'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                const imageUrl = response.data.url;
                // Return HTML dengan gambar dan caption otomatis
                // Format: gambar dengan paragraf caption di bawahnya
                const imageHtml = `<img src="${imageUrl}" alt="" style="width: 100%; height: auto; display: block; margin: 1em auto;" /><p class="text-center italic text-sm text-gray-500">Gambar: [Isi Caption]</p>`;
                return imageHtml;
            } else {
                throw new Error(response.data.message || 'Upload failed');
            }
        } catch (error) {
            throw error;
        }
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            FontFamily,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Image.configure({
                inline: false,
                allowBase64: false,
                HTMLAttributes: {
                    class: 'editor-image',
                },
            }),
        ],
        content: activeSection?.content || "",
        editable: !!activeSection,
        editorProps: {
            attributes: {
                class: "prose prose-lg max-w-none prose-headings:font-serif prose-p:font-serif prose-p:text-gray-900 prose-headings:text-gray-900 prose-strong:text-gray-900 prose-ul:text-gray-900 prose-ol:text-gray-900 focus:outline-none",
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

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            // Close all menus
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleSaveSection = () => {
        if (!activeSection || !editor) return;
        setIsProcessing(true);
        setSaveStatus('saving');

        router.put(
            route("sections.update", activeSection.id),
            {
                content: editor.getHTML(),
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsProcessing(false);
                },
                onSuccess: () => {
                    setSaveStatus('saved');
                    setTimeout(() => setSaveStatus(null), 3000);
                },
                onError: () => {
                    setSaveStatus(null);
                },
            }
        );
    };

    const handleAddSection = async () => {
        if (!newSectionTitle.trim()) return;
        
        try {
            await axios.post(route('sections.store', laporan.id), {
                title: newSectionTitle,
                parent_id: newSectionParentId,
            });
            setNewSectionTitle('');
            setNewSectionParentId(null);
            setShowAddSectionModal(false);
            router.reload({ only: ['laporan'], preserveScroll: true });
        } catch (error) {
            console.error('Error adding section:', error);
            alert('Gagal menambahkan bab. Coba lagi.');
        }
    };

    const handleAddSubSection = (parentId) => {
        setNewSectionParentId(parentId);
        setShowAddSectionModal(true);
    };

    const handleImportTemplate = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.docx')) {
            alert('Hanya file .docx yang didukung!');
            return;
        }

        setIsImporting(true);
        const formData = new FormData();
        formData.append('template_file', file);

        try {
            const response = await axios.post(route('templates.import', laporan.id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            router.reload({ only: ['laporan'], preserveScroll: true });
            alert('Template berhasil diimpor!');
        } catch (error) {
            console.error('Error importing template:', error);
            alert('Gagal mengimpor template: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsImporting(false);
            e.target.value = ''; // Reset input
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Editor: {laporan.judul}
                </h2>
                    <div className="flex items-center gap-3">
                        {saveStatus === 'saved' && (
                            <span className="text-sm text-green-600 font-medium animate-fade-in">
                                ✓ Berhasil disimpan
                            </span>
                        )}
                        <button
                            onClick={handleSaveSection}
                            disabled={isProcessing || !activeSection}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl disabled:bg-indigo-300 shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-200"
                        >
                            {isProcessing ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    💾 Simpan Perubahan
                                </>
                            )}
                        </button>
                    </div>
                </div>
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
                    <div className="bg-white overflow-hidden shadow-2xl sm:rounded-3xl border border-slate-200">
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/4 p-6 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-lg text-slate-900">
                                        📑 Outline Laporan
                                </h3>
                                </div>
                                            <button
                                    onClick={() => {
                                        setNewSectionParentId(null);
                                        setShowAddSectionModal(true);
                                    }}
                                    className="w-full mb-3 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    + Tambah Bab
                                            </button>
                                <label className="w-full mb-4 px-4 py-2 bg-slate-600 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-2">
                                    {isImporting ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Mengimpor...
                                        </>
                                    ) : (
                                        <>
                                            📂 Import Template (.docx)
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept=".docx"
                                        onChange={handleImportTemplate}
                                        disabled={isImporting}
                                        className="hidden"
                                    />
                                </label>
                                <ul className="space-y-2">
                                    {rootSections.map((section) => (
                                        <SectionItem
                                            key={section.id}
                                            section={section}
                                            activeSection={activeSection}
                                            onSelect={setActiveSection}
                                            onAddSubSection={handleAddSubSection}
                                            onEditTitle={() => {}}
                                            onDelete={() => {}}
                                            laporanId={laporan.id}
                                            allSections={allSections}
                                        />
                                    ))}
                                </ul>
                            </div>
                            <div className="w-full md:w-3/4 p-8">
                                {activeSection ? (
                                    <>
                                        <h2 className="text-2xl font-bold mb-4 text-gray-900">
                                            {activeSection.title}
                                        </h2>
                                        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden">
                                            <MenuBar editor={editor} onImageUpload={handleImageUpload} />
                                            <div className="bg-white text-gray-900 border border-gray-200 shadow-lg p-[2.5cm] min-h-[297mm] w-[210mm] mx-auto my-8 relative" style={{ zIndex: 1 }}>
                                                <style>{`
                                                    .ProseMirror {
                                                        color: #111827 !important;
                                                        background: white !important;
                                                        position: relative;
                                                        z-index: 1;
                                                        pointer-events: auto !important;
                                                        outline: none;
                                                        min-height: 100%;
                                                    }
                                                    .ProseMirror:focus {
                                                        outline: none;
                                                    }
                                                    .ProseMirror * {
                                                        color: #111827 !important;
                                                        pointer-events: auto !important;
                                                    }
                                                    .ProseMirror p {
                                                        color: #111827 !important;
                                                    }
                                                    .ProseMirror img {
                                                        display: block;
                                                        margin: 1em auto;
                                                        max-width: 100%;
                                                        width: 100%;
                                                        height: auto;
                                                        border-radius: 4px;
                                                    }
                                                    .ProseMirror p.text-center.italic.text-sm.text-gray-500 {
                                                        text-align: center;
                                                        font-style: italic;
                                                        font-size: 0.875rem;
                                                        color: #6b7280;
                                                        margin-top: 0.5em;
                                                    }
                                                `}</style>
                                        <EditorContent editor={editor} />
                                            </div>
                                        </div>

                                        <div className="mt-6 flex flex-wrap items-center gap-3">
                                            <a
                                                href={route(
                                                    "laporan.preview",
                                                    laporan.id
                                                )}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-600 text-white font-semibold rounded-xl shadow-lg hover:bg-slate-700 hover:shadow-xl transition-all duration-200"
                                            >
                                                👁️ Preview Laporan
                                            </a>

                                            <a
                                                href={route(
                                                    "laporan.download.pdf",
                                                    { laporan: laporan.id }
                                                )}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 border border-transparent rounded-xl font-semibold text-sm text-white hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                                            >
                                                📄 Download PDF
                                            </a>
                                            <a
                                                href={route(
                                                    "laporan.download.docx",
                                                    { laporan: laporan.id }
                                                )}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 border border-transparent rounded-xl font-semibold text-sm text-white hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                                            >
                                                📝 Download DOCX
                                            </a>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-10 h-full flex flex-col items-center justify-center text-gray-500">
                                        <p className="font-semibold text-lg">
                                            Pilih bab dari outline di kiri atau tambah bab baru.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah Bab/Sub-bab */}
            {showAddSectionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">
                            {newSectionParentId ? 'Tambah Sub-bab' : 'Tambah Bab'}
                        </h3>
                        <input
                            type="text"
                            value={newSectionTitle}
                            onChange={(e) => setNewSectionTitle(e.target.value)}
                            placeholder="Masukkan judul bab/sub-bab"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddSection();
                                if (e.key === 'Escape') {
                                    setShowAddSectionModal(false);
                                    setNewSectionTitle('');
                                    setNewSectionParentId(null);
                                }
                            }}
                            autoFocus
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleAddSection}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                            >
                                Tambah
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddSectionModal(false);
                                    setNewSectionTitle('');
                                    setNewSectionParentId(null);
                                }}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
