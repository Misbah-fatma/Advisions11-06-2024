import React, { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import 'blockly/blocks';
import io from 'socket.io-client';
import { Box, Button, VStack, HStack, Text, useToast, Input, IconButton, ChakraProvider, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Select } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { javascriptGenerator } from 'blockly/javascript';
import { pythonGenerator } from 'blockly/python';
import { phpGenerator } from 'blockly/php';
import { luaGenerator } from 'blockly/lua';
import { dartGenerator } from 'blockly/dart';
import axios from 'axios';
import Output from '../Blocky/Output';
import Sidebar from '../Blocky/Sidebar';
import Navbar from '../LandingPage/Navbar';

const BlocklyComponent = () => {
  const blocklyDiv = useRef(null);
  const toolbox = useRef(null);
  const workspace = useRef(null);
  const socket = useRef(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [generatedXml, setGeneratedXml] = useState('');
  const [output, setOutput] = useState('');
  const toast = useToast();
  const editorRef = useRef(null);
  const [userData, setUserData] = useState(null);
  const incomingChange = useRef(false);
  const [roomId, setRoomId] = useState('');
  const roomIdRef = useRef('');
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [usernameToJoin, setUsernameToJoin] = useState('');
  const [language, setLanguage] = useState('javascript');

  useEffect(() => {
    const userDataFromStorage = localStorage.getItem('user');
    if (userDataFromStorage) {
      const parsedUserData = JSON.parse(userDataFromStorage);
      setUserData(parsedUserData);
    }
  }, []);

  const userId = userData ? userData._id : null;
  const username = userData?.userName;
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  const createRoom = () => {
    console.log("room is created");
    socket.current.emit('create-room');
    console.log(roomId);
  };

  const joinRoom = (id) => {
    if (socket.current && id) {
      socket.current.emit('join-room-request', { roomId: id, username });
    }
  };

  useEffect(() => {
    console.log('Initializing socket connection');
    if (blocklyDiv.current && toolbox.current && !workspace.current) {
      console.log('Initializing socket connection');
      socket.current = io('http://localhost:4000', {
        transports: ['websocket'],
      });

      socket.current.on('room-created', (id) => {
        setRoomId(id);
        roomIdRef.current = id;
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
        roomIdRef.current = roomId;
        console.log(roomId);
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

      socket.current.on('workspace-change', (data) => {
        if (workspace.current && !incomingChange.current) {
          console.log('Received workspace-change data', data);
          const json = JSON.parse(data.jsonText);
          incomingChange.current = true;
          Blockly.serialization.workspaces.load(json, workspace.current);
          incomingChange.current = false;
        }
      });

      console.log('Injecting Blockly workspace');
      workspace.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox.current,
      });

      const debouncedEmitChange = debounce((jsonText) => {
        if (roomIdRef.current) {
          console.log('Emitting workspace-change', roomIdRef.current, jsonText);
          socket.current.emit('workspace-change', { roomId: roomIdRef.current, jsonText });
        } else {
          console.log("No roomID");
        }
      }, 500);

      workspace.current.addChangeListener(() => {
        if (!incomingChange.current) {
          try {
            const json = Blockly.serialization.workspaces.save(workspace.current);
            const jsonText = JSON.stringify(json);
            debouncedEmitChange(jsonText);
        
          } catch (error) {
            console.error('Error during workspace change:', error);
          }
        }
      });

      return () => {
        if (socket.current) {
          socket.current.disconnect();
        }
      };
    }
  }, [blocklyDiv, toolbox]);

  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

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

  const handleConfirmJoin = () => {
    setIsOpen(false);
    socket.current.emit('approve-join', { roomId, username: usernameToJoin });
  };

  const handleCancelJoin = () => {
    setIsOpen(false);
  };

  const generateCode = () => {
    if (workspace.current) {
      try {
        let code;
        switch (language) {
          case 'javascript':
            code = javascriptGenerator.workspaceToCode(workspace.current);
            break;
          case 'python':
            code = `<?php\n${phpGenerator.workspaceToCode(workspace.current)}`;
            break;
          case 'php':
            code = phpGenerator.workspaceToCode(workspace.current);
            break;
          case 'lua':
            code = luaGenerator.workspaceToCode(workspace.current);
            break;
          case 'dart':
            code = dartGenerator.workspaceToCode(workspace.current);
            break;
          default:
            code = '';
        }
        setGeneratedCode(code);
      } catch (error) {
        console.error('Error generating code:', error);
      }
    }
  };

  const saveCodeAndOutput = async () => {
    if (userId && generatedCode) {
      try {
        const response = await axiosInstance.post('/api/solutions', {
          userId,
          code: generatedCode,
          output,
        });
        console.log('Response data:', response.data);
        if (response.data && response.data.message === 'Solution saved successfully') {
          toast({
            title: 'Success',
            description: 'Code and output saved successfully',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        } else {
          throw new Error('Unexpected response data');
        }
      } catch (error) {
        console.error('Error saving code and output:', error);
        toast({
          title: 'Error',
          description: 'Failed to save code and output',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: 'Error',
        description: 'User ID or generated code is missing',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFileClick = (file) => {
    if (file.content) {
      const xml = Blockly.Xml.textToDom(file.content);
      Blockly.Xml.domToWorkspace(xml, workspace.current);
      toast({
        title: 'File Loaded',
        description: `File ${file.name} has been loaded`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };


  const updateOutput = (newOutput) => {
    setOutput(newOutput);
  };

  return (
    <>
      <Navbar />
      <ChakraProvider>
        <VStack height="100vh" padding="10px" backgroundColor="gray.100" spacing="10px">
          <HStack spacing="10px" align="flex-start" justify="flex-start" width="100%">
            <Button backgroundColor="blue.500" color="white" onClick={createRoom}>
              Create Room
            </Button>
            <Input
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
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
          <HStack flex="1" width="100%" spacing="10px">
            <Box
              ref={blocklyDiv}
              flex="1"
              height="100%"
              minHeight="400px"
              backgroundColor="white"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.300"
            ></Box>
            <Sidebar onFileClick={handleFileClick} />
          </HStack>
          <xml style={{ display: 'none' }} ref={toolbox}>
            <block type="controls_if"></block>
            <block type="logic_compare"></block>
            <block type="controls_repeat_ext"></block>
            <block type="math_number"></block>
            <block type="math_arithmetic"></block>
            <block type="text"></block>
            <block type="text_print"></block>
            <block type="variables_get"></block>
            <block type="variables_set"></block>
            <block type="controls_whileUntil"></block>
            <block type="controls_for"></block>
            <block type="logic_boolean"></block>
            <block type="logic_negate"></block>
            <block type="logic_operation"></block>
            <block type="controls_forEach"></block>
          </xml>
          <HStack width="100%" spacing="10px">
            <VStack flex="1" spacing="10px">
              <Box
                width="100%"
                padding="10px"
                backgroundColor="gray.200"
                borderRadius="md"
                overflowY="auto"
                maxHeight="300px"
              >
                <Output
                  language={language}
                  code={generatedCode}
                  output={output}
                  setOutput={updateOutput}
                  editorRef={editorRef}
                />
              </Box>
            </VStack>
            <VStack flex="1" spacing="10px">
              <HStack spacing="10px">
                <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="lua">Lua</option>
                  <option value="dart">Dart</option>
             
                  <option value="php">PHP</option>
                </Select>
                <Button onClick={generateCode} colorScheme="blue">
                  Generate Code
                </Button>
                <Button onClick={saveCodeAndOutput} colorScheme="green">
                  Save Code
                </Button>
              </HStack>
              <Box
                width="100%"
                padding="10px"
                backgroundColor="gray.200"
                borderRadius="md"
                overflowY="auto"
                height="200px"
              >
                <Text fontFamily="monospace">{generatedCode}</Text>
              </Box>
            </VStack>
          </HStack>
        </VStack>
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

export default BlocklyComponent;

function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this, args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
