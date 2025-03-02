import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	useColorModeValue,
	useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { changePassword } from '../api/changePassword';

function ChangePassword() {
	const { id } = useParams();
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const toast = useToast();

	const handleChangePassword = async (e: React.FormEvent<HTMLDivElement>) => {
		e.preventDefault();
		if (id) {
			if (newPassword !== confirmPassword) {
				toast({
					title: 'Passwords do not match',
					status: 'error',
					isClosable: true,
					duration: 2000,
					position: 'top-right',
				});
				return;
			}
			const response = await changePassword({ password: newPassword, id });
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
					title: 'Password changed',
					status: 'success',
					isClosable: true,
					duration: 2000,
					position: 'top-right',
				});
				setNewPassword('');
				setConfirmPassword('');
				return;
			}
		}
	};

	return (
		<Flex
			minH={'100vh'}
			align={'center'}
			justify={'center'}
			bg={useColorModeValue('gray.50', 'gray.800')}
		>
			<Stack spacing={4} mx={'auto'} maxW={'lg'} py={12} px={6}>
				<Stack align={'center'}>
					<Heading fontSize={'4xl'}>Change Password</Heading>
				</Stack>
				<Box
					as={'form'}
					rounded={'lg'}
					bg={useColorModeValue('white', 'gray.700')}
					boxShadow={'lg'}
					p={8}
					onSubmit={handleChangePassword}
				>
					<Stack spacing={4}>
						<FormControl id='email' isRequired>
							<FormLabel>New Password</FormLabel>
							<Input
								type='password'
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
							/>
						</FormControl>
						<FormControl id='password' isRequired>
							<FormLabel>Confirm New Password</FormLabel>
							<Input
								type='password'
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						</FormControl>
						<Stack spacing={6}>
							<Button
								bg={'blue.400'}
								color={'white'}
								_hover={{
									bg: 'blue.500',
								}}
								type={'submit'}
								isDisabled={!newPassword || !confirmPassword}
							>
								Change Password
							</Button>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}

export default ChangePassword;
