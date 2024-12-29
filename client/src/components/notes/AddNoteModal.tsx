import { Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react"
import { useState } from "react";
import { addNote } from "../../api/addNote";

function AddNoteModal({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) {
    const [title, setTitle] = useState('');
    const [tag, setTag] = useState('');

    const toast = useToast();

    const handleAddNote = async () => {
        const payload = {
            title, tag
        };
        const addedNote = await addNote(payload, sessionStorage.getItem('auth') ?? '');
        if(addedNote) {
            toast({
                title: 'Note Added',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onClose();
        }
    };

    return (
        <Box className="addNoteModalContainer">
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Adauga Notita</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Title</FormLabel>
                        <Input type='text' onChange={(e) => setTitle(e.target.value)} />
                    </FormControl>
                    <FormControl mt={'1rem'}>
                        <FormLabel>Tag</FormLabel>
                        <Input type='text' onChange={(e) => setTag(e.target.value)} />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button variant='ghost' mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button colorScheme='blue' onClick={handleAddNote}>Add</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default AddNoteModal