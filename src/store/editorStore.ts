import { create } from 'zustand';
import { Element, Template } from '../types/editor';

interface EditorStore {
  activeTemplate: Template | null;
  selectedElement: Element | null;
  setActiveTemplate: (template: Template) => void;
  setSelectedElement: (element: Element | null) => void;
  updateElement: (elementId: string, updates: Partial<Element>) => void;
  addElement: (element: Element) => void;
  removeElement: (elementId: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  activeTemplate: null,
  selectedElement: null,
  
  
  setActiveTemplate: (template) => set({ activeTemplate: template }),
  setSelectedElement: (element) => set({ selectedElement: element }),
  
  updateElement: (elementId, updates) =>
    set((state) => ({
      activeTemplate: state.activeTemplate
        ? {
            ...state.activeTemplate,
            elements: state.activeTemplate.elements.map((el) =>
              el.id === elementId ? { ...el, ...updates } : el
            ),
          }
        : null,
      selectedElement: state.selectedElement?.id === elementId
        ? { ...state.selectedElement, ...updates }
        : state.selectedElement, // Update selectedElement if it matches elementId
    })),
  addElement: (element) =>
    set((state) => ({
      activeTemplate: state.activeTemplate
        ? {
            ...state.activeTemplate,
            elements: [...state.activeTemplate.elements, element],
          }
        : null,
    })),
    
  removeElement: (elementId) =>
    set((state) => ({
      activeTemplate: state.activeTemplate
        ? {
            ...state.activeTemplate,
            elements: state.activeTemplate.elements.filter((el) => el.id !== elementId),
          }
        : null,
    })),
}));