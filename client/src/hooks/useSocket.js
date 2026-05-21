import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

export function useSocket() {
    const [downloadProgress, setDownloadProgress] = useState({
        infoHash: "",
        progress: "",
        speed: ""
    });

    const resetProgress = () => {
        setDownloadProgress({
            infoHash: "",
            progress: "",
            speed: ""
        });
    }

    const [isSocketOnline, setSocketOnline] = useState(false);
    const [fileList, setFileList] = useState(null);

    const lastUpdateRef = useRef(0);
    const socketRef = useRef(null);

    // Socket
    useEffect(() => {
        const socket = io(import.meta.env.DEV ? 'http://localhost:3000' : '');
        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Socket connected to server");
            setSocketOnline(true);
        })

        socket.on("progress", (progressData) => {
            const now = Date.now();

            if (now - lastUpdateRef.current > 500) { // 500 ms
                setDownloadProgress(progressData);
                lastUpdateRef.current = now;
            }
        });

        socket.on("fileList", (files) => setFileList(files));
        
        return () => {
            console.log("Socket disconnected");
            socket.disconnect();
            setSocketOnline(false);
        };
    }, []);
    
    const confirmFileSelection = (infoHash, selectedIndices) => {
        socketRef.current.emit("fileSelection", { infoHash, selectedIndices });
        setFileList(null);
    }

    return { downloadProgress, resetProgress, isSocketOnline, fileList, confirmFileSelection };
}