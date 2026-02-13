import { createPortal } from 'react-dom';
import styles from './AddLocationModal.module.css';
import AddLocationForm from './AddLocationForm';
import { useEffect, useState } from 'react';

interface AddLocationModalProps {
    onClose: () => void;
    initialCity?: string;
}

export default function AddLocationModal({ onClose, initialCity }: AddLocationModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Add New Location</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>
                <AddLocationForm onSuccess={onClose} initialCity={initialCity} />
            </div>
        </div>,
        document.body
    );
}
