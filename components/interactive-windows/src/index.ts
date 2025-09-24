/**
 * Interactive Windows Component - Main Export
 *
 * Provides truly interactive modal window system for Alt1 applications
 * with full drag, resize, close functionality using DOM-based windows.
 */

import { InteractiveWindowManager } from './InteractiveWindowManager';

// Main exports
export { InteractiveWindowManager } from './InteractiveWindowManager';
export { InteractiveWindow } from './InteractiveWindow';

// Type exports
export type {
    InteractiveWindowConfig,
    InteractiveWindowManagerInterface,
    InteractiveWindow as IInteractiveWindow,
    WindowState,
    WindowEvent,
    WindowEventType,
    WindowTheme,
    WindowContentConfig,
    Point,
    Size,
    Rect,
    DragState,
    ResizeState,
    ResizeHandle
} from './types';

// Theme exports
export { WindowThemes } from './types';

// Default export for easier consumption
export default InteractiveWindowManager;

// Convenience factory function
export function createWindowManager(): InteractiveWindowManager {
    return new InteractiveWindowManager();
}

// Global singleton instance (optional)
let globalManager: InteractiveWindowManager | null = null;

export function getGlobalWindowManager(): InteractiveWindowManager {
    if (!globalManager) {
        globalManager = new InteractiveWindowManager();
    }
    return globalManager;
}

// Quick utility functions for common use cases
export function createModal(config: import('./types').InteractiveWindowConfig): import('./InteractiveWindow').InteractiveWindow {
    return getGlobalWindowManager().createModal(config);
}

export function createDialog(
    title: string,
    content: string | HTMLElement,
    buttons?: { text: string; onClick: () => void; primary?: boolean }[]
): import('./InteractiveWindow').InteractiveWindow {
    return getGlobalWindowManager().createDialog(title, content, buttons);
}

export function createSettingsModal(title: string, settingsContent: HTMLElement): import('./InteractiveWindow').InteractiveWindow {
    return getGlobalWindowManager().createSettingsModal(title, settingsContent);
}

export function alert(title: string, message: string): Promise<void> {
    return getGlobalWindowManager().alert(title, message);
}

export function confirm(title: string, message: string): Promise<boolean> {
    return getGlobalWindowManager().confirm(title, message);
}

