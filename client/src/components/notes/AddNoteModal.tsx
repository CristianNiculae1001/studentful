import { Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { useState } from "react";

function AddNoteModal({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) {
    const [title, setTitle] = useState('');
    const [tag, setTag] = useState('');

    const handleAddNote = async () => {
        const payload = {
            title, tag
        };
        console.log(payload);
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