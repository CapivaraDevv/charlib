type NoteModalProps = {
    open: boolean;
    page: number;
    onClose: () => void;
    onSave: (content: string) => void
}