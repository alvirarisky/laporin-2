import React, { useState, useEffect, useMemo, useCallback } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
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
    BulletList: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
    OrderedList: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>,
    Code: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
    Quote: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path></svg>,
    Undo: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>,
    Redo: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"></path><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"></path></svg>,
    Menu: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>,
    Trash: () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
    Plus: () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Edit: () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
    Drag: () => <svg className="w-4 h-4 text-zinc-600 cursor-grab active:cursor-grabbing hover:text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>,
    FolderOpen: () => <svg className="w-3 h-3 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
    FolderClosed: () => <svg className="w-3 h-3 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>,
    Check: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    Close: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    Sub: () => <svg className="w-3 h-3 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"></circle></svg>,
    Import: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    ArrowRight: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>,
    ArrowLeft: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>,
    EditCover: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
};

// --- HELPER: BUILD TREE ---
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

// --- HELPER: FLATTEN TREE ---
const flattenSections = (nodes) => {
    let flat = [];
    nodes.forEach(node => {
        flat.push(node);
        if (node.children && node.children.length > 0) {
            flat = flat.concat(flattenSections(node.children));
        }
    });
    return flat;
};

// --- HELPER: UPDATE TREE RECURSIVE (NEW) ---
// Fungsi untuk mencari dan update konten bab spesifik di dalam struktur tree yang bersarang
const updateSectionRecursive = (sections, id, newContent) => {
    return sections.map(section => {
        // Jika ketemu bab yang diedit, update content-nya
        if (section.id === id) {
            return { ...section, content: newContent };
        }
        // Jika punya anak (sub-bab), cari juga di dalamnya
        if (section.children && section.children.length > 0) {
            return { ...section, children: updateSectionRecursive(section.children, id, newContent) };
        }
        return section;
    });
};

