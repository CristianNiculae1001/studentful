import {
	ModalBody,
	FormControl,
	FormLabel,
	Input,
	Button,
	ModalFooter,
	useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { forgotPassword } from '../../api/forgotPassword';

function ForgotPassword({ onClose }: { onClose: () => void }) {
	const toast = useToast();
	const [email, setEmail] = useState('');

	const handleChangePassword = async () => {
		const response = await forgotPassword({ email });
		if (response?.status) {
			setEmail('');
			toast({
				title: 'Email sent',
				status: 'success',
				description: response?.message,
				isClosable: true,
				duration: 2000,
				position: 'top-right',
			});
			onClose();
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
	};

	return (
		<>
			<ModalBody pb={6}>
				<FormControl isRequired>
					<FormLabel>Email</FormLabel>
					<Input
						type={'email'}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</FormControl>
			</ModalBody>
			<ModalFooter>
				<Button colorScheme='blue' mr={3} onClick={handleChangePassword}>
					Send
				</Button>
			</ModalFooter>
		</>
	);
}

export default ForgotPassword;
