import {
	Flex,
	useColorModeValue,
	Stack,
	Heading,
	Box,
	FormControl,
	FormLabel,
	Input,
	Button,
	useDisclosure,
	useToast,
	HStack,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	PinInput,
	PinInputField,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/register';
import { verifyCode } from '../api/verifyCode';

function Register() {
	const { isOpen, onClose, onOpen } = useDisclosure();
	const [email, setEmail] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [password, setPassword] = useState('');
	const [code, setCode] = useState('');
	const navigate = useNavigate();
	const toast = useToast();

	const handleRegister = async (e: React.FormEvent<HTMLDivElement>) => {
		e.preventDefault();
		const registerPayload = {
			email,
			password,
			firstName,
			lastName,
		};
		const response = await register(registerPayload);
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
		onOpen();
	};

	const handleSendCode = async () => {
		const response = await verifyCode(email, code);
		if (response?.status === 0) {
			toast({
				title:
					typeof response?.message === 'object' ? 'Error' : response?.message,
				status: 'error',
				isClosable: true,
				duration: 2000,
				position: 'top-right',
			});
			return;
		}
		toast({
			title: 'Cont creat cu succes',
			status: 'success',
			isClosable: true,
			duration: 2000,
			position: 'top-right',
		});
		onClose();
		navigate('/login');
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
					<Heading fontSize={'4xl'}>Sign up</Heading>
				</Stack>
				<Box
					as={'form'}
					rounded={'lg'}
					bg={useColorModeValue('white', 'gray.700')}
					boxShadow={'lg'}
					p={8}
					onSubmit={handleRegister}
				>
					<Stack spacing={4}>
						<HStack spacing={4}>
							<FormControl id='first_name' isRequired>
								<FormLabel>Prenume</FormLabel>
								<Input
									type='text'
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
								/>
							</FormControl>
							<FormControl id='last_name' isRequired>
								<FormLabel>Nume</FormLabel>
								<Input
									type='text'
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
								/>
							</FormControl>
						</HStack>
						<FormControl id='email' isRequired>
							<FormLabel>Adresa de mail</FormLabel>
							<Input
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</FormControl>
						<FormControl id='password' isRequired>
							<FormLabel>Parola</FormLabel>
							<Input
								type='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
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
							>
								Sign up
							</Button>
						</Stack>
						<Box textAlign={'center'}>
							<Button
								color={'blue.400'}
								variant={'link'}
								onClick={() => navigate('/login')}
							>
								Deja ai un cont? Sign in
							</Button>
						</Box>
					</Stack>
				</Box>
			</Stack>

			<Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Verifica codul primit</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Box>
							<HStack justifyContent={'center'} alignItems={'center'}>
								<PinInput otp onChange={(e) => setCode(e)}>
									<PinInputField />
									<PinInputField />
									<PinInputField />
									<PinInputField />
								</PinInput>
							</HStack>
						</Box>
					</ModalBody>

					<ModalFooter>
						<Button variant='ghost' mr={3} onClick={onClose}>
							Close
						</Button>
						<Button
							variant='solid'
							colorScheme='blue'
							isDisabled={code.length !== 4}
							onClick={handleSendCode}
						>
							Trimite
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Flex>
	);
}

export default Register;