// --- MENU BAR (Dalam Kertas) ---
const MenuBar = ({ editor, onImageUpload }) => {
    const [updater, setUpdater] = useState(0);
    useEffect(() => {
        if (!editor) return;
        const forceUpdate = () => setUpdater(prev => prev + 1);
        editor.on('transaction', forceUpdate);
        editor.on('selectionUpdate', forceUpdate);
        return () => {
            editor.off('transaction', forceUpdate);
            editor.off('selectionUpdate', forceUpdate);
        };
    }, [editor]);

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

    const Button = ({ onClick, isActive, disabled, children, title }) => (
        <button type="button" onClick={onClick} disabled={disabled} title={title} className={`p-1.5 rounded-md transition-all ${isActive ? "bg-indigo-100 text-indigo-700" : "text-slate-600 hover:bg-slate-100"} ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}>{children}</button>
    );

    const handleFontChange = (e) => {
        const font = e.target.value;
        if (font === 'Times New Roman') editor.chain().focus().unsetFontFamily().run();
        else editor.chain().focus().setFontFamily(font).run();
    };

    const getCurrentFont = () => {
        if (editor.isActive('textStyle', { fontFamily: 'Arial' })) return 'Arial';
        if (editor.isActive('textStyle', { fontFamily: 'Courier New' })) return 'Courier New';
        if (editor.isActive('textStyle', { fontFamily: 'Georgia' })) return 'Georgia';
        if (editor.isActive('textStyle', { fontFamily: 'Verdana' })) return 'Verdana';
        return 'Times New Roman';
    };

    return (
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 py-2 flex flex-wrap items-center gap-1 rounded-t-xl shadow-sm">
            <div className="flex gap-0.5 border-r border-slate-200 pr-2 mr-1">
                <Button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Icons.Undo/></Button>
                <Button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Icons.Redo/></Button>
            </div>
            <div className="flex gap-0.5 border-r border-slate-200 pr-2 mr-1">
                 <select value={getCurrentFont()} onChange={handleFontChange} className="h-7 text-xs border-none bg-slate-50 text-slate-700 rounded focus:ring-0 cursor-pointer hover:bg-slate-100 w-32 py-0 pl-2 pr-6">
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Arial">Arial (Sans)</option>
                    <option value="Courier New">Courier New (Code)</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                </select>
            </div>
            <div className="flex gap-0.5 border-r border-slate-200 pr-2 mr-1">
                <Button onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} title="Bold"><Icons.Bold/></Button>
                <Button onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} title="Italic"><Icons.Italic/></Button>
                <Button onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive("codeBlock")} title="Code Block"><Icons.Code/></Button>
            </div>
            <div className="flex gap-0.5 border-r border-slate-200 pr-2 mr-1">
                <Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive("heading", { level: 2 })} title="Heading 2"><Icons.H2/></Button>
                <Button onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} title="Bullet List"><Icons.BulletList/></Button>
                <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")} title="Numbered List"><Icons.OrderedList/></Button>
                <Button onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")} title="Quote"><Icons.Quote/></Button>
            </div>
            <div className="flex gap-0.5 border-r border-slate-200 pr-2 mr-1">
                <Button onClick={() => editor.chain().focus().setTextAlign("left").run()} isActive={editor.isActive({ textAlign: "left" })} title="Left"><Icons.Left/></Button>
                <Button onClick={() => editor.chain().focus().setTextAlign("center").run()} isActive={editor.isActive({ textAlign: "center" })} title="Center"><Icons.Center/></Button>
                <Button onClick={() => editor.chain().focus().setTextAlign("justify").run()} isActive={editor.isActive({ textAlign: "justify" })} title="Justify"><Icons.Justify/></Button>
            </div>
            <Button onClick={triggerUpload} title="Insert Image"><Icons.Image/></Button>
        </div>
    );
};

// --- SIDEBAR ITEM (Dark Mode) ---
const SortableSectionItem = ({ section, activeSectionId, onSelect, onAddSubSection, onDelete }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
    const [isOpen, setIsOpen] = useState(true);
    const [isAddingChild, setIsAddingChild] = useState(false);
    const [newChildTitle, setNewChildTitle] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(section.title);
    const [showMenu, setShowMenu] = useState(false);

    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
    const isActive = activeSectionId === section.id;

    const handleSaveTitle = async () => { try { await axios.put(route('sections.update', section.id), { title: editTitle }); setIsEditing(false); router.reload({ only: ['laporan'] }); } catch (error) { console.error(error); } };
    const handleSaveChild = async () => { if (!newChildTitle.trim()) return setIsAddingChild(false); try { await onAddSubSection(section.id, newChildTitle); setNewChildTitle(""); setIsAddingChild(false); setIsOpen(true); } catch (e) { alert("Gagal nambah sub-bab"); } };

    return (
        <li ref={setNodeRef} style={style} className="mb-1 select-none">
            <div className={`group flex items-center gap-1 rounded-md transition-all py-1.5 px-1.5 ${isActive ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "hover:bg-zinc-800 text-zinc-300 border border-transparent"}`}>
                <div {...attributes} {...listeners} className="p-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:text-zinc-400"><Icons.Drag /></div>
                <button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className="p-1 rounded hover:bg-zinc-800 text-zinc-500">
                    {section.children?.length > 0 ? (isOpen ? <Icons.FolderOpen/> : <Icons.FolderClosed/>) : <div className="w-3"/>}
                </button>
                <button onClick={() => onSelect(section.id)} className="flex-1 text-left truncate text-sm font-semibold py-0.5">
                    {isEditing ? ( <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onBlur={handleSaveTitle} onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()} className="w-full px-1 py-0 bg-zinc-900 border border-indigo-500 rounded focus:ring-0 text-sm text-white" autoFocus onClick={(e) => e.stopPropagation()} /> ) : section.title}
                </button>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-0.5">
                    <button onClick={(e) => { e.stopPropagation(); setIsAddingChild(true); setIsOpen(true); }} className="p-1 rounded text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10" title="Tambah Sub-bab"><Icons.Plus/></button>
                    <div className="relative">
                        <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="p-1 rounded text-zinc-500 hover:text-white hover:bg-zinc-700"><Icons.Menu/></button>
                        {showMenu && (<><div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)}/><div className="absolute right-0 top-6 w-32 bg-[#18181b] rounded-lg shadow-xl border border-zinc-700 z-30 py-1 flex flex-col"><button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="text-left px-3 py-1.5 text-xs hover:bg-zinc-800 flex gap-2 items-center text-zinc-300 hover:text-white"><Icons.Edit/> Rename</button><button onClick={() => { if(confirm('Hapus bab ini?')) onDelete(section.id); setShowMenu(false); }} className="text-left px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 flex gap-2 items-center"><Icons.Trash/> Delete</button></div></>)}
                    </div>
                </div>
            </div>
            {isOpen && (<ul className="ml-5 pl-3 border-l border-zinc-800 space-y-0.5 mt-1 pb-1">{section.children?.map((child) => (<li key={child.id} className={`group/sub flex items-center justify-between py-1 px-2 rounded-md ${activeSectionId === child.id ? 'bg-zinc-800 text-indigo-400 font-medium' : 'hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-300'}`}><button onClick={() => onSelect(child.id)} className="text-xs text-left truncate flex-1 flex items-center gap-2"><Icons.Sub />{child.title}</button><button onClick={(e) => { e.stopPropagation(); if(confirm('Hapus sub-bab?')) onDelete(child.id); }} className="opacity-0 group-hover/sub:opacity-100 p-0.5 text-zinc-600 hover:text-red-400"><Icons.Trash/></button></li>))}{isAddingChild && (<li className="flex items-center gap-1 px-2 py-1 bg-zinc-900 border border-indigo-500/50 rounded-md shadow-sm ml-1"><input autoFocus value={newChildTitle} onChange={(e) => setNewChildTitle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSaveChild(); if (e.key === 'Escape') setIsAddingChild(false); }} placeholder="Judul sub-bab..." className="w-full text-xs border-none bg-transparent p-0 focus:ring-0 text-white placeholder:text-zinc-600" /><button onClick={handleSaveChild} className="text-emerald-500 hover:text-emerald-400"><Icons.Check/></button><button onClick={() => setIsAddingChild(false)} className="text-red-500 hover:text-red-400"><Icons.Close/></button></li>)}</ul>)}
        </li>
    );
};

// --- MODAL EDIT COVER (Dark Mode) ---
const EditCoverModal = ({ laporan, onClose }) => {
    const { data, setData, put, processing, errors } = useForm({
        judul: laporan.judul || '',
        nama: laporan.nama || '',
        nim: laporan.nim || '',
        prodi: laporan.prodi || '',
        mata_kuliah: laporan.mata_kuliah || '',
        dosen_pembimbing: laporan.dosen_pembimbing || '',
        instansi: laporan.instansi || '',
        kota: laporan.kota || '',
        tahun_ajaran: laporan.tahun_ajaran || '',
        logo: null,
    });

    const submit = (e) => {
        e.preventDefault();
        router.post(route('laporan.update', laporan.id), {
            _method: 'put',
            ...data
        }, {
            forceFormData: true,
            onSuccess: () => {
                onClose();
                alert("Data Cover Berhasil Disimpan!");
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#18181b] border border-zinc-700 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-zinc-700 flex justify-between items-center bg-zinc-900/50 sticky top-0">
                    <h3 className="text-lg font-bold text-white">Edit Data Cover</h3>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white"><Icons.Close/></button>
                </div>
                <form onSubmit={submit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Judul Laporan</label>
                        <input type="text" value={data.judul} onChange={e => setData('judul', e.target.value)} className="w-full text-sm bg-zinc-900 border-zinc-700 rounded-lg text-white focus:ring-indigo-500 focus:border-indigo-500" required />
                        {errors.judul && <div className="text-red-500 text-xs mt-1">{errors.judul}</div>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Nama Mahasiswa</label>
                            <input type="text" value={data.nama} onChange={e => setData('nama', e.target.value)} className="w-full text-sm bg-zinc-900 border-zinc-700 rounded-lg text-white" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">NIM</label>
                            <input type="text" value={data.nim} onChange={e => setData('nim', e.target.value)} className="w-full text-sm bg-zinc-900 border-zinc-700 rounded-lg text-white" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Program Studi</label>
                            <input type="text" value={data.prodi} onChange={e => setData('prodi', e.target.value)} className="w-full text-sm bg-zinc-900 border-zinc-700 rounded-lg text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Mata Kuliah</label>
                            <input type="text" value={data.mata_kuliah} onChange={e => setData('mata_kuliah', e.target.value)} className="w-full text-sm bg-zinc-900 border-zinc-700 rounded-lg text-white" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Dosen Pengampu</label>
                        <input type="text" value={data.dosen_pembimbing} onChange={e => setData('dosen_pembimbing', e.target.value)} className="w-full text-sm bg-zinc-900 border-zinc-700 rounded-lg text-white" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Instansi / Universitas</label>
                        <input type="text" value={data.instansi} onChange={e => setData('instansi', e.target.value)} className="w-full text-sm bg-zinc-900 border-zinc-700 rounded-lg text-white" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Kota</label>
                            <input type="text" value={data.kota} onChange={e => setData('kota', e.target.value)} className="w-full text-sm bg-zinc-900 border-zinc-700 rounded-lg text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Tahun Ajaran</label>
                            <input type="text" value={data.tahun_ajaran} onChange={e => setData('tahun_ajaran', e.target.value)} className="w-full text-sm bg-zinc-900 border-zinc-700 rounded-lg text-white" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Ganti Logo (Opsional)</label>
                        <input type="file" accept="image/*" onChange={e => setData('logo', e.target.files[0])} className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-indigo-400 hover:file:bg-zinc-700" />
                    </div>

                    <div className="pt-4 border-t border-zinc-700 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm font-bold hover:bg-zinc-700 transition border border-zinc-700">Batal</button>
                        <button type="submit" disabled={processing} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-500 transition shadow-md disabled:opacity-50">
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
export default function Edit({ auth, laporan }) {
    const [treeSections, setTreeSections] = useState([]);
    
    useEffect(() => { if(laporan?.sections) { setTreeSections(buildSectionTree(laporan.sections)); } }, [laporan]);

    // [FIX STATE] Simpan ID-nya saja, jangan objectnya
    const [activeSectionId, setActiveSectionId] = useState(() => {
        const sections = laporan?.sections || [];
        return sections.find(s => !s.parent_id)?.id || null;
    });

    const flatSections = useMemo(() => flattenSections(treeSections), [treeSections]);
    const activeSection = useMemo(() => flatSections.find(s => s.id === activeSectionId) || null, [flatSections, activeSectionId]);
    const activeIndex = useMemo(() => flatSections.findIndex(s => s.id === activeSectionId), [flatSections, activeSectionId]);
    const prevSection = activeIndex > 0 ? flatSections[activeIndex - 1] : null;
    const nextSection = activeIndex < flatSections.length - 1 ? flatSections[activeIndex + 1] : null;

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [saveStatus, setSaveStatus] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showRootAdd, setShowRootAdd] = useState(false);
    const [newRootTitle, setNewRootTitle] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [showEditCover, setShowEditCover] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [isDirty, setIsDirty] = useState(false); 

    const editor = useEditor({
        extensions: [ StarterKit, TextStyle, FontFamily, TextAlign.configure({ types: ["heading", "paragraph"] }), Image.configure({ inline: false, allowBase64: true, HTMLAttributes: { class: 'content-image' } }) ],
        content: activeSection?.content || "",
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none text-black !text-black min-h-full leading-relaxed',
                style: 'color: black !important;'
            },
        },
        onUpdate: ({ editor }) => {
            setSaveStatus(null);
            setIsDirty(true); 
            const text = editor.getText();
            setWordCount(text.trim().split(/\s+/).filter(w => w !== "").length);
        },
    });

    useEffect(() => {
        if (editor && activeSection) {
            if (editor.getHTML() !== activeSection.content) {
                editor.commands.setContent(activeSection.content);
                setIsDirty(false); 
                const text = editor.getText();
                setWordCount(text.trim().split(/\s+/).filter(w => w !== "").length);
            }
        }
    }, [activeSectionId, editor]);

    const handleImageUpload = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        if (file.size > 5 * 1024 * 1024) return alert("Max 5MB!");
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                editor.chain().focus().setImage({ src: e.target.result }).createParagraphNear().insertContent(`<p class="img-caption">Gambar: ${file.name}</p>`).run();
                resolve();
            };
            reader.readAsDataURL(file);
        });
    };

    // [FIX] Menggunakan AXIOS agar tidak reload & Update State Lokal
    const handleSaveContent = useCallback(async () => {
        if (!activeSectionId || !editor) return;
        
        const updateUrl = route("sections.update", activeSectionId);
        const newContent = editor.getHTML(); // Ambil konten terbaru dari editor

        setIsProcessing(true);
        setSaveStatus('saving');
        
        try {
            // 1. Simpan ke Database via API
            await axios.put(updateUrl, 
                { content: newContent },
                { headers: { 'Accept': 'application/json' } }
            );

            // 2. [FIX REALTIME] Update State Lokal agar tidak perlu refresh
            // Kita update treeSections dengan konten baru secara rekursif
            setTreeSections(prevSections => updateSectionRecursive(prevSections, activeSectionId, newContent));

            setSaveStatus('saved');
            setIsDirty(false); 
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (error) {
            console.error("Gagal simpan:", error);
            if (error.response && error.response.status === 422) {
                alert("Gagal simpan: Data tidak valid.");
            } else {
                alert("Gagal menyimpan perubahan!");
            }
        } finally {
            setIsProcessing(false);
        }
    }, [activeSectionId, editor]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSaveContent(); }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleSaveContent]);

    const handleSwitchSection = (newId) => {
        if (activeSectionId === newId) return;
        if (isDirty) {
            if (confirm("Ada perubahan belum disimpan! Simpan dulu?")) {
                handleSaveContent().then(() => setActiveSectionId(newId));
            } else {
                setActiveSectionId(newId);
            }
        } else {
            setActiveSectionId(newId);
        }
    };

    const handleAddSubSection = async (parentId, title) => { try { await axios.post(route('sections.store', laporan.id), { title: title, parent_id: parentId }); router.reload({ only: ['laporan'], preserveScroll: true }); } catch (e) { throw e; } };
    const handleDeleteSection = async (id) => { try { await axios.delete(route('sections.destroy', id)); router.reload({ only: ['laporan'], preserveScroll: true }); if (activeSectionId === id) setActiveSectionId(null); } catch (e) { alert('Gagal hapus'); } };
    const handleAddRootSection = async () => { if (!newRootTitle.trim()) return; try { await axios.post(route('sections.store', laporan.id), { title: newRootTitle }); setNewRootTitle(''); setShowRootAdd(false); router.reload({ only: ['laporan'] }); } catch (e) { alert('Gagal tambah bab'); } };
    const handleImportTemplate = async (e) => { const file = e.target.files[0]; if (!file) return; setIsImporting(true); const formData = new FormData(); formData.append('template_file', file); try { await axios.post(route('templates.import', laporan.id), formData, { headers: { 'Content-Type': 'multipart/form-data' } }); alert('Sukses import template!'); router.reload({ only: ['laporan'] }); } catch (error) { alert('Gagal import'); } finally { setIsImporting(false); e.target.value = ''; } };

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
            <div className="flex items-start gap-3 min-h-[2rem] py-1">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="shrink-0 p-1.5 bg-zinc-800 rounded text-zinc-400 hover:bg-zinc-700 mt-0.5"><Icons.Menu/></button>
                <h2 className="font-bold text-lg text-zinc-100 leading-snug break-words flex-1">{laporan.judul}</h2>
                {isDirty && <span className="text-xs text-amber-500 font-mono animate-pulse border border-amber-500/50 px-2 py-0.5 rounded">Unsaved Changes</span>}
            </div>
        }>
            <Head title={`Editor - ${laporan.judul}`} />
            
            {showEditCover && ( <EditCoverModal laporan={laporan} onClose={() => setShowEditCover(false)} /> )}

            <div className="flex h-[calc(100vh-65px)] overflow-hidden bg-[#09090b]">
                {/* --- SIDEBAR --- */}
                <div className={`${sidebarOpen ? 'w-72' : 'w-0'} bg-[#18181b] border-r border-zinc-800 transition-all duration-300 flex flex-col shadow-lg z-10 overflow-hidden`}>
                    <div className="p-4 border-b border-zinc-800 bg-[#18181b] space-y-3">
                        <div className="flex justify-between items-center"><span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Outline</span><span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">{treeSections.length} Bab</span></div>
                        <button onClick={() => setShowEditCover(true)} className="w-full flex items-center justify-center gap-1.5 py-2 bg-amber-500/10 text-amber-500 font-bold rounded-lg border border-amber-500/20 text-xs hover:bg-amber-500/20 mb-2 transition"><Icons.EditCover/> Edit Data Cover</button>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setShowRootAdd(true)} className="flex items-center justify-center gap-1 py-2 bg-indigo-500/10 text-indigo-400 font-bold rounded-lg border border-indigo-500/20 text-xs hover:bg-indigo-500/20"><Icons.Plus/> Bab Baru</button>
                            <label className={`flex items-center justify-center gap-1 py-2 bg-zinc-800 text-zinc-400 font-bold rounded-lg border border-zinc-700 text-xs hover:bg-zinc-700 cursor-pointer ${isImporting ? 'opacity-50' : ''}`}>{isImporting ? <span className="animate-spin text-xs">⏳</span> : <Icons.Import/>}{isImporting ? 'Loading' : 'Import Word'}<input type="file" accept=".docx" onChange={handleImportTemplate} disabled={isImporting} className="hidden" /></label>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}><SortableContext items={treeSections.map(s => s.id)} strategy={verticalListSortingStrategy}><ul>{treeSections.map((section, index) => (<SortableSectionItem key={section.id} section={section} activeSectionId={activeSectionId} onSelect={handleSwitchSection} onAddSubSection={handleAddSubSection} index={index} onDelete={handleDeleteSection} />))}</ul></SortableContext></DndContext>
                        {showRootAdd && (<div className="mt-2 flex items-center gap-1 px-2 py-1 bg-zinc-900 border border-indigo-500/50 rounded-md shadow-sm animate-in fade-in slide-in-from-top-1"><input autoFocus value={newRootTitle} onChange={(e) => setNewRootTitle(e.target.value)} onKeyDown={async (e) => { if (e.key === 'Enter' && newRootTitle.trim()) { try { await axios.post(route('sections.store', laporan.id), { title: newRootTitle }); setNewRootTitle(''); setShowRootAdd(false); router.reload({ only: ['laporan'] }); } catch (e) {} } if (e.key === 'Escape') setShowRootAdd(false); }} placeholder="Judul Bab Baru..." className="w-full text-sm border-none bg-transparent p-0 focus:ring-0 text-white placeholder:text-zinc-600" /><button onClick={() => setShowRootAdd(false)} className="text-zinc-500 hover:text-red-500"><Icons.Close/></button></div>)}
                    </div>
                    <div className="p-3 border-t border-zinc-800 bg-[#18181b] space-y-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.2)] z-10">
                        <div className="flex flex-col gap-2">
                            {saveStatus === 'saved' && (<div className="text-center text-xs font-bold text-emerald-400 bg-emerald-500/10 py-1 rounded border border-emerald-500/20 animate-pulse">✅ Berhasil Disimpan!</div>)}
                            <button onClick={handleSaveContent} disabled={isProcessing} className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-500 active:scale-[0.98] transition-all shadow-lg flex justify-center items-center gap-2" title="Tekan Ctrl+S untuk simpan">{isProcessing ? 'Menyimpan...' : <><Icons.Check /> Simpan Laporan</>}</button>
                        </div>
                        
                        {/* [FIX] Tombol Download & Preview diberi target _blank & rel noopener agar tidak dicegat Inertia */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
                            <a href={route("laporan.preview", laporan.id)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 py-2 text-xs font-bold border border-zinc-700 rounded bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition">Preview</a>
                            <a href={route("laporan.download.pdf", laporan.id)} target="_blank" rel="noopener noreferrer" download className="flex items-center justify-center gap-1 py-2 text-xs font-bold border border-red-500/20 text-red-400 bg-red-500/10 rounded hover:bg-red-500/20 transition">PDF</a>
                        </div>
                        <a href={route("laporan.download.docx", laporan.id)} target="_blank" rel="noopener noreferrer" download className="flex items-center justify-center gap-1 w-full py-2 text-xs font-bold border border-blue-500/20 text-blue-400 bg-blue-500/10 rounded hover:bg-blue-500/20 transition">Export Word (.docx)</a>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-[#09090b] p-8 flex justify-center">
                    {activeSection ? (
                        <div className="w-full max-w-[210mm] flex flex-col gap-4 mb-10">
                            <div className="bg-white shadow-2xl min-h-[297mm] rounded-xl overflow-hidden ring-1 ring-zinc-700/50 flex flex-col relative group text-black">
                                <MenuBar editor={editor} onImageUpload={handleImageUpload} />
                                <div className="p-[2.5cm] min-h-[25cm] cursor-text flex-1 text-black" onClick={() => editor?.chain().focus().run()}>
                                    <EditorContent editor={editor} />
                                </div>
                                <div className="absolute bottom-4 right-4 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 px-3 py-1 rounded-full text-xs font-mono text-zinc-400 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity select-none">
                                    {wordCount} Kata
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center px-2">
                                {prevSection ? (
                                    <button onClick={() => handleSwitchSection(prevSection.id)} className="group flex flex-col items-start gap-1 p-3 rounded-lg hover:bg-zinc-900 hover:shadow-md transition-all text-zinc-500 hover:text-indigo-400">
                                        <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1"><Icons.ArrowLeft/> Sebelumnya</span>
                                        <span className="text-sm font-semibold text-zinc-300 group-hover:text-indigo-300 max-w-[200px] truncate">{prevSection.title}</span>
                                    </button>
                                ) : <div/>}

                                {nextSection ? (
                                    <button onClick={() => handleSwitchSection(nextSection.id)} className="group flex flex-col items-end gap-1 p-3 rounded-lg hover:bg-zinc-900 hover:shadow-md transition-all text-zinc-500 hover:text-indigo-400">
                                        <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">Selanjutnya <Icons.ArrowRight/></span>
                                        <span className="text-sm font-semibold text-zinc-300 group-hover:text-indigo-300 max-w-[200px] truncate">{nextSection.title}</span>
                                    </button>
                                ) : <div/>}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-zinc-600 h-full">
                            <Icons.Edit />
                            <p className="mt-2 text-sm">Pilih Bab di kiri untuk mulai menulis.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}