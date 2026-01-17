import React, { useCallback, useState } from 'react';
import { Upload, File, Loader2 } from 'lucide-react';
import robotMascot from '../assets/robot-mascot.png';
import './FileUpload.css';

const FileUpload = ({ onUpload, isUploading }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onUpload(e.dataTransfer.files[0]);
        }
    }, [onUpload]);

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };

    return (
        <div className="upload-container">
            <div
                className={`upload-zone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="file-input"
                    className="file-input"
                    onChange={handleChange}
                    accept=".pdf"
                    disabled={isUploading}
                />
                <label htmlFor="file-input" className="upload-label">
                    <div className="icon-wrapper">
                        {isUploading ? (
                            <Loader2 className="animate-spin" size={48} />
                        ) : (
                            <Upload size={48} />
                        )}
                    </div>
                    <div className="text-wrapper">
                        <h3>
                            {isUploading ? 'Uploading & Processing...' : 'Click to upload or drag and drop'}
                        </h3>
                        <p>PDF files up to 10MB</p>
                    </div>
                </label>
            </div>
        </div>
    );
};

export default FileUpload;
