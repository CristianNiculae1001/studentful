import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Stack,
	useColorModeValue,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { toCapitalize } from '../utils/toCapitalize';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import Avatar from 'boring-avatars';
import { CgArrowsExchange } from 'react-icons/cg';
import { MdDelete } from 'react-icons/md';
import { forgotPassword } from '../api/forgotPassword';
import { deleteAccount } from '../api/deleteAccount';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserData } from '../features/user';
import { updateAccountInfo } from '../api/updateAccountInfo';

function Settings() {
	const [changePasswordLoading, setChangePasswordLoading] = useState(false);
	const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
	const user = useSelector((state: RootState) => state.user.data);
	const [firstName, setFirstName] = useState(user?.first_name! ?? '');
	const [lastName, setLastName] = useState(user?.last_name! ?? '');
	const toast = useToast();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const noteBorder = useColorModeValue('#ccc', '#393E46');
	const textColor = useColorModeValue('#1d2025', '#EDEDED');

	const handleChangePassword = async () => {
		setChangePasswordLoading(true);
		if (user) {
			const response = await forgotPassword({ email: user?.email });
			if (response?.status) {
				toast({
					title: 'Email sent',
					status: 'success',
					description: response?.message,
					isClosable: true,
					duration: 2000,
					position: 'top-right',
				});
				setChangePasswordLoading(false);
				return;
			}
			toast({
				title: 'Error',
				status: 'error',
				description: response?.message,
				isClosable: true,
				duration: 2000,
				position: 'top-right',
			});
			setChangePasswordLoading(false);
		}
	};

	const handleDeleteAccount = async () => {
		setDeleteAccountLoading(true);
		if (user) {
			const response = await deleteAccount();
			if (response?.status) {
				toast({
					title: 'Account sters cu succes',
					status: 'success',
					description: response?.message,
					isClosable: true,
					duration: 2000,
					position: 'top-right',
				});
				setDeleteAccountLoading(false);
				dispatch(updateUserData(null));
				localStorage.removeItem('auth');
				navigate('/register');
				return;
			}
			toast({
				title: 'Error',
				status: 'error',
				description: response?.message,
				isClosable: true,
				duration: 2000,
				position: 'top-right',
			});
		}
		setDeleteAccountLoading(false);
	};

	const handleUpdateAccountInfo = async () => {
		if (user) {
			const response = await updateAccountInfo({
				firstName,
				lastName,
			});
			if (response?.status === 0) {
				toast({
					title: response?.message,
					status: 'error',
					isClosable: true,
					duration: 2000,
					position: 'top-right',
				});
				return;
			}
			if (response?.status === 1) {
				toast({
					title: 'Informatii actualizate cu succes',
					status: 'success',
					isClosable: true,
					duration: 2000,
					position: 'top-right',
				});
				const updatedUserData = {
					...user,
					first_name: firstName,
					last_name: lastName,
				};
				dispatch(updateUserData(updatedUserData));
			}
		}
	};

	return (
		<Flex minH={'80vh'} align={'center'} justify={'center'} p={'1rem'}>
			<Stack
				spacing={8}
				mx={'auto'}
				w={'100%'}
				maxW={'50vw'}
				py={12}
				px={6}
				alignItems={'center'}
				color={textColor}
				border={`1px solid ${noteBorder}`}
				borderRadius='8px'
				bg={useColorModeValue('gray.100', 'gray.900')}
			>
				<Box m={'0 auto'}>
					<Avatar
						size={56}
						name={`${toCapitalize(user?.first_name!)} ${toCapitalize(
							user?.last_name!
						)}`}
						variant='beam'
					/>
				</Box>

				<Box as={'hr'} w={'100%'}></Box>

				<VStack className='userInfoUpdateContainer' spacing={4}>
					<FormControl id='first_name'>
						<FormLabel>Prenume</FormLabel>
						<Input
							type='text'
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
						/>
					</FormControl>
					<FormControl id='last_name'>
						<FormLabel>Nume</FormLabel>
						<Input
							type='text'
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
						/>
					</FormControl>
					<FormControl textAlign={'center'}>
						<Button
							colorScheme='blue'
							isDisabled={firstName.length === 0 || lastName.length === 0}
							onClick={handleUpdateAccountInfo}
						>
							Actualizeaza
						</Button>
					</FormControl>
				</VStack>

				<Box as={'hr'} w={'100%'}></Box>

				<Box>
					<Box>
						<Button
							isLoading={changePasswordLoading}
							w={'100%'}
							colorScheme='teal'
							variant='solid'
							leftIcon={<CgArrowsExchange />}
							onClick={handleChangePassword}
						>
							Change Password
						</Button>
					</Box>

					<Box mt={'1.5rem'}>
						<Button
							isLoading={deleteAccountLoading}
							w={'100%'}
							colorScheme='red'
							variant='solid'
							leftIcon={<MdDelete />}
							onClick={handleDeleteAccount}
						>
							Delete Account
						</Button>
					</Box>
				</Box>
			</Stack>
		</Flex>
	);
}

export default Settings;
