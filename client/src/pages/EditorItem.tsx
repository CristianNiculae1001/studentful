import {
	Box,
	Icon,
	useColorModeValue,
	Text,
	Textarea,
	Breadcrumb,
	BreadcrumbItem,
	Button,
	useDisclosure,
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
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getEditorItem } from '../api/getEditorItem';
import { useDispatch } from 'react-redux';
import { updateUserData } from '../features/user';
import { FiSearch } from 'react-icons/fi';
import { marked } from 'marked';
// import { formatDate } from '../utils/formatDate';
import { MdOutlineModeEdit } from 'react-icons/md';
import { updateEditorItem } from '../api/updateEditorItem';
import '../styles/editorItem.css';

function EditorItem() {
	const { id } = useParams();
	const [data, setData] = useState<Record<string, any>>({});
	const [input, setInput] = useState<string>('');
	const [title, setTitle] = useState<string>('');
	const [tag, setTag] = useState<string>('');
	const editorRef = useRef<HTMLDivElement>(null);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const toast = useToast();
	const { isOpen, onClose, onOpen } = useDisclosure();

	const getEditorItemHandler = async () => {
		if (id) {
			const response = await getEditorItem(id);
			if (response?.status === 0) {
				// handle error
				dispatch(updateUserData(null));
				localStorage.removeItem('auth');
				navigate('/login');
				return;
			}
			setData(response?.data[0]);
			setInput(response?.data[0]?.content);
			setTitle(response?.data[0]?.title);
			setTag(response?.data[0]?.tag);
			const htmlContent = marked(response?.data[0]?.content);
			// @ts-ignore
			editorRef.current && (editorRef.current.innerHTML = htmlContent);
		}
	};

	useEffect(() => {
		getEditorItemHandler();
	}, [id]);

	const handleTextareaChange = (e: any) => {
		const value = e.target.value;
		setInput(value);
		const htmlContent = marked(value);
		// @ts-ignore
		editorRef.current && (editorRef.current.innerHTML = htmlContent);
	};

	const handleSave = async () => {
		if (id) {
			const response = await updateEditorItem({
				id: parseInt(id),
				title,
				tag,
				content: input,
			});
			if (response.status === 1) {
				setData(response.data[0]);
				toast({
					title: 'Success',
					description: 'Modificarile au fost salvate cu succes.',
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

	return (
		<Box className='editorItemContainer' p={'1rem'}>
			{id ? (
				<Box>
					<Box
						display={'flex'}
						justifyContent={'space-between'}
						alignItems={'center'}
						gap={'1rem'}
					>
						<Breadcrumb flex={1}>
							<BreadcrumbItem>
								<Link to='/editor'>Editor</Link>
							</BreadcrumbItem>

							<BreadcrumbItem>
								<Link to='/editor/list'>Lista</Link>
							</BreadcrumbItem>

							<BreadcrumbItem isCurrentPage>
								<Link to={`/editor/list/${id}`}>Lista #{id}</Link>
							</BreadcrumbItem>
						</Breadcrumb>

						<Box flex={1} textAlign={'center'}>
							<Text fontSize='1.5rem' fontWeight='bold'>
								{data?.title}
							</Text>
							{/* <Text fontSize='1rem' color='gray.500'>
								{data?.tag}
							</Text>
							<Text fontSize='1rem' color='gray.500'>
								{formatDate(data?.created_at)}
							</Text> */}
						</Box>

						<Box flex={1} textAlign={'right'}>
							<Button
								colorScheme='green'
								variant={'solid'}
								leftIcon={<MdOutlineModeEdit />}
								onClick={onOpen}
							>
								Actualizeaza
							</Button>
						</Box>
					</Box>

					<Box
						mt={'1rem'}
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
								border: '1px solid #d1d5db',
								borderRadius: '6px',
								color: '#4b5563',
								padding: '1rem',
								wordWrap: 'break-word',
								whiteSpace: 'pre',
								overflow: 'auto',
							}}
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
									<small id='tag-help'>
										Introduce un tag pentru modificari.
									</small>
								</Box>
							</ModalBody>

							<ModalFooter>
								<Button variant='ghost' mr={3} onClick={onClose}>
									Inchide
								</Button>
								<Button colorScheme='green' onClick={handleSave}>
									Salveaza
								</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>
				</Box>
			) : (
				<Box
					display='flex'
					flexDirection='column'
					alignItems='center'
					justifyContent='center'
					minH='68vh'
					color={useColorModeValue('gray.600', 'gray.400')}
					textAlign='center'
					animation='fadeIn 0.3s ease-in-out'
				>
					<Icon as={FiSearch} boxSize={12} mb={4} />
					<Text fontSize='1.5rem' fontWeight='bold'>
						Niciun id furnizat
					</Text>
					<Text fontSize='1rem' mt={2}>
						Nu exista niciun id furnizat pentru a afisa datele
					</Text>
				</Box>
			)}
		</Box>
	);
}

export default EditorItem;
