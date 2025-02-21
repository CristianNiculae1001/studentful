import {
	Box,
	Button,
	Icon,
	Input,
	useColorModeValue,
	Text,
	InputGroup,
	InputLeftElement,
} from '@chakra-ui/react';
import { getNotes } from '../../api/getNotes';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

function List({ isAddedNote }: { isAddedNote: boolean }) {
	const [notes, setNotes] = useState<Record<string, any>[]>([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [searchInput, setSearchInput] = useState('');
	const [isSearched, setIsSearched] = useState(false);
	const navigate = useNavigate();

	const getNotesHandler = async () => {
		const response = await getNotes(
			sessionStorage.getItem('auth') ?? '',
			page,
			10,
			isSearched ? searchInput : undefined
		);
		if (response?.status === 0) {
			sessionStorage.removeItem('auth');
			navigate('/login');
			return;
		}
		setNotes(response?.data);
		setTotalPages(response?.totalPages);
	};

	const handleNotes = async () => {
		const response = await getNotes(
			sessionStorage.getItem('auth') ?? '',
			1,
			10,
			searchInput
		);
		if (response?.status === 0) {
			sessionStorage.removeItem('auth');
			navigate('/login');
			return;
		}
		setPage(1);
		setNotes(response?.data);
		setTotalPages(response?.totalPages);
	};

	const handleSearch = async () => {
		setIsSearched(true);
		handleNotes();
	};

	useEffect(() => {
		if (searchInput.length === 0) {
			setIsSearched(false);
			handleNotes();
		}
	}, [searchInput]);

	useEffect(() => {
		getNotesHandler();
	}, [page]);

	useEffect(() => {
		if (isAddedNote) {
			getNotesHandler();
		}
	}, [isAddedNote]);

	const noteBg = useColorModeValue('white', '#252A34');
	const noteBorder = useColorModeValue('#ccc', '#393E46');
	const textColor = useColorModeValue('#1d2025', '#EDEDED');
	const hoverShadow = useColorModeValue(
		'0 4px 12px rgba(0,0,0,0.15)',
		'0 4px 12px rgba(255,255,255,0.15)'
	);
	const bgImage = useColorModeValue(
		'linear-gradient(rgba(0, 0, 255, 0.15) 1px, transparent 1px)',
		'linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)'
	);
	const tagColor = useColorModeValue('gray.600', 'gray.400');
	const createdAtColor = useColorModeValue('gray.500', 'gray.400');

	return (
		<Box>
			<Box
				className='filterContainer'
				maxW={'320px'}
				pos={'absolute'}
				top={'5rem'}
			>
				<Box
					className='searchContainer'
					display='flex'
					gap='1rem'
					alignItems='center'
					flex='1'
					mr='1rem'
				>
					<Box className='searchInputContainer' flex='1'>
						<InputGroup>
							<InputLeftElement pointerEvents='none'>
								<FiSearch />
							</InputLeftElement>
							<Input
								type='search'
								placeholder='Search'
								className='searchInput'
								value={searchInput}
								onChange={(e) => {
									setSearchInput(e.target.value);
								}}
							/>
						</InputGroup>
					</Box>
					<Button
						colorScheme='blue'
						onClick={handleSearch}
						isDisabled={searchInput.length === 0}
					>
						Search
					</Button>
				</Box>
			</Box>

			{notes.length === 0 ? (
				<>
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
							Niciun rezultat găsit
						</Text>
						<Text fontSize='1rem' mt={2}>
							Încearcă să cauți altceva sau adaugă o notiță nouă.
						</Text>
					</Box>
				</>
			) : (
				<>
					<Box
						className='listContainer'
						display='grid'
						gridTemplateColumns='repeat(auto-fill, minmax(320px, 1fr))'
						gap='1rem'
						mt='1.5rem'
					>
						{notes?.map((note) => (
							<Box
								key={note.id as number}
								className='noteContainer'
								p='1rem'
								minH='10rem'
								bg={noteBg}
								color={textColor}
								border={`1px solid ${noteBorder}`}
								borderRadius='8px'
								cursor='pointer'
								transition='all 0.3s ease'
								_hover={{ transform: 'scale(1.02)', boxShadow: hoverShadow }}
								onClick={() => navigate(`/note/${note.id}`)}
								position='relative'
								boxShadow='lg'
								_before={{
									content: '""',
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									height: '100%',
									backgroundImage: bgImage,
									backgroundSize: '100% 24px',
									opacity: 0.6,
									pointerEvents: 'none',
								}}
							>
								<Box
									className='noteTitle'
									textAlign='center'
									fontWeight={600}
									fontSize='1.2rem'
									fontFamily='Inter'
									mb='0.5rem'
									pos={'relative'}
									bottom={'-6px'}
								>
									{note.title as string}
								</Box>

								<Box
									className='noteContent'
									fontSize='1rem'
									fontFamily="'Courier New', monospace"
									lineHeight='1.5'
									whiteSpace='pre-line'
								>
									{note?.content as string}
								</Box>

								{note?.tag && (
									<Box
										className='noteTag'
										textAlign='right'
										fontWeight={300}
										fontSize='12px'
										mt='0.5rem'
										fontStyle='italic'
										color={tagColor}
									>
										{note.tag as string}
									</Box>
								)}

								<Box
									className='noteCreatedAt'
									textAlign='right'
									mt='4px'
									fontSize='14px'
									color={createdAtColor}
								>
									{new Date(note.created_at as string).toLocaleDateString()}
								</Box>
							</Box>
						))}
					</Box>
				</>
			)}

			<Box
				className='pagination'
				display='flex'
				justifyContent='center'
				mt='1rem'
				alignItems={'center'}
				pos={'fixed'}
				bottom={'1rem'}
				left={'52rem'}
			>
				<Button
					onClick={() => setPage(page - 1)}
					isDisabled={page === 1}
					mr='1rem'
				>
					Prev
				</Button>
				<Box fontSize='16px' fontWeight='bold'>
					{page} / {totalPages === 0 ? totalPages + 1 : totalPages}
				</Box>
				<Button
					onClick={() => setPage(page + 1)}
					isDisabled={page >= totalPages}
					ml='1rem'
				>
					Next
				</Button>
			</Box>
		</Box>
	);
}

export default List;
