import {
	Box,
	Flex,
	Button,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuDivider,
	useColorModeValue,
	Stack,
	useColorMode,
	Center,
} from '@chakra-ui/react';
import { FaMoon } from 'react-icons/fa';
import { IoSunnyOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { updateUserData } from '../../features/user';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toCapitalize } from '../../utils/toCapitalize';
import Avatar from 'boring-avatars';

export default function Nav() {
	const { colorMode, toggleColorMode } = useColorMode();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const user = useSelector((state: RootState) => state.user.data);

	return (
		<>
			<Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
				<Flex h={16} alignItems={'center'} justifyContent={'flex-end'}>
					<Flex alignItems={'center'}>
						<Stack direction={'row'} spacing={4}>
							<Button onClick={toggleColorMode}>
								{colorMode === 'light' ? <FaMoon /> : <IoSunnyOutline />}
							</Button>

							<Menu>
								<MenuButton
									as={Button}
									rounded={'full'}
									variant={'link'}
									cursor={'pointer'}
									minW={0}
								>
									<Avatar
										size={28}
										name={`${toCapitalize(user?.first_name!)} ${toCapitalize(
											user?.last_name!
										)}`}
										variant='beam'
									/>
								</MenuButton>
								<MenuList alignItems={'center'} zIndex={9}>
									<br />
									<Center>
										<Avatar
											size={56}
											name={`${toCapitalize(user?.first_name!)} ${toCapitalize(
												user?.last_name!
											)}`}
											variant='beam'
										/>
									</Center>
									<br />
									<Center>
										<Box as={'p'} whiteSpace={'nowrap'}>
											{`${toCapitalize(user?.first_name!)} ${toCapitalize(
												user?.last_name!
											)}`}{' '}
											👋
										</Box>
									</Center>
									<br />
									<MenuDivider />
									<MenuItem
										onClick={() => {
											navigate('/settings');
										}}
									>
										Account Settings
									</MenuItem>
									<MenuItem
										onClick={() => {
											localStorage.removeItem('auth');
											dispatch(updateUserData(null));
											navigate('/login');
										}}
									>
										Logout
									</MenuItem>
								</MenuList>
							</Menu>
						</Stack>
					</Flex>
				</Flex>
			</Box>
		</>
	);
}
