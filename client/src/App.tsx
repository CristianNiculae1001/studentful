import { Route, Routes, useNavigate } from 'react-router-dom';
import { Spacer, IconButton, useDisclosure } from '@chakra-ui/react';
import {
	AppShell,
	Sidebar as SidebarComp,
	SidebarSection,
	SidebarOverlay,
	NavItem,
	NavGroup,
} from '@saas-ui/react';
import { FiHome, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { GoBook } from 'react-icons/go';
import { SlNotebook } from 'react-icons/sl';
import Homepage from './pages/Homepage';
import Register from './pages/Register';
import Login from './pages/Login';
import Nav from './components/static/Navbar';
import Auth from './components/static/Auth';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { useEffect } from 'react';
import useWindowDimensions from './hooks/useWindowDimensions';
import { GrCatalogOption } from 'react-icons/gr';
import { IoIosLink, IoMdSettings } from 'react-icons/io';
import Catalog from './pages/Catalog';
import Notes from './pages/Notes';
import Note from './pages/Note';
import Links from './pages/Links';
import Link from './pages/Link';
import Editor from './pages/Editor';
import EditorList from './pages/EditorList';
import EditorItem from './pages/EditorItem';
import { FaRegCalendarAlt, FaUserSecret } from 'react-icons/fa';
import Credentials from './pages/Credentials';
import { updateUserData } from './features/user';
import { MdLogout } from 'react-icons/md';
import ChangePassword from './pages/ChangePassword';
import Settings from './pages/Settings';
import Calendar from './pages/Calendar';

function App() {
	const { isOpen, onToggle, onClose } = useDisclosure({
		defaultIsOpen: true,
	});
	const user = useSelector((state: RootState) => state.user.data);

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { width } = useWindowDimensions();

	useEffect(() => {
		if (width < 774) {
			onClose();
		}
	}, [width]);

	return (
		<>
			{user === null ? (
				<AppShell>
					<Routes>
						<Route
							path={'/'}
							element={
								<Auth>
									<Homepage />
								</Auth>
							}
						/>
						<Route
							path={'/catalog'}
							element={
								<Auth>
									<Catalog />
								</Auth>
							}
						/>
						<Route
							path={'/notes'}
							element={
								<Auth>
									<Notes />
								</Auth>
							}
						/>
						<Route
							path={'/links'}
							element={
								<Auth>
									<Links />
								</Auth>
							}
						/>
						<Route path={'/links/:label'} element={<Link />} />
						<Route
							path={'/note/:id'}
							element={
								<Auth>
									<Note />
								</Auth>
							}
						/>
						<Route
							path={'/editor'}
							element={
								<Auth>
									<Editor />
								</Auth>
							}
						/>
						<Route
							path={'/editor/list'}
							element={
								<Auth>
									<EditorList />
								</Auth>
							}
						/>
						<Route
							path={'/editor/list/:id'}
							element={
								<Auth>
									<EditorItem />
								</Auth>
							}
						/>
						<Route
							path={'/credentials'}
							element={
								<Auth>
									<Credentials />
								</Auth>
							}
						/>
						<Route
							path={'/calendar'}
							element={
								<Auth>
									<Calendar />
								</Auth>
							}
						/>
						<Route
							path={'/settings'}
							element={
								<Auth>
									<Settings />
								</Auth>
							}
						/>
						<Route path={'/register'} element={<Register />} />
						<Route path={'/login'} element={<Login />} />
						<Route
							path={'/change-password/:ext/:id'}
							element={<ChangePassword />}
						/>
					</Routes>
				</AppShell>
			) : (
				<AppShell
					sidebar={
						<SidebarComp
							toggleBreakpoint={false}
							variant={isOpen ? 'default' : 'compact'}
							transition='width'
							transitionDuration='normal'
							width={isOpen ? '280px' : '14'}
							minWidth='auto'
						>
							<SidebarSection direction={isOpen ? 'row' : 'column'}>
								{/* <Image
										src={}
										boxSize="6"
										mb="1"
										display={isOpen ? 'block' : 'none'}
									/> */}
								<Spacer />
								{width < 772 ? (
									<></>
								) : (
									<IconButton
										onClick={onToggle}
										variant='ghost'
										size='sm'
										icon={isOpen ? <FiChevronsLeft /> : <FiChevronsRight />}
										aria-label='Toggle Sidebar'
									/>
								)}
							</SidebarSection>

							<SidebarSection flex='1' overflowY='auto' overflowX='hidden'>
								<NavGroup>
									<NavItem
										icon={<FiHome />}
										onClick={() => {
											navigate('/');
										}}
										cursor={'pointer'}
									>
										Homepage
									</NavItem>
									<NavItem
										icon={<GrCatalogOption />}
										onClick={() => {
											navigate('/catalog');
										}}
										cursor={'pointer'}
									>
										Catalog
									</NavItem>
									<NavItem
										icon={<SlNotebook />}
										onClick={() => {
											navigate('/notes');
										}}
										cursor={'pointer'}
									>
										Notite
									</NavItem>
									<NavItem
										icon={<IoIosLink />}
										onClick={() => {
											navigate('/links');
										}}
										cursor={'pointer'}
									>
										Link-uri
									</NavItem>
									<NavItem
										icon={<GoBook />}
										onClick={() => {
											navigate('/editor');
										}}
										cursor={'pointer'}
									>
										Editor
									</NavItem>
									<NavItem
										icon={<FaUserSecret />}
										onClick={() => {
											navigate('/credentials');
										}}
										cursor={'pointer'}
									>
										Credentiale
									</NavItem>
									<NavItem
										icon={<FaRegCalendarAlt />}
										onClick={() => {
											navigate('/calendar');
										}}
										cursor={'pointer'}
									>
										Calendar
									</NavItem>
									<NavItem
										icon={<IoMdSettings />}
										onClick={() => {
											navigate('/settings');
										}}
										cursor={'pointer'}
									>
										Setari
									</NavItem>
									<NavItem
										icon={<MdLogout />}
										onClick={() => {
											localStorage.removeItem('auth');
											dispatch(updateUserData(null));
											navigate('/login');
										}}
										cursor={'pointer'}
									>
										Logout
									</NavItem>
								</NavGroup>
							</SidebarSection>
							<SidebarOverlay zIndex='1' />
						</SidebarComp>
					}
				>
					<Nav />
					<Routes>
						<Route
							path={'/'}
							element={
								<Auth>
									<Homepage />
								</Auth>
							}
						/>
						<Route
							path={'/catalog'}
							element={
								<Auth>
									<Catalog />
								</Auth>
							}
						/>
						<Route
							path={'/notes'}
							element={
								<Auth>
									<Notes />
								</Auth>
							}
						/>
						<Route
							path={'/links'}
							element={
								<Auth>
									<Links />
								</Auth>
							}
						/>
						<Route path={'/links/:label'} element={<Link />} />
						<Route
							path={'/note/:id'}
							element={
								<Auth>
									<Note />
								</Auth>
							}
						/>
						<Route
							path={'/editor'}
							element={
								<Auth>
									<Editor />
								</Auth>
							}
						/>
						<Route
							path={'/editor/list'}
							element={
								<Auth>
									<EditorList />
								</Auth>
							}
						/>
						<Route
							path={'/editor/list/:id'}
							element={
								<Auth>
									<EditorItem />
								</Auth>
							}
						/>
						<Route
							path={'/credentials'}
							element={
								<Auth>
									<Credentials />
								</Auth>
							}
						/>
						<Route
							path={'/calendar'}
							element={
								<Auth>
									<Calendar />
								</Auth>
							}
						/>
						<Route
							path={'/settings'}
							element={
								<Auth>
									<Settings />
								</Auth>
							}
						/>
						<Route path={'/register'} element={<Register />} />
						<Route path={'/login'} element={<Login />} />
						<Route
							path={'/change-password/:ext/:id'}
							element={<ChangePassword />}
						/>
					</Routes>
				</AppShell>
			)}
		</>
	);
}

export default App;