// Settings modal template helper
export function createSettingsTemplate(settings: {
    title?: string;
    sections: {
        title: string;
        fields: {
            label: string;
            type: 'text' | 'number' | 'checkbox' | 'select' | 'textarea' | 'range';
            key: string;
            value?: any;
            options?: { label: string; value: any }[];
            min?: number;
            max?: number;
            step?: number;
            placeholder?: string;
        }[];
    }[];
    onSave?: (values: Record<string, any>) => void;
    onCancel?: () => void;
}): HTMLElement {
    const container = document.createElement('div');
    container.style.cssText = `
        display: flex;
        flex-direction: column;
        height: 100%;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Content area
    const content = document.createElement('div');
    content.style.cssText = `
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        background: #f8f9fa;
    `;

    const form = document.createElement('form');
    const values: Record<string, any> = {};

    settings.sections.forEach(section => {
        // Section header
        const sectionHeader = document.createElement('h3');
        sectionHeader.textContent = section.title;
        sectionHeader.style.cssText = `
            margin: 0 0 16px 0;
            color: #333;
            font-size: 16px;
            font-weight: 600;
            border-bottom: 1px solid #ddd;
            padding-bottom: 8px;
        `;
        form.appendChild(sectionHeader);

        // Section container
        const sectionContainer = document.createElement('div');
        sectionContainer.style.cssText = `
            margin-bottom: 24px;
            background: white;
            padding: 16px;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
        `;

        section.fields.forEach(field => {
            const fieldContainer = document.createElement('div');
            fieldContainer.style.cssText = 'margin-bottom: 16px;';

            // Label
            const label = document.createElement('label');
            label.textContent = field.label;
            label.style.cssText = `
                display: block;
                margin-bottom: 6px;
                font-weight: 500;
                color: #555;
            `;

            let input: HTMLElement;

            // Create input based on type
            switch (field.type) {
                case 'checkbox':
                    input = document.createElement('input');
                    (input as HTMLInputElement).type = 'checkbox';
                    (input as HTMLInputElement).checked = field.value || false;
                    values[field.key] = field.value || false;
                    input.addEventListener('change', (e) => {
                        values[field.key] = (e.target as HTMLInputElement).checked;
                    });
                    break;

                case 'select':
                    input = document.createElement('select');
                    field.options?.forEach(option => {
                        const optionEl = document.createElement('option');
                        optionEl.value = option.value;
                        optionEl.textContent = option.label;
                        optionEl.selected = option.value === field.value;
                        (input as HTMLSelectElement).appendChild(optionEl);
                    });
                    values[field.key] = field.value;
                    input.addEventListener('change', (e) => {
                        values[field.key] = (e.target as HTMLSelectElement).value;
                    });
                    break;

                case 'textarea':
                    input = document.createElement('textarea');
                    (input as HTMLTextAreaElement).value = field.value || '';
                    (input as HTMLTextAreaElement).placeholder = field.placeholder || '';
                    values[field.key] = field.value || '';
                    input.addEventListener('input', (e) => {
                        values[field.key] = (e.target as HTMLTextAreaElement).value;
                    });
                    break;

                case 'range':
                    input = document.createElement('input');
                    (input as HTMLInputElement).type = 'range';
                    (input as HTMLInputElement).min = (field.min || 0).toString();
                    (input as HTMLInputElement).max = (field.max || 100).toString();
                    (input as HTMLInputElement).step = (field.step || 1).toString();
                    (input as HTMLInputElement).value = (field.value || field.min || 0).toString();
                    values[field.key] = field.value || field.min || 0;

                    // Add value display
                    const valueDisplay = document.createElement('span');
                    valueDisplay.textContent = values[field.key].toString();
                    valueDisplay.style.cssText = 'margin-left: 8px; color: #666;';

                    input.addEventListener('input', (e) => {
                        const value = parseFloat((e.target as HTMLInputElement).value);
                        values[field.key] = value;
                        valueDisplay.textContent = value.toString();
                    });

                    const rangeContainer = document.createElement('div');
                    rangeContainer.style.cssText = 'display: flex; align-items: center;';
                    rangeContainer.appendChild(input);
                    rangeContainer.appendChild(valueDisplay);
                    input = rangeContainer;
                    break;

                default: // text, number
                    input = document.createElement('input');
                    (input as HTMLInputElement).type = field.type;
                    (input as HTMLInputElement).value = (field.value || '').toString();
                    (input as HTMLInputElement).placeholder = field.placeholder || '';
                    if (field.type === 'number') {
                        if (field.min !== undefined) (input as HTMLInputElement).min = field.min.toString();
                        if (field.max !== undefined) (input as HTMLInputElement).max = field.max.toString();
                        if (field.step !== undefined) (input as HTMLInputElement).step = field.step.toString();
                    }
                    values[field.key] = field.value || (field.type === 'number' ? 0 : '');
                    input.addEventListener('input', (e) => {
                        const target = e.target as HTMLInputElement;
                        values[field.key] = field.type === 'number' ? parseFloat(target.value) || 0 : target.value;
                    });
                    break;
            }

            // Style input
            if (input.tagName !== 'DIV') { // Skip range container
                input.style.cssText = `
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 14px;
                    box-sizing: border-box;
                `;
            }

            fieldContainer.appendChild(label);
            fieldContainer.appendChild(input);
            sectionContainer.appendChild(fieldContainer);
        });

        form.appendChild(sectionContainer);
    });

    content.appendChild(form);

    // Button bar
    const buttonBar = document.createElement('div');
    buttonBar.style.cssText = `
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        padding: 16px 20px;
        background: #f0f0f0;
        border-top: 1px solid #ddd;
    `;

    // Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = 'Cancel';
    cancelButton.style.cssText = `
        padding: 8px 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        font-size: 14px;
    `;
    cancelButton.addEventListener('click', () => {
        settings.onCancel?.();
    });

    // Save button
    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.textContent = 'Save';
    saveButton.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background: #007ACC;
        color: white;
        cursor: pointer;
        font-size: 14px;
    `;
    saveButton.addEventListener('click', () => {
        settings.onSave?.(values);
    });

    buttonBar.appendChild(cancelButton);
    buttonBar.appendChild(saveButton);

    container.appendChild(content);
    container.appendChild(buttonBar);

    return container;
}