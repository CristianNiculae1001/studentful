import {
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	FormControl,
	FormLabel,
	HStack,
	IconButton,
	Input,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { IoRemoveOutline } from 'react-icons/io5';
import { v7 as uuidv7 } from 'uuid';
import { addCatalog } from '../../api/addCatalogData';
import Table from './assets/Table';

type Semester = {
	id: string;
	name: string;
	note: number[];
	credite: number | null;
};

function Catalog() {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const toast = useToast();

	const [anLabel, setAnLabel] = useState('');
	const [sem1Data, setSem1Data] = useState<{ sem1: Semester[] }>({
		sem1: [],
	});
	const [sem2Data, setSem2Data] = useState<{ sem2: Semester[] }>({
		sem2: [],
	});
	// const materii = ['Economie', 'Algebra liniara', 'Analiza Matematica', 'SDD', 'Econometrie', 'Microeconomie', 'Multimedia', 'POO'];

	const [isSuccessful, setIsSuccessful] = useState(false);

	const handleAddCatalogData = async () => {
		const catalogData = {
			[anLabel]: { ...sem1Data, ...sem2Data },
		};
		const catalog = await addCatalog(
			localStorage.getItem('auth') ?? '',
			catalogData
		);
		if (catalog?.status === 0) {
			toast({
				title: 'Error',
				status: 'error',
				description: catalog?.message,
				isClosable: true,
				duration: 2000,
				position: 'top-right',
			});
			setIsSuccessful(false);
			return;
		}
		setAnLabel('');
		setSem1Data({ sem1: [] });
		setSem2Data({ sem2: [] });
		toast({
			title: 'Datele au fost adaugate cu succes!',
			status: 'success',
			isClosable: true,
			duration: 2000,
			position: 'top-right',
		});
		setIsSuccessful(true);
		onClose();
	};

	return (
		<Box className='catalogContainer'>
			<Box className='menuContainer' textAlign={'end'}>
				<IconButton
					icon={<FiPlus />}
					aria-label='Add Entry'
					fontSize={16}
					isRound
					colorScheme={'blue'}
					onClick={onOpen}
				/>
			</Box>

			<Table isSuccessful={isSuccessful} setIsSuccessful={setIsSuccessful} />

			<Drawer isOpen={isOpen} placement='right' onClose={onClose} size={'md'}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader>Adauga date in catalog</DrawerHeader>

					<DrawerBody>
						<FormControl isRequired mb={'1rem'}>
							<FormLabel>An</FormLabel>
							<Input
								type={'text'}
								placeholder='Anul 1'
								onChange={(e) => setAnLabel(e.target.value)}
								value={anLabel}
							/>
						</FormControl>
						<Box className='semesterContainer' mt={'2rem'}>
							<Box
								display={'flex'}
								justifyContent={'space-between'}
								gap={'1rem'}
							>
								<Box>Semestrul 1</Box>
								<Box>
									<IconButton
										icon={<FiPlus />}
										aria-label='Add Course'
										fontSize={16}
										isRound
										colorScheme={'green'}
										onClick={() => {
											setSem1Data((prev) => {
												const newData = {
													sem1: [
														...prev.sem1,
														{
															id: uuidv7(),
															name: '',
															note: [],
															credite: null,
														},
													],
												};
												return newData;
											});
										}}
									/>
								</Box>
							</Box>

							<Box>
								{sem1Data.sem1.map((element, index) => (
									<HStack key={index} gap={'1rem'} mb={'1rem'}>
										<FormControl isRequired>
											<FormLabel>Materie</FormLabel>
											<Input
												type={'text'}
												onChange={(e) => {
													setSem1Data((prev) => {
														const updatedElement = prev.sem1.map((el) => {
															if (el.id === element.id) {
																return {
																	...el,
																	name: e.target.value,
																};
															} else {
																return el;
															}
														});
														return {
															sem1: updatedElement,
														};
													});
												}}
												value={element.name}
												//  placeholder={materii[Math.floor(Math.random() * materii.length)]}
												placeholder='Economie'
											/>
										</FormControl>

										<FormControl isRequired>
											<FormLabel>Note</FormLabel>
											<Input
												type={'text'}
												onChange={(e) => {
													setSem1Data((prev) => {
														const updatedElement = prev.sem1.map((el) => {
															if (el.id === element.id) {
																return {
																	...el,
																	note: e.target.value
																		.split(',')
																		.map((e) => +e),
																};
															} else {
																return el;
															}
														});
														return {
															sem1: updatedElement,
														};
													});
												}}
												value={element.note.join(',')}
												placeholder='6,7,8,10'
											/>
										</FormControl>

										<FormControl>
											<FormLabel>Nr. Credite</FormLabel>
											<Input
												type={'number'}
												min={1}
												onChange={(e) => {
													setSem1Data((prev) => {
														const updatedElement = prev.sem1.map((el) => {
															if (el.id === element.id) {
																return {
																	...el,
																	credite:
																		e.target.value.length === 0
																			? null
																			: +e.target.value,
																};
															} else {
																return el;
															}
														});
														return {
															sem1: updatedElement,
														};
													});
												}}
												value={element.credite ?? 0}
												placeholder='4'
											/>
										</FormControl>

										<Box mt={'1.5rem'}>
											<IconButton
												icon={<IoRemoveOutline />}
												aria-label='Delete Entry'
												isRound
												colorScheme='red'
												color={'#fff'}
												fontSize={18}
												onClick={() => {
													setSem1Data((prev) => {
														const updatedData = prev.sem1.filter(
															(e) => e.id !== element.id
														);
														return { sem1: updatedData };
													});
												}}
											/>
										</Box>
									</HStack>
								))}
							</Box>
						</Box>

						<Box className='semesterContainer' mt={'2rem'}>
							<Box
								display={'flex'}
								justifyContent={'space-between'}
								gap={'1rem'}
							>
								<Box>Semestrul 2</Box>
								<Box>
									<IconButton
										icon={<FiPlus />}
										aria-label='Add Course'
										fontSize={16}
										isRound
										colorScheme={'green'}
										onClick={() => {
											setSem2Data((prev) => {
												const newData = {
													sem2: [
														...prev.sem2,
														{
															id: uuidv7(),
															name: '',
															note: [],
															credite: null,
														},
													],
												};
												return newData;
											});
										}}
									/>
								</Box>
							</Box>

							<Box>
								{sem2Data.sem2.map((element, index) => (
									<HStack key={index} gap={'1rem'} mb={'1rem'}>
										<FormControl isRequired>
											<FormLabel>Materie</FormLabel>
											<Input
												type={'text'}
												onChange={(e) => {
													setSem2Data((prev) => {
														const updatedElement = prev.sem2.map((el) => {
															if (el.id === element.id) {
																return {
																	...el,
																	name: e.target.value,
																};
															} else {
																return el;
															}
														});
														return {
															sem2: updatedElement,
														};
													});
												}}
												value={element.name}
												//  placeholder={materii[Math.floor(Math.random() * materii.length)]}
												placeholder='Economie'
											/>
										</FormControl>

										<FormControl isRequired>
											<FormLabel>Note</FormLabel>
											<Input
												type={'text'}
												onChange={(e) => {
													setSem2Data((prev) => {
														const updatedElement = prev.sem2.map((el) => {
															if (el.id === element.id) {
																return {
																	...el,
																	note: e.target.value
																		.split(',')
																		.map((e) => +e),
																};
															} else {
																return el;
															}
														});
														return {
															sem2: updatedElement,
														};
													});
												}}
												value={element.note.join(',')}
												placeholder='6,7,8,10'
											/>
										</FormControl>

										<FormControl>
											<FormLabel>Nr. Credite</FormLabel>
											<Input
												type={'number'}
												min={1}
												onChange={(e) => {
													setSem2Data((prev) => {
														const updatedElement = prev.sem2.map((el) => {
															if (el.id === element.id) {
																return {
																	...el,
																	credite:
																		e.target.value.length === 0
																			? null
																			: +e.target.value,
																};
															} else {
																return el;
															}
														});
														return {
															sem2: updatedElement,
														};
													});
												}}
												value={element.credite ?? 0}
												placeholder='4'
											/>
										</FormControl>

										<Box mt={'1.5rem'}>
											<IconButton
												icon={<IoRemoveOutline />}
												aria-label='Delete Entry'
												isRound
												colorScheme='red'
												color={'#fff'}
												fontSize={18}
												onClick={() => {
													setSem2Data((prev) => {
														const updatedData = prev.sem2.filter(
															(e) => e.id !== element.id
														);
														return { sem2: updatedData };
													});
												}}
											/>
										</Box>
									</HStack>
								))}
							</Box>
						</Box>
					</DrawerBody>

					<DrawerFooter>
						<Button variant='outline' mr={3} onClick={onClose}>
							Cancel
						</Button>
						<Button
							colorScheme='blue'
							isDisabled={
								anLabel.length === 0 ||
								sem1Data.sem1.length === 0 ||
								sem2Data.sem2.length === 0 ||
								sem1Data.sem1.map((e) => e.name).some((e) => e.length === 0) ||
								sem2Data.sem2.map((e) => e.name).some((e) => e.length === 0)
							}
							onClick={handleAddCatalogData}
						>
							Save
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</Box>
	);
}

export default Catalog;
