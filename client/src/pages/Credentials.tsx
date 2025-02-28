import {
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	FormControl,
	FormLabel,
	IconButton,
	Input,
	InputGroup,
	InputLeftAddon,
	InputLeftElement,
	InputRightElement,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useColorMode,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { FiSearch, FiPlus, FiSave, FiTrash } from 'react-icons/fi';
import { addCredentials } from '../api/addCredentials';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { MdEditNote } from 'react-icons/md';
import { formatDate } from '../utils/formatDate';
import { getCredentials } from '../api/getCredentials';
import { updateUserData } from '../features/user';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateCredentials } from '../api/updateCredentials';
import { deleteCredentials } from '../api/deleteCredentials';
import { getDecryptedPassword } from '../api/getDecryptedPassword';

function Credentials() {
	const initialRowData = useRef<Record<string, unknown>[]>([]);
	const [searchInput, setSearchInput] = useState('');
	const { isOpen, onClose, onOpen } = useDisclosure();
	const updateDrawerDisclosure = useDisclosure();

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const toast = useToast();
	const gridRef = useRef<AgGridReact>(null);
	const { colorMode } = useColorMode();

	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);

	const [data, setData] = useState<Record<string, any>[]>([]);
	const [service, setService] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [selectedRow, setSelectedRow] = useState<Record<string, any> | null>(
		null
	);

	const [updatedCredentials, setUpdatedCredentials] = useState<Record<
		string,
		any
	> | null>(null);

	const getCredentialsHandler = async () => {
		const response = await getCredentials();
		if (response?.status === 0) {
			localStorage.removeItem('auth');
			dispatch(updateUserData(null));
			navigate('/login');
			return;
		}
		initialRowData.current = response?.data;
		setData(response?.data);
	};

	const filterData = (): void => {
		let filtered = [...initialRowData.current]?.filter(
			(el: Record<string, any>) =>
				el?.service?.toLowerCase().includes(searchInput.toLowerCase()) ||
				el?.username?.toLowerCase().includes(searchInput.toLowerCase()) ||
				el?.password?.toLowerCase().includes(searchInput.toLowerCase()) ||
				el?.created_at?.toLowerCase().includes(searchInput.toLowerCase()) ||
				el?.updated_at?.toLowerCase().includes(searchInput.toLowerCase())
		);

		setData(filtered);
	};

	useEffect(() => {
		filterData();
	}, [searchInput]);

	const addNewCredentials = async () => {
		try {
			const data = await addCredentials(service, username, password);
			if (data.status === 1) {
				toast({
					title: 'Credentiale adaugate cu succes',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
				onClose();
				setService('');
				setUsername('');
				setPassword('');
			} else {
				toast({
					title: 'Eroare',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				title: 'Eroare',
				description: 'Ceva nu a mers bine',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const columns: ColDef<any>[] = [
		{
			headerName: 'Serviciu',
			field: 'service',
			flex: 1,
			tooltipField: 'service',
		},
		{
			headerName: 'Username',
			field: 'username',
			flex: 1,
			tooltipField: 'username',
		},
		{
			headerName: 'Parola',
			field: 'password',
			flex: 1,
			cellRenderer: (params: any) => {
				return <Box>{JSON.parse(params?.data?.password)?.password}</Box>;
			},
			tooltipValueGetter: (params: any) => {
				return JSON.parse(params?.data?.password)?.password;
			},
		},
		{
			headerName: 'Created At',
			field: 'created_at',
			flex: 1,
			cellRenderer: (params: any) => {
				return <Box>{formatDate(params?.data?.created_at)}</Box>;
			},
			tooltipValueGetter: (params: any) => {
				return formatDate(params?.data?.created_at);
			},
		},
		{
			headerName: 'Updated At',
			field: 'updated_at',
			flex: 1,
			cellRenderer: (params: any) => {
				return <Box>{formatDate(params?.data?.updated_at)}</Box>;
			},
			tooltipValueGetter: (params: any) => {
				return formatDate(params?.data?.updated_at);
			},
		},
		{
			headerName: '',
			maxWidth: 64,
			pinned: 'right',
			sortable: false,
			suppressMovable: true,
			resizable: false,
			cellRenderer: (params: any) => {
				return (
					<IconButton
						icon={<MdEditNote fontSize={'22px'} />}
						pos={'relative'}
						top={'6px'}
						aria-label='Edit'
						variant={'link'}
						onClick={async () => {
							const decryptedPassword = await getDecryptedPassword(
								params?.data?.id
							);
							setSelectedRow({
								...params?.data,
								password: decryptedPassword?.data ?? '',
							});
							updateDrawerDisclosure.onOpen();
							setUpdatedCredentials({
								...params?.data,
								password: decryptedPassword?.data ?? '',
							});
						}}
					/>
				);
			},
		},
	];

	useEffect(() => {
		getCredentialsHandler();
	}, []);

	const editCredentialsHandler = async () => {
		const response = await updateCredentials(
			selectedRow?.id,
			updatedCredentials
		);
		if (response?.status === 1) {
			toast({
				title: 'Credentiale actualizate cu succes',
				status: 'success',
				duration: 3000,
				isClosable: true,
			});
			updateDrawerDisclosure.onClose();
			setUpdatedCredentials(null);
			setSelectedRow(null);
			getCredentialsHandler();
		} else {
			toast({
				title: 'Eroare',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const deleteCredentialsHandler = async () => {
		const response = await deleteCredentials(selectedRow?.id);
		if (response?.status === 1) {
			toast({
				title: 'Credentiale sterse cu succes',
				status: 'success',
				duration: 3000,
				isClosable: true,
			});
			updateDrawerDisclosure.onClose();
			getCredentialsHandler();
		} else {
			toast({
				title: 'Eroare',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	return (
		<Box className='credentialsContainer' p={'1rem'}>
			<Box
				display='flex'
				justifyContent='space-between'
				alignItems='center'
				mb='1rem'
			>
				<Box display={'flex'} alignItems={'center'} gap={'1.25rem'}>
					<InputGroup>
						<InputLeftElement>
							<FiSearch />
						</InputLeftElement>
						<Input
							maxW={240}
							type={'search'}
							variant={'flushed'}
							placeholder='Caută...'
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
						/>
					</InputGroup>
				</Box>
				<Button leftIcon={<FiPlus />} colorScheme='blue' onClick={onOpen}>
					Adauga credentiale
				</Button>
			</Box>

			<Box
				className={
					colorMode === 'light' ? 'ag-theme-quartz' : 'ag-theme-quartz-dark'
				}
				h={'calc(100vh - 160px)'}
				mt={'1rem'}
			>
				<AgGridReact
					ref={gridRef}
					rowData={data}
					columnDefs={columns}
					pagination={true}
					paginationAutoPageSize={true}
					enableCellTextSelection={true}
					tooltipTrigger='hover'
					tooltipHideDelay={1000}
					tooltipShowDelay={0}
				/>
			</Box>

			<Drawer
				isOpen={updateDrawerDisclosure.isOpen}
				placement='right'
				onClose={() => {
					updateDrawerDisclosure.onClose();
					setShow(false);
				}}
			>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader>Editare Credentiale</DrawerHeader>
					<DrawerBody>
						<FormControl isRequired mb={'1rem'}>
							<FormLabel>Serviciu</FormLabel>
							<InputGroup>
								<InputLeftAddon>https://</InputLeftAddon>
								<Input
									placeholder='URL'
									value={updatedCredentials?.service}
									onChange={(e) =>
										setUpdatedCredentials({
											...updatedCredentials,
											service: e.target.value,
										})
									}
								/>
							</InputGroup>
						</FormControl>

						<FormControl mb={'1rem'} isRequired>
							<FormLabel>Username</FormLabel>
							<Input
								value={updatedCredentials?.username}
								onChange={(e) =>
									setUpdatedCredentials({
										...updatedCredentials,
										username: e.target.value,
									})
								}
							/>
						</FormControl>

						<FormControl mb={'1rem'} isRequired>
							<FormLabel>Parola</FormLabel>
							<InputGroup>
								<Input
									type={show ? 'text' : 'password'}
									placeholder='Introdoceti parola'
									value={updatedCredentials?.password}
									onChange={(e) =>
										setUpdatedCredentials({
											...updatedCredentials,
											password: e.target.value,
										})
									}
								/>
								<InputRightElement pr={'6px'}>
									{show ? (
										<IconButton
											icon={<FaRegEye />}
											aria-label='Password Icon'
											onClick={handleClick}
											h={'1.75rem'}
											size={'sm'}
											variant={'ghost'}
										/>
									) : (
										<IconButton
											icon={<FaRegEyeSlash />}
											aria-label='Password Icon'
											onClick={handleClick}
											h={'1.75rem'}
											size={'sm'}
											variant={'ghost'}
										/>
									)}
								</InputRightElement>
							</InputGroup>
						</FormControl>
					</DrawerBody>
					<DrawerFooter display={'flex'} gap={'8px'} alignItems={'center'}>
						<Button
							flex={1}
							leftIcon={<FiSave />}
							colorScheme='green'
							onClick={editCredentialsHandler}
						>
							Salveaza
						</Button>
						<Button
							flex={1}
							leftIcon={<FiTrash />}
							colorScheme='red'
							onClick={deleteCredentialsHandler}
						>
							Sterge
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Adauga credentiale</ModalHeader>
					<ModalBody>
						<FormControl isRequired mb={'1rem'}>
							<FormLabel>Serviciu</FormLabel>
							<InputGroup>
								<InputLeftAddon>https://</InputLeftAddon>
								<Input
									placeholder='URL'
									value={service}
									onChange={(e) => setService(e.target.value)}
								/>
							</InputGroup>
						</FormControl>

						<FormControl mb={'1rem'} isRequired>
							<FormLabel>Username</FormLabel>
							<Input
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</FormControl>

						<FormControl mb={'1rem'} isRequired>
							<FormLabel>Parola</FormLabel>
							<InputGroup>
								<Input
									type={show ? 'text' : 'password'}
									placeholder='Enter password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<InputRightElement pr={'6px'}>
									{show ? (
										<IconButton
											icon={<FaRegEye />}
											aria-label='Password Icon'
											onClick={handleClick}
											h={'1.75rem'}
											size={'sm'}
											variant={'ghost'}
										/>
									) : (
										<IconButton
											icon={<FaRegEyeSlash />}
											aria-label='Password Icon'
											onClick={handleClick}
											h={'1.75rem'}
											size={'sm'}
											variant={'ghost'}
										/>
									)}
								</InputRightElement>
							</InputGroup>
						</FormControl>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme='blue'
							onClick={addNewCredentials}
							isDisabled={!service || !username || !password}
						>
							Salveaza
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
}

export default Credentials;
