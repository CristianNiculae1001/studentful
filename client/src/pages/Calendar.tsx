import { useState, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import {
	Box,
	Button,
	Input,
	FormControl,
	FormLabel,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	useToast,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
} from '@chakra-ui/react';
import { CALENDAR_URL } from '../utils/urls';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateUserData } from '../features/user';
import { FiSave, FiTrash } from 'react-icons/fi';

const CalendarComponent: React.FC = () => {
	const toast = useToast();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [events, setEvents] = useState<EventInput[]>([]);
	const { isOpen, onClose, onOpen } = useDisclosure();
	const eventDrawerDisclosure = useDisclosure();
	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [info, setInfo] = useState<Record<string, any>>({});
	const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null);

	const getEvents = async () => {
		try {
			const response = await fetch(CALENDAR_URL, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('auth')}`,
				},
			});
			const data = await response.json();
			if (data?.status === 0 && data?.message === 'Unauthorized') {
				dispatch(updateUserData(null));
				localStorage.removeItem('auth');
				navigate('/login');
				return;
			}
			setEvents(data?.data);
		} catch (error) {
			toast({
				title: 'Error',
				status: 'error',
				description: 'Eroare la aducerea evenimentelor',
				isClosable: true,
			});
		}
	};

	useEffect(() => {
		getEvents();
	}, []);

	const handleSelect = useCallback((info: any) => {
		setInfo(info);
		onOpen();
	}, []);

	const handleAddEvent = async () => {
		try {
			const newEvent: EventInput = {
				title,
				start: info?.start,
				end: info?.end,
				allDay: info?.allDay,
				description,
			};

			const response = await fetch(CALENDAR_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('auth')}`,
				},
				body: JSON.stringify(newEvent),
			});
			const data = await response.json();
			if (data?.status === 0 && data?.message === 'Unauthorized') {
				dispatch(updateUserData(null));
				localStorage.removeItem('auth');
				navigate('/login');
				return;
			}
			toast({
				title: 'Success',
				status: 'success',
				description: 'Eveniment adaugat cu succes',
				isClosable: true,
			});
			setTitle('');
			setDescription('');
			getEvents();
			onClose();
		} catch (error) {
			toast({
				title: 'Error',
				status: 'error',
				description: 'Eroare la adaugarea evenimentului',
				isClosable: true,
			});
		}
	};

	const handleDeleteEvent = async (eventId: number) => {
		try {
			const response = await fetch(`${CALENDAR_URL}/${eventId}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('auth')}`,
				},
			});
			const data = await response.json();
			if (data?.status === 0 && data?.message === 'Unauthorized') {
				dispatch(updateUserData(null));
				localStorage.removeItem('auth');
				navigate('/login');
				return;
			}
			toast({
				title: 'Success',
				status: 'success',
				description: 'Eveniment sters cu succes',
				isClosable: true,
			});
			getEvents();
			eventDrawerDisclosure.onClose();
		} catch (error) {
			toast({
				title: 'Error',
				status: 'error',
				description: 'Eroare la stergerea evenimentului',
				isClosable: true,
			});
		}
	};

	const handleEditEvent = async () => {
		try {
			const updatedEvent: EventInput = {
				title,
				description,
			};

			const response = await fetch(
				`${CALENDAR_URL}/${selectedEvent?.publicId}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('auth')}`,
					},
					body: JSON.stringify(updatedEvent),
				}
			);
			const data = await response.json();
			if (data?.status === 0 && data?.message === 'Unauthorized') {
				dispatch(updateUserData(null));
				localStorage.removeItem('auth');
				navigate('/login');
				return;
			}
			toast({
				title: 'Success',
				status: 'success',
				description: 'Eveniment actualizat cu succes',
				isClosable: true,
			});
			setTitle('');
			setDescription('');
			getEvents();
			eventDrawerDisclosure.onClose();
		} catch (error) {
			toast({
				title: 'Error',
				status: 'error',
				description: 'Eroare la actualizarea evenimentului',
				isClosable: true,
			});
		}
	};

	return (
		<Box p={'1rem'} style={{ height: '92vh', width: '100%' }}>
			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				initialView='timeGridWeek'
				selectable={true}
				editable={true}
				events={events}
				select={handleSelect}
				eventClick={(eventClickInfo) => {
					setSelectedEvent(eventClickInfo.event._def);
					setTitle(eventClickInfo?.event?._def?.title);
					setDescription(
						eventClickInfo?.event?._def?.extendedProps?.description
					);
					eventDrawerDisclosure.onOpen();
				}}
				height='100%'
			/>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Adaugă Eveniment</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<FormControl isRequired>
							<FormLabel>Titlu</FormLabel>
							<Input value={title} onChange={(e) => setTitle(e.target.value)} />
						</FormControl>

						<FormControl mt={'1rem'}>
							<FormLabel>Descriere</FormLabel>
							<Input
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</FormControl>
					</ModalBody>

					<ModalFooter>
						<Button variant={'ghost'} mr={3} onClick={onClose}>
							Închide
						</Button>
						<Button
							variant='solid'
							colorScheme='blue'
							isDisabled={title.length === 0}
							onClick={handleAddEvent}
						>
							Adaugă
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<Drawer
				isOpen={eventDrawerDisclosure.isOpen}
				placement='right'
				onClose={eventDrawerDisclosure.onClose}
			>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader>Editare Eveniment</DrawerHeader>
					<DrawerBody>
						<FormControl isRequired>
							<FormLabel>Titlu</FormLabel>
							<Input value={title} onChange={(e) => setTitle(e.target.value)} />
						</FormControl>

						<FormControl mt={'1rem'}>
							<FormLabel>Descriere</FormLabel>
							<Input
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</FormControl>
					</DrawerBody>
					<DrawerFooter display={'flex'} gap={'8px'} alignItems={'center'}>
						<Button
							flex={1}
							leftIcon={<FiSave />}
							colorScheme='green'
							onClick={handleEditEvent}
						>
							Salveaza
						</Button>
						<Button
							flex={1}
							leftIcon={<FiTrash />}
							colorScheme='red'
							onClick={() => handleDeleteEvent(selectedEvent?.publicId)}
						>
							Sterge
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</Box>
	);
};

export default CalendarComponent;
