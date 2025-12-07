import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import axios from "axios";

// Tiptap Imports
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import { TextStyle } from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";

// Drag & Drop Imports
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- ICONS ---
const Icons = {
    Bold: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>,
    Italic: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>,
    Left: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>,
    Center: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"></line><line x1="17" y1="10" x2="7" y2="10"></line><line x1="19" y1="14" x2="5" y2="14"></line><line x1="17" y1="18" x2="7" y2="18"></line></svg>,
    Justify: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>,
    Image: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>,
    H2: () => <span className="font-serif font-bold text-xs">H2</span>,
    Menu: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>,
    ChevronLeft: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>,
    ChevronRight: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>,
    Trash: () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
    Plus: () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Edit: () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
    Drag: () => <svg className="w-4 h-4 text-slate-300 cursor-grab active:cursor-grabbing hover:text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>,
    FolderOpen: () => <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
    FolderClosed: () => <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>,
    Check: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    Close: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    Sub: () => <svg className="w-3 h-3 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"></circle></svg>,
    Import: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
};

// --- HELPER: BUILD TREE STRUCTURE ---
const buildSectionTree = (flatSections) => {
    if (!flatSections) return [];
    const sectionsMap = {};
    const roots = [];
    flatSections.forEach(section => { sectionsMap[section.id] = { ...section, children: [] }; });
    flatSections.forEach(section => {
        if (section.parent_id && sectionsMap[section.parent_id]) {
            sectionsMap[section.parent_id].children.push(sectionsMap[section.id]);
        } else {
            roots.push(sectionsMap[section.id]);
        }
    });
    const sortFn = (a, b) => (a.order || 0) - (b.order || 0);
    roots.sort(sortFn);
    Object.values(sectionsMap).forEach(s => s.children.sort(sortFn));
    return roots;
};

// --- TOOLBAR ---
const MenuBar = ({ editor, onImageUpload }) => {
    const triggerUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            await onImageUpload(file);
        };
        input.click();
    };

    if (!editor) return null;

    const Button = ({ onClick, isActive, disabled, children }) => (
        <button type="button" onClick={onClick} disabled={disabled} className={`p-1.5 rounded-md transition-all ${isActive ? "bg-indigo-100 text-indigo-700" : "text-slate-600 hover:bg-slate-100"} ${disabled ? "opacity-50" : ""}`}>{children}</button>
    );

    return (
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 py-2 flex items-center gap-3 rounded-t-xl shadow-sm">
            <div className="flex gap-1 border-r pr-2"><Button onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")}><Icons.Bold/></Button><Button onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")}><Icons.Italic/></Button></div>
            <div className="flex gap-1 border-r pr-2"><Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive("heading", { level: 2 })}><Icons.H2/></Button></div>
            <div className="flex gap-1 border-r pr-2">
                <Button onClick={() => editor.chain().focus().setTextAlign("left").run()} isActive={editor.isActive({ textAlign: "left" })}><Icons.Left/></Button>
                <Button onClick={() => editor.chain().focus().setTextAlign("center").run()} isActive={editor.isActive({ textAlign: "center" })}><Icons.Center/></Button>
                <Button onClick={() => editor.chain().focus().setTextAlign("justify").run()} isActive={editor.isActive({ textAlign: "justify" })}><Icons.Justify/></Button>
            </div>
            <Button onClick={triggerUpload}><Icons.Image/></Button>
        </div>
    );
};

