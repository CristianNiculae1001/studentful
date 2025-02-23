import {
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Button,
	IconButton,
	Input,
	useColorModeValue,
	useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addNoteItem } from '../api/addNoteItem';
import { getNoteItemsByNoteId } from '../api/getNoteItemsByNoteId';
import { deleteNoteItem } from '../api/deleteNoteItem';
import { TiDelete } from 'react-icons/ti';
import { deleteNote } from '../api/deleteNote';
import { updateNoteItem } from '../api/updateNoteItem';
import { formatDate } from '../utils/formatDate';

function Note() {
	const { id } = useParams();
	const navigate = useNavigate();
	const toast = useToast();
	const [note, setNote] = useState<string>('');
	const [noteItems, setNoteItems] = useState<Record<string, unknown>[]>([]);

	const noteItemBgColorValue = useColorModeValue('gray.100', 'gray.900');

	const handleAddNote = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && id) {
			const addedNoteItem = await addNoteItem(
				localStorage.getItem('auth') || '',
				{ id: parseInt(id), description: note }
			);
			if (addedNoteItem.status === 1) {
				toast({
					title: 'Item adaugat cu succes',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
				setNoteItems((prevNoteItems) => [
					...prevNoteItems,
					addedNoteItem.data[0],
				]);
			} else {
				toast({
					title: 'Eroare la adaugarea item-ului',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			}
			setNote('');
		}
	};

	const fetchNoteItems = async () => {
		if (id) {
			const noteItems = await getNoteItemsByNoteId(
				localStorage.getItem('auth') || '',
				parseInt(id)
			);
			setNoteItems(noteItems);
		}
	};

	const handleDeleteNoteItem = async (id: string) => {
		if (id) {
			const deletedNoteItem = await deleteNoteItem(
				localStorage.getItem('auth') || '',
				parseInt(id)
			);
			if (deletedNoteItem.status === 1) {
				toast({
					title: 'Item sters cu succes',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
				const newNoteItems = noteItems.filter(
					(noteItem) => noteItem.id !== parseInt(id)
				);
				setNoteItems(newNoteItems);
			} else {
				toast({
					title: 'Eroare la stergerea item-ului',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			}
		}
	};

	const handleDeleteNote = async (id: string) => {
		if (id) {
			const deletedNote = await deleteNote(id);
			if (deletedNote.status === 1) {
				toast({
					title: 'Notita stearsa cu succes',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
				navigate('/notes');
			} else {
				toast({
					title: 'Eroare la stergerea notitei',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			}
		}
	};

	useEffect(() => {
		fetchNoteItems();
	}, [id]);

	const handleNoteStatus = async (id: string, isCompleted: boolean) => {
		const updatedNoteItem = await updateNoteItem(
			localStorage.getItem('auth') || '',
			parseInt(id),
			isCompleted
		);
		if (updatedNoteItem.status === 1) {
			toast({
				title: 'Status actualizat cu succes',
				status: 'success',
				duration: 3000,
				isClosable: true,
			});
			fetchNoteItems();
		} else {
			toast({
				title: 'Eroare la actualizarea item-ului',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	return (
		<Box className='noteContainer' p={'1rem'}>
			<Box
				display={'flex'}
				justifyContent={'space-between'}
				alignItems={'center'}
				gap={'1rem'}
			>
				<Box>
					<Breadcrumb>
						<BreadcrumbItem>
							<BreadcrumbLink onClick={() => navigate('/notes')}>
								Notes
							</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbItem isCurrentPage>
							<BreadcrumbLink href='#'>Notita #{id}</BreadcrumbLink>
						</BreadcrumbItem>
					</Breadcrumb>
				</Box>
				<Box className='noteDeleteButton' textAlign={'right'}>
					<Button
						variant={'solid'}
						leftIcon={<TiDelete style={{ width: '20px', height: '20px' }} />}
						colorScheme='red'
						onClick={() => handleDeleteNote(id as string)}
					>
						Sterge notita
					</Button>
				</Box>
			</Box>
			<Box
				className='noteItemInputContainer'
				mb={'1rem'}
				display={'flex'}
				justifyContent={'center'}
				alignItems={'center'}
				mt={'18dvh'}
			>
				<Input
					type={'search'}
					onChange={(e) => setNote(e.target.value)}
					variant={'flushed'}
					value={note}
					placeholder='Ex: De facut tema la economie'
					maxW={'50%'}
					onKeyDown={handleAddNote}
				/>
			</Box>
			<Box
				className='noteItemsContainer'
				display={'flex'}
				flexDirection={'column'}
				justifyContent={'center'}
				alignItems={'center'}
			>
				{noteItems.map((noteItem, index) => (
					<Box
						key={index}
						className='noteItem'
						p={'1rem'}
						m={'1rem'}
						borderRadius={'md'}
						boxShadow={'md'}
						bg={noteItemBgColorValue}
						w={'40vw'}
						maxW={'100%'}
						display={'flex'}
						flexDirection={'row'}
						justifyContent={'space-between'}
						alignItems={'center'}
						gap={'1rem'}
					>
						{!noteItem?.iscompleted ? (
							<Box
								className='noteItemDescription'
								fontSize={'1.2rem'}
								fontWeight={'bold'}
								textAlign={'center'}
								color={useColorModeValue('gray.700', 'gray.500')}
								position='relative'
								display='inline-block'
								_hover={{
									cursor: 'pointer',
									_after: {
										transform: 'scaleX(1)',
									},
								}}
								_after={{
									content: '""',
									position: 'absolute',
									left: 0,
									top: '50%',
									width: '100%',
									height: '2px',
									backgroundColor: useColorModeValue('gray.700', 'gray.500'),
									transform: 'scaleX(0)',
									transformOrigin: 'left',
									transition: 'transform 0.3s ease-in-out',
								}}
								onClick={() => {
									handleNoteStatus(noteItem?.id as string, true);
								}}
							>
								{noteItem.description as string}
							</Box>
						) : (
							<Box
								className='noteItemDescription'
								fontSize={'1.2rem'}
								fontWeight={'bold'}
								textAlign={'center'}
								color={useColorModeValue('gray.500', 'gray.600')}
								position='relative'
								display='inline-block'
								textDecoration='line-through'
								_hover={{
									cursor: 'pointer',
									_after: {
										transform: 'scaleX(0)',
									},
									textDecoration: 'none',
								}}
								_after={{
									content: '""',
									position: 'absolute',
									left: 0,
									top: '50%',
									width: '100%',
									height: '2px',
									backgroundColor: useColorModeValue('gray.500', 'gray.600'),
									transform: 'scaleX(1)',
									transformOrigin: 'right',
									transition: 'transform 0.3s ease-in-out',
								}}
								onClick={() => {
									handleNoteStatus(noteItem?.id as string, false);
								}}
							>
								{noteItem.description as string}
							</Box>
						)}
						<Box>
							<Box
								display={'inline-block'}
								className='noteItemDate'
								fontSize={'1rem'}
								fontWeight={'bold'}
								textAlign={'center'}
								color={'gray.500'}
								pos={'relative'}
								bottom={'4px'}
							>
								{formatDate(noteItem?.created_at as string)}
							</Box>
							<Box
								display={'inline-block'}
								className='noteItemDeleteButton'
								fontSize={'1.2rem'}
								fontWeight={'bold'}
								textAlign={'center'}
								ml={'8px'}
							>
								<IconButton
									aria-label='Delete note item'
									icon={
										<TiDelete
											style={{
												width: '20px',
												height: '20px',
												marginTop: '4px',
											}}
										/>
									}
									mt={'4px'}
									colorScheme='red'
									isRound
									variant={'link'}
									onClick={() => handleDeleteNoteItem(noteItem?.id as string)}
								/>
							</Box>
						</Box>
					</Box>
				))}
			</Box>
		</Box>
	);
}

export default Note;
