import {
	Box,
	Button,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Textarea,
	useColorModeValue,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { useRef, useState } from 'react';
import { marked } from 'marked';
import { CiCircleList } from 'react-icons/ci';
import { addEditorChanges } from '../api/addEditorChanges';
import { IoIosSave } from 'react-icons/io';

function Editor() {
	const navigate = useNavigate();
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const editorRef = useRef<any>(null);
	const [input, setInput] = useState('');
	const [title, setTitle] = useState('');
	const [tag, setTag] = useState('');

	const handleTextareaChange = (e: any) => {
		const value = e.target.value;
		setInput(value);
		const htmlContent = marked(value);
		editorRef.current && (editorRef.current.innerHTML = htmlContent);
	};

	const handleSave = async () => {
		const response = await addEditorChanges({
			title,
			tag,
			content: input,
		});
		if (response.status === 1) {
			toast({
				title: 'Success',
				description: 'Modificarea a fost salvata cu succes.',
				status: 'success',
				duration: 9000,
				isClosable: true,
			});
			onClose();
		} else {
			toast({
				title: 'Error',
				description: 'A aparut o eroare la salvarea modificarii.',
				status: 'error',
				duration: 9000,
				isClosable: true,
			});
		}
	};

	const placeholders = [
		'Java - polimorfism',
		'C++ - STL',
		'Python - Liste comprehensive',
		'Economie - Oferta si Cerere',
		'Matematica - Derivate',
		'Fizica - Mecanica',
		'Chimie - Rezolvare Probleme',
		'Biologie - Anatomie',
		'Istorie - Revolutia Industriala',
		'Geografie - Harti',
		'Engleza - Gramatica',
		'Franceza - Vocabular',
		'Germana - Pronuntie',
		'Spaniola - Dialog',
	];
	const randomPlaceholder =
		placeholders[Math.floor(Math.random() * placeholders.length)];

	const bgColorValue = useColorModeValue('white', 'rgba(255, 255, 255, 0.08)');
	const borderColorValue = useColorModeValue(
		'#ccc',
		'rgba(255, 255, 255, 0.04)'
	);
	const textColorValue = useColorModeValue('#1d2025', '#EDEDED');

	return (
		<Box className='editorContainer' p={'1rem'}>
			<Box
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					gap: '1rem',
					flexWrap: 'wrap',
				}}
			>
				<Box>
					<Button
						leftIcon={<CiCircleList fontSize={24} />}
						colorScheme='blue'
						onClick={() => navigate('/editor/list')}
					>
						Elementele salvate
					</Button>
				</Box>
				<Box
					className='saveButtonContainer'
					style={{ padding: '6px', paddingRight: '1rem', textAlign: 'end' }}
				>
					<Button
						isDisabled={input === ''}
						onClick={onOpen}
						colorScheme='green'
						leftIcon={<IoIosSave />}
					>
						Salveaza
					</Button>
				</Box>
			</Box>
			<Box
				mt={'8px'}
				className='textareaContainer'
				style={{
					padding: '1rem',
					paddingTop: 0,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					gap: '1rem',
				}}
			>
				<Textarea
					className='hpTextarea'
					placeholder={randomPlaceholder}
					value={input}
					onChange={handleTextareaChange}
					bg={bgColorValue}
					border={`1px solid ${borderColorValue}`}
					color={textColorValue}
					style={{
						resize: 'none',
						height: 'calc(100vh - 168px)',
						width: '50%',
					}}
				/>
				<Box
					className='markdownEditor'
					style={{
						height: 'calc(100vh - 168px)',
						width: '50%',
						borderRadius: '6px',
						padding: '1rem',
						wordWrap: 'break-word',
						whiteSpace: 'pre',
						overflow: 'auto',
					}}
					bg={bgColorValue}
					border={`1px solid ${borderColorValue}`}
					color={textColorValue}
					ref={editorRef}
				></Box>
			</Box>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Salveaza modificarile</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Box
							className='titleContainer'
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: '0.5rem',
							}}
						>
							<label htmlFor='materie'>Titlu</label>
							<Input
								id='title'
								aria-describedby='title-help'
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
							<small id='title-help'>Introduce un titlu sugestiv.</small>
						</Box>
						<Box
							className='tagContainer'
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: '0.5rem',
								marginTop: '1.5rem',
							}}
						>
							<label htmlFor='tag'>Tag (Optional)</label>
							<Input
								id='tag'
								aria-describedby='tag-help'
								value={tag}
								onChange={(e) => setTag(e.target.value)}
							/>
							<small id='tag-help'>Introduce un tag pentru modificari.</small>
						</Box>
					</ModalBody>

					<ModalFooter>
						<Button variant='ghost' mr={3} onClick={onClose}>
							Inchide
						</Button>
						<Button
							colorScheme='green'
							onClick={handleSave}
							isDisabled={title === ''}
							leftIcon={<IoIosSave />}
						>
							Salveaza
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
}

export default Editor;