// --- SIDEBAR ITEM ---
const SortableSectionItem = ({ section, activeSection, onSelect, onAddSubSection, onDelete }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
    
    const [isOpen, setIsOpen] = useState(true);
    const [isAddingChild, setIsAddingChild] = useState(false);
    const [newChildTitle, setNewChildTitle] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(section.title);
    const [showMenu, setShowMenu] = useState(false);

    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
    const isActive = activeSection?.id === section.id;

    const handleSaveTitle = async () => {
        try { await axios.put(route('sections.update', section.id), { title: editTitle }); setIsEditing(false); router.reload({ only: ['laporan'] }); } catch (error) { console.error(error); }
    };

    const handleSaveChild = async () => {
        if (!newChildTitle.trim()) return setIsAddingChild(false);
        try {
            await onAddSubSection(section.id, newChildTitle); 
            setNewChildTitle("");
            setIsAddingChild(false);
            setIsOpen(true); 
        } catch (e) { alert("Gagal nambah sub-bab"); }
    };

    return (
        <li ref={setNodeRef} style={style} className="mb-1 select-none">
            <div className={`group flex items-center gap-1 rounded-md transition-all py-1.5 px-1.5 ${isActive ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100" : "hover:bg-slate-50 text-slate-700 border border-transparent"}`}>
                <div {...attributes} {...listeners} className="p-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-slate-500"><Icons.Drag /></div>
                <button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className="p-1 rounded hover:bg-slate-200 text-slate-400">
                    {section.children?.length > 0 ? (isOpen ? <Icons.FolderOpen/> : <Icons.FolderClosed/>) : <div className="w-3"/>}
                </button>
                <button onClick={() => onSelect(section)} className="flex-1 text-left truncate text-sm font-semibold py-0.5">
                    {isEditing ? (
                        <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onBlur={handleSaveTitle} onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()} className="w-full px-1 py-0 bg-white border border-indigo-300 rounded focus:ring-0 text-sm" autoFocus onClick={(e) => e.stopPropagation()} />
                    ) : section.title}
                </button>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-0.5">
                    <button onClick={(e) => { e.stopPropagation(); setIsAddingChild(true); setIsOpen(true); }} className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" title="Tambah Sub-bab"><Icons.Plus/></button>
                    <div className="relative">
                        <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200"><Icons.Menu/></button>
                        {showMenu && (
                            <>
                                <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)}/>
                                <div className="absolute right-0 top-6 w-32 bg-white rounded-lg shadow-xl border border-slate-100 z-30 py-1 flex flex-col">
                                    <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="text-left px-3 py-1.5 text-xs hover:bg-slate-50 flex gap-2 items-center text-slate-600"><Icons.Edit/> Rename</button>
                                    <button onClick={() => { if(confirm('Hapus bab ini?')) onDelete(section.id); setShowMenu(false); }} className="text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex gap-2 items-center"><Icons.Trash/> Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {isOpen && (
                <ul className="ml-5 pl-3 border-l border-slate-200 space-y-0.5 mt-1 pb-1">
                    {section.children?.map((child) => (
                        <li key={child.id} className={`group/sub flex items-center justify-between py-1 px-2 rounded-md ${activeSection?.id === child.id ? 'bg-slate-100 text-indigo-600 font-medium' : 'hover:bg-slate-50 text-slate-500'}`}>
                            <button onClick={() => onSelect(child)} className="text-xs text-left truncate flex-1 flex items-center gap-2"><Icons.Sub />{child.title}</button>
                            <button onClick={(e) => { e.stopPropagation(); if(confirm('Hapus sub-bab?')) onDelete(child.id); }} className="opacity-0 group-hover/sub:opacity-100 p-0.5 text-slate-300 hover:text-red-500"><Icons.Trash/></button>
                        </li>
                    ))}
                    {isAddingChild && (
                        <li className="flex items-center gap-1 px-2 py-1 bg-white border border-indigo-200 rounded-md shadow-sm ml-1">
                            <input autoFocus value={newChildTitle} onChange={(e) => setNewChildTitle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSaveChild(); if (e.key === 'Escape') setIsAddingChild(false); }} placeholder="Judul sub-bab..." className="w-full text-xs border-none p-0 focus:ring-0 text-slate-700 placeholder:text-slate-300" />
                            <button onClick={handleSaveChild} className="text-emerald-500 hover:text-emerald-700"><Icons.Check/></button>
                            <button onClick={() => setIsAddingChild(false)} className="text-red-400 hover:text-red-600"><Icons.Close/></button>
                        </li>
                    )}
                </ul>
            )}
        </li>
    );
};

