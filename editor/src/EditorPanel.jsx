import React, { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useParams } from 'react-router-dom';

const TextEditor = () => {
    const { uuid } = useParams();
    const stompClientRef = useRef(null);
    const prevContentRef = useRef('');
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);
    const timeoutRef = useRef(null);
    const isRemoteUpdateRef = useRef(false); // Флаг для отслеживания удаленных обновлений

    useEffect(() => {
        const stompClient = new Client({
            webSocketFactory: () => new SockJS(process.env.REACT_APP_BACKEND + '/ws'),
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log('Connected to WebSocket');

                stompClient.subscribe(`/topic/messages/${uuid}`, (message) => {
                    try {
                        const receivedMessage = JSON.parse(message.body);
                        if (receivedMessage.value !== prevContentRef.current || receivedMessage.title !== title) {
                            isRemoteUpdateRef.current = true; // Указываем, что данные пришли из WebSocket
                            setContent(receivedMessage.value);
                            setTitle(receivedMessage.title);
                        }
                        setIsInitialized(true);
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                });

                stompClient.publish({
                    destination: `/app/connect/${uuid}`,
                    body: uuid,
                });
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
            },
            onWebSocketError: (error) => {
                console.error('WebSocket error:', error);
            },
        });

        stompClient.activate();
        stompClientRef.current = stompClient;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [uuid]);

    const sendMessage = (value, currentTitle) => {
        if (stompClientRef.current && stompClientRef.current.connected && isInitialized) {
            const messageRequest = {
                id: uuid,
                value,
                title: currentTitle,
            };
            stompClientRef.current.publish({
                destination: `/app/send/${uuid}`,
                body: JSON.stringify(messageRequest),
            });
        }
    };

    const delayedSendMessage = (value, currentTitle) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            sendMessage(value, currentTitle);
        }, 500);
    };

    const handleContentChange = (value) => {
        if (isRemoteUpdateRef.current) {
            // Если данные пришли из WebSocket, сбрасываем флаг и не отправляем обратно
            isRemoteUpdateRef.current = false;
            return;
        }

        if (prevContentRef.current !== value) {
            setContent(value);
            prevContentRef.current = value;
            delayedSendMessage(value, title);
        }
    };

    const handleTitleChange = (event) => {
        const newTitle = event.target.value;
        if (isRemoteUpdateRef.current) {
            isRemoteUpdateRef.current = false;
            return;
        }
        setTitle(newTitle);
        delayedSendMessage(content, newTitle);
    };

    const handleKeyDown = (event) => {
        if (event.key === ' ' && event.shiftKey) {
            event.preventDefault();
        }
    };

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ header: [1, 2, 3, false] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ align: [] }],
            ['image', 'link'],
            ['clean'],
        ],
    };

    const formats = [
        'bold', 'italic', 'underline', 'strike',
        'header', 'list', 'bullet',
        'script', 'indent', 'align',
        'image', 'link',
    ];

    return (
        <div onKeyDown={handleKeyDown}>
            <h1>Online Text Editor</h1>
            <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter title"
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            />
            <ReactQuill
                value={content}
                onChange={handleContentChange}
                placeholder="Start typing..."
                modules={modules}
                formats={formats}
                style={{ height: '300px' }}
            />
        </div>
    );
};

export default TextEditor;