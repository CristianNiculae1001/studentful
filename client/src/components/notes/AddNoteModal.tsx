import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { addNote } from '../../api/addNote';

function AddNoteModal({
	isOpen,
	onClose,
	isAddedNote,
	setIsAddedNote,
}: {
	isOpen: boolean;
	onClose: () => void;
	isAddedNote: boolean;
	setIsAddedNote: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [title, setTitle] = useState('');
	const [tag, setTag] = useState('');

	const toast = useToast();

	const handleAddNote = async () => {
		const payload = {
			title,
			tag,
		};
		const addedNote = await addNote(
			payload,
			localStorage.getItem('auth') ?? ''
		);
		if (addedNote) {
			toast({
				title: 'Note Added',
				status: 'success',
				duration: 3000,
				isClosable: true,
			});
			setIsAddedNote(true);
			onClose();
		}
	};

	useEffect(() => {
		if (isAddedNote) {
			setIsAddedNote(false);
		}
	}, [isAddedNote]);

	return (
		<Box className='addNoteModalContainer'>
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
						<Button colorScheme='blue' onClick={handleAddNote}>
							Add
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
}

export default AddNoteModal;