// --- MAIN PAGE ---
export default function Edit({ auth, laporan }) {
    const [treeSections, setTreeSections] = useState([]);
    
    // Convert flat data to tree
    useEffect(() => {
        if(laporan?.sections) {
            setTreeSections(buildSectionTree(laporan.sections));
        }
    }, [laporan]);

    const [activeSection, setActiveSection] = useState(() => {
        const sections = laporan?.sections || [];
        return sections.find(s => !s.parent_id) || null;
    });

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [saveStatus, setSaveStatus] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showRootAdd, setShowRootAdd] = useState(false);
    const [newRootTitle, setNewRootTitle] = useState('');
    const [isImporting, setIsImporting] = useState(false);

    // TIPTAP
    const editor = useEditor({
        extensions: [
            StarterKit, TextStyle, FontFamily,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Image.configure({ inline: false, allowBase64: true }), // Enable Base64
        ],
        content: activeSection?.content || "",
        onUpdate: () => setSaveStatus(null),
    });

    useEffect(() => {
        if (editor && activeSection && editor.getHTML() !== activeSection.content) {
            editor.commands.setContent(activeSection.content);
        }
    }, [activeSection, editor]);

    // --- HANDLER IMAGE UPLOAD (JURUS MABOK - BASE64) ---
    // Bypass server, simpan gambar sebagai text di DB
    const handleImageUpload = (file) => {
        if (!file) return;

        // Validasi ukuran (max 5MB biar ga berat bgt)
        if (file.size > 5 * 1024 * 1024) {
            alert("Ukuran gambar terlalu besar! Maksimal 5MB.");
            return Promise.reject("File too large");
        }

        return new Promise((resolve) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const base64String = e.target.result;
                
                // Masukin ke Editor Tiptap
                editor.chain().focus().setImage({ src: base64String }).run();
                
                // Tambahin caption otomatis
                editor.chain().focus().enter().insertContent(
                    `<p style="text-align: center; font-style: italic; font-size: 0.875rem; color: #666;">Gambar: ${file.name}</p>`
                ).run();
                
                resolve();
            };

            // Mulai baca file
            reader.readAsDataURL(file);
        });
    };

    const handleSaveContent = () => {
        if (!activeSection) return;
        setIsProcessing(true);
        setSaveStatus('saving');
        router.put(route("sections.update", activeSection.id), { content: editor.getHTML() }, {
            preserveScroll: true,
            onFinish: () => setIsProcessing(false),
            onSuccess: () => { setSaveStatus('saved'); setTimeout(() => setSaveStatus(null), 3000); }
        });
    };

    const handleAddSubSection = async (parentId, title) => {
        try {
            await axios.post(route('sections.store', laporan.id), { title: title, parent_id: parentId });
            router.reload({ only: ['laporan'], preserveScroll: true });
        } catch (e) { throw e; }
    };

    const handleDeleteSection = async (id) => {
        try {
            await axios.delete(route('sections.destroy', id));
            router.reload({ only: ['laporan'], preserveScroll: true });
            if (activeSection?.id === id) setActiveSection(null);
        } catch (e) { alert('Gagal hapus'); }
    };

    const handleAddRootSection = async () => {
        if (!newRootTitle.trim()) return;
        try {
            await axios.post(route('sections.store', laporan.id), { title: newRootTitle });
            setNewRootTitle(''); setShowRootAdd(false);
            router.reload({ only: ['laporan'] });
        } catch (e) { alert('Gagal tambah bab'); }
    };

    // LOGIC IMPORT TEMPLATE
    const handleImportTemplate = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setIsImporting(true);
        const formData = new FormData();
        formData.append('template_file', file);

        try {
            await axios.post(route('templates.import', laporan.id), formData, { 
                headers: { 'Content-Type': 'multipart/form-data' } 
            });
            alert('Sukses import template!');
            router.reload({ only: ['laporan'] });
        } catch (error) { 
            alert('Gagal import: ' + (error.response?.data?.message || error.message)); 
        } finally { 
            setIsImporting(false); 
            e.target.value = ''; 
        }
    };

    // DRAG (Root Only)
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const newTree = [...treeSections];
            const oldIndex = newTree.findIndex(i => i.id === active.id);
            const newIndex = newTree.findIndex(i => i.id === over.id);
            const reordered = arrayMove(newTree, oldIndex, newIndex);
            setTreeSections(reordered);
            const orderData = reordered.map((item, index) => ({ id: item.id, order: index + 1 }));
            axios.post(route('sections.reorder'), { orders: orderData }).catch(err => console.error(err));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={
            <div className="flex justify-between items-center h-8">
                <div className="flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 bg-slate-200 rounded text-slate-600 hover:bg-slate-300"><Icons.Menu/></button>
                    <h2 className="font-bold text-lg text-slate-800 truncate max-w-[200px]">{laporan.judul}</h2>
                </div>
                <div className="flex items-center gap-3">
                    {saveStatus === 'saved' && <span className="text-emerald-600 text-xs font-bold animate-fade-in">Saved</span>}
                    <button onClick={handleSaveContent} disabled={isProcessing} className="px-3 py-1.5 bg-slate-900 text-white rounded-md font-bold text-xs hover:bg-slate-800 transition">
                        {isProcessing ? '...' : 'Simpan'}
                    </button>
                </div>
            </div>
        }>
            <Head title={`Editor - ${laporan.judul}`} />
            <style>{`.ProseMirror { min-height: 100%; outline: none; } .editor-image { display: block; margin: 1.5em auto; max-width: 100%; }`}</style>

            <div className="flex h-[calc(100vh-65px)] overflow-hidden bg-slate-100">
                {/* --- SIDEBAR --- */}
                <div className={`${sidebarOpen ? 'w-72' : 'w-0'} bg-white border-r transition-all duration-300 flex flex-col`}>
                    
                    {/* HEADER SIDEBAR (TOMBOL BAB BARU & IMPORT) */}
                    <div className="p-4 border-b bg-white space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Outline</span>
                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{treeSections.length} Bab</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setShowRootAdd(true)} className="flex items-center justify-center gap-1 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-lg border border-indigo-100 text-xs hover:bg-indigo-100"><Icons.Plus/> Bab Baru</button>
                            <label className={`flex items-center justify-center gap-1 py-2 bg-white text-slate-600 font-bold rounded-lg border border-slate-200 text-xs hover:bg-slate-50 cursor-pointer ${isImporting ? 'opacity-50' : ''}`}>
                                {isImporting ? <span className="animate-spin text-xs">⏳</span> : <Icons.Import/>}
                                {isImporting ? 'Loading' : 'Import Word'}
                                <input type="file" accept=".docx" onChange={handleImportTemplate} disabled={isImporting} className="hidden" />
                            </label>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={treeSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                                <ul>
                                    {treeSections.map((section, index) => (
                                        <SortableSectionItem key={section.id} section={section} activeSection={activeSection} onSelect={setActiveSection} onAddSubSection={handleAddSubSection} index={index} onDelete={handleDeleteSection} />
                                    ))}
                                </ul>
                            </SortableContext>
                        </DndContext>
                        
                        {showRootAdd && (
                            <div className="mt-2 flex items-center gap-1 px-2 py-1 bg-white border border-indigo-200 rounded-md shadow-sm animate-in fade-in slide-in-from-top-1">
                                <input autoFocus value={newRootTitle} onChange={(e) => setNewRootTitle(e.target.value)} onKeyDown={async (e) => { if (e.key === 'Enter' && newRootTitle.trim()) { try { await axios.post(route('sections.store', laporan.id), { title: newRootTitle }); setNewRootTitle(''); setShowRootAdd(false); router.reload({ only: ['laporan'] }); } catch (e) {} } if (e.key === 'Escape') setShowRootAdd(false); }} placeholder="Judul Bab Baru..." className="w-full text-sm border-none p-0 focus:ring-0 placeholder:text-slate-300" />
                                <button onClick={() => setShowRootAdd(false)} className="text-slate-400 hover:text-red-500"><Icons.Close/></button>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t bg-slate-50 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                            <a href={route("laporan.preview", laporan.id)} target="_blank" className="text-center py-1.5 text-xs font-bold border rounded bg-white text-slate-600 hover:bg-slate-50">Preview</a>
                            <a href={route("laporan.download.pdf", laporan.id)} className="text-center py-1.5 text-xs font-bold border border-red-200 text-red-600 bg-red-50 rounded hover:bg-red-100">PDF</a>
                        </div>
                        <a href={route("laporan.download.docx", laporan.id)} className="block text-center py-1.5 text-xs font-bold border border-blue-200 text-blue-600 bg-blue-50 rounded hover:bg-blue-100">Word (.docx)</a>
                    </div>
                </div>

                {/* --- EDITOR --- */}
                <div className="flex-1 overflow-y-auto bg-slate-100 p-8 flex justify-center">
                    {activeSection ? (
                        <div className="w-full max-w-[210mm] bg-white shadow-xl min-h-[297mm] rounded-xl overflow-hidden ring-1 ring-slate-200">
                            <MenuBar editor={editor} onImageUpload={handleImageUpload} />
                            <div className="p-[2.5cm] min-h-[25cm] cursor-text" onClick={() => editor?.chain().focus().run()}>
                                <EditorContent editor={editor} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 h-full">
                            <Icons.Edit />
                            <p className="mt-2 text-sm">Pilih Bab di kiri untuk mulai menulis.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}