import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import {
  Box,
  Button,
  VStack,
  HStack,
  Textarea,
  Input,
  Text,
  useToast,
  IconButton,
  ChakraProvider,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import axios from 'axios';
import Output from '../Blocky/Output';
import Sidebar from './SideBar';
import Navbar from '../LandingPage/Navbar';
import { CODE_SNIPPETS } from "../CodeEditor/constants.js";
import LanguageSelector from "./Language.js";


const CollaborativeEditor = () => {
  const socket = useRef(null);
  const editorRef = useRef(null);
  const [text, setText] = useState('');
  const [roomId, setRoomId] = useState('');
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [usernameToJoin, setUsernameToJoin] = useState('');
  const toast = useToast();
  const [userData, setUserData] = useState(null);
  const [code, setCode] = useState(CODE_SNIPPETS["javascript"]);
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState('');
  const userId = userData ? userData._id : null;
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  useEffect(() => {
    const userDataFromStorage = localStorage.getItem('user');
    if (userDataFromStorage) {
      const parsedUserData = JSON.parse(userDataFromStorage);
      setUserData(parsedUserData);
    }
  }, []);

  const username = userData?.userName;

  useEffect(() => {
    socket.current = io('http://localhost:4000', {
      transports: ['websocket'],
    });

    socket.current.on('room-created', (id) => {
      setRoomId(id);
      setJoinedRoom(true);
      setIsCreator(true);
      toast({
        title: 'Room Created',
        description: `Room ID: ${id}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    });

    socket.current.on('join-room-request', ({ roomId, username }) => {
      setUsernameToJoin(username);
      setIsOpen(true);
    });

    socket.current.on('join-room-approved', (roomId) => {
      setRoomId(roomId);
      setJoinedRoom(true);
      toast({
        title: 'Joined Room',
        description: `You have joined room: ${roomId}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    });

    socket.current.on('participant-joined', (username) => {
      toast({
        title: 'New Participant',
        description: `User ${username} has joined the room`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    });

    socket.current.on('text-change', (data) => {
      if (!roomId || data.roomId === roomId) {
        console.log('Received text-change data', data.text);
        setText(data.text);
      }
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  const createRoom = () => {
    socket.current.emit('create-room');
  };

  const joinRoom = (id) => {
    if (socket.current && id) {
      socket.current.emit('join-room-request', { roomId: id, username });
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId)
      .then(() => {
        toast({
          title: 'Copied',
          description: `Room ID copied to clipboard: ${roomId}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error('Failed to copy room ID:', error);
        toast({
          title: 'Error',
          description: 'Failed to copy room ID',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    if (roomId) {
      socket.current.emit('text-change', { roomId, text: newText });
    }
  };

  const handleConfirmJoin = () => {
    setIsOpen(false);
    socket.current.emit('approve-join', { roomId, username: usernameToJoin });
  };

  const handleCancelJoin = () => {
    setIsOpen(false);
  };

  const handleCodeSelect = (code, language) => {
    setText(code);
    setLanguage(language);
  };

  const onSave = async () => {
    try {
      const response = await axiosInstance.post(
        "/api/save",
        { language, code, output, userId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("auth_token"),
          },
        }
      );
      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Code Saved to Database',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: 'Error occurred while saving code',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error saving code:", error);
      toast({
        title: 'Error',
        description: 'An error occurred while saving code',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFileClick = async (fileId) => {
    try {
      const response = await axiosInstance.get(`/file/${fileId}`);
      if (response.data && response.data.json) {
        setText(response.data.code);
        setOutput(response.data.output);
      }
    } catch (error) {
      console.error('Error loading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to load file',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const onSelect = (language) => {
    setLanguage(language);
    setCode(CODE_SNIPPETS[language]);
  };

  const updateOutput = (newOutput) => {
    setOutput(newOutput);
  };

  return (
    <>
    <Navbar/>
    <ChakraProvider>
      <Box display="flex" height="100vh" padding="10px" backgroundColor="gray.100">
        <VStack flex="1" padding="10px" spacing="10px">
          <HStack spacing="10px" align="flex-start" justify="flex-start" width="100%">
          <LanguageSelector language={language} onSelect={onSelect} />
            <Button backgroundColor="blue.500" color="white" onClick={createRoom}>
              Create Room
            </Button>
            <Input
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              disabled={joinedRoom}
              width="40%"
            />
            <IconButton
              aria-label="Copy Room ID"
              icon={<CopyIcon />}
              onClick={copyRoomId}
              backgroundColor="blue.500"
              color="white"
            />
            <Button backgroundColor="purple.500" color="white" onClick={() => joinRoom(roomId)}>
              Join Room
            </Button>
          </HStack>
          <Box
            width="100%"
            padding="10px"
            backgroundColor="gray.200"
            borderRadius="md"
            overflowY="auto"
            height="60vh"
          >
            <Textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Start typing..."
              size="sm"
              height="100%"
            />
          </Box>
          <Box width="100%" marginTop="20px">
              <Text fontSize="lg" fontWeight="bold">
                Output:
              </Text>
              <Box
                width="100%"
                padding="10px"
                backgroundColor="gray.200"
                borderRadius="md"
                overflowY="auto"
                height="30vh"
              >
                <Output
                  language={language}
                  code={text}
                  output={output}
                  setOutput={updateOutput}
                  editorRef={editorRef}
                />
              </Box>
              </Box>
        </VStack>
        <Sidebar onFileClick={handleFileClick} onCodeSelect={handleCodeSelect} />
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={undefined}
        onClose={handleCancelJoin}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Join Room Request
            </AlertDialogHeader>

            <AlertDialogBody>
              User {usernameToJoin} wants to join room {roomId}. Approve?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={handleCancelJoin}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleConfirmJoin} ml={3}>
                Approve
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </ChakraProvider>
    </>
  );
};

export default CollaborativeEditor;
