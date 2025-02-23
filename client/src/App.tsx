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
import { SlNotebook } from 'react-icons/sl';
import Homepage from './pages/Homepage';
import Register from './pages/Register';
import Login from './pages/Login';
import Nav from './components/static/Navbar';
import Auth from './components/static/Auth';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { useEffect } from 'react';
import useWindowDimensions from './hooks/useWindowDimensions';
import { GrCatalogOption } from 'react-icons/gr';
import { IoIosLink } from 'react-icons/io';
import Catalog from './pages/Catalog';
import Notes from './pages/Notes';
import Note from './pages/Note';
import Links from './pages/Links';
import Link from './pages/Link';

function App() {
	const { isOpen, onToggle, onClose } = useDisclosure({
		defaultIsOpen: true,
	});
	const user = useSelector((state: RootState) => state.user.data);

	const navigate = useNavigate();
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
						<Route path={'/register'} element={<Register />} />
						<Route path={'/login'} element={<Login />} />
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
									>
										Homepage
									</NavItem>
									<NavItem
										icon={<GrCatalogOption />}
										onClick={() => {
											navigate('/catalog');
										}}
									>
										Catalog
									</NavItem>
									<NavItem
										icon={<SlNotebook />}
										onClick={() => {
											navigate('/notes');
										}}
									>
										Notite
									</NavItem>
									<NavItem
										icon={<IoIosLink />}
										onClick={() => {
											navigate('/links');
										}}
									>
										Link-uri
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
						<Route path={'/register'} element={<Register />} />
						<Route path={'/login'} element={<Login />} />
					</Routes>
				</AppShell>
			)}
		</>
	);
}

export default App;
