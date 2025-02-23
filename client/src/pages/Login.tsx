import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	Stack,
	Button,
	Heading,
	useColorModeValue,
	useToast,
	useDisclosure,
	Modal,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { login } from '../api/login';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import ForgotPassword from '../components/auth/ForgotPassword';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const toast = useToast();
	const navigate = useNavigate();
	const forgetPasswordDisclosure = useDisclosure();

	const user = useSelector((state: RootState) => state.user.data);

	const handleLogin = async (e: React.FormEvent<HTMLDivElement>) => {
		e.preventDefault();
		const loginPayload = {
			email,
			password,
		};
		try {
			const request = await login(loginPayload);
			if (request?.status === 0) {
				toast({
					title: (request as Record<string, string | number>)?.message,
					status: 'error',
					isClosable: true,
					duration: 2000,
					position: 'top-right',
				});
			}
			if (request?.status === 1) {
				localStorage.setItem('auth', request?.token);
				navigate('/');
			}
		} catch (error) {
			toast({
				title: (error as Record<string, string | number>)?.message,
				status: 'error',
				isClosable: true,
				duration: 2000,
				position: 'top-right',
			});
		}
	};

	useEffect(() => {
		if (user) {
			navigate('/');
		}
	}, [user]);

	return (
		<Flex
			minH={'100vh'}
			align={'center'}
			justify={'center'}
			bg={useColorModeValue('gray.50', 'gray.800')}
		>
			<Stack spacing={4} mx={'auto'} maxW={'lg'} py={12} px={6}>
				<Stack align={'center'}>
					<Heading fontSize={'4xl'}>Sign in to your account</Heading>
				</Stack>
				<Box
					as={'form'}
					rounded={'lg'}
					bg={useColorModeValue('white', 'gray.700')}
					boxShadow={'lg'}
					p={8}
					onSubmit={handleLogin}
				>
					<Stack spacing={4}>
						<FormControl id='email' isRequired>
							<FormLabel>Email address</FormLabel>
							<Input
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</FormControl>
						<FormControl id='password' isRequired>
							<FormLabel>Password</FormLabel>
							<Input
								type='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</FormControl>
						<Stack spacing={6}>
							<Stack
								direction={{ base: 'column', sm: 'row' }}
								align={'start'}
								justify={'space-between'}
							>
								<Button
									color={'blue.400'}
									variant={'link'}
									onClick={forgetPasswordDisclosure.onOpen}
								>
									Forgot password?
								</Button>
							</Stack>
							<Button
								bg={'blue.400'}
								color={'white'}
								_hover={{
									bg: 'blue.500',
								}}
								type={'submit'}
							>
								Sign in
							</Button>
						</Stack>
					</Stack>
				</Box>
				<Modal
					isCentered
					closeOnOverlayClick={false}
					isOpen={forgetPasswordDisclosure.isOpen}
					onClose={forgetPasswordDisclosure.onClose}
				>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Change your password</ModalHeader>
						<ModalCloseButton />

						<ForgotPassword onClose={forgetPasswordDisclosure.onClose} />
					</ModalContent>
				</Modal>
			</Stack>
		</Flex>
	);
}
