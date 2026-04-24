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

    // THROTTLE THE SOCKET UPDATES!!!!
    const lastUpdateRef = useRef(0);

    // Socket
    useEffect(() => {
        const socket = io("http://localhost:3000");

        socket.on("connect", () => {
            console.log("Socket connected to server");
        })

        socket.on("progress", (progressData) => {
            const now = Date.now();

            if (now - lastUpdateRef.current > 500) { // 500 ms
                setDownloadProgress(progressData);
                lastUpdateRef.current = now;
            }
        });

        return () => {
            console.log("Socket disconnected");
            socket.disconnect();
        };
    }, []);

    return { downloadProgress, resetProgress };
}