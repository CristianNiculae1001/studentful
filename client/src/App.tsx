import { Route, Routes, useNavigate } from 'react-router-dom';
import { Spacer, IconButton, Image, useDisclosure } from '@chakra-ui/react'
import {
  AppShell,
  Sidebar as SidebarComp,
  SidebarSection,
  SidebarOverlay,
  NavItem,
  NavGroup,
} from '@saas-ui/react'
import {
  FiHome,
  FiChevronsLeft,
  FiChevronsRight,
} from 'react-icons/fi'
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
import Catalog from './pages/Catalog';

function App() {   
  const { isOpen, onToggle, onClose } = useDisclosure({
    defaultIsOpen: true,
  })
  const user = useSelector((state: RootState) => state.user.data);

  const navigate = useNavigate();
  const { width } = useWindowDimensions();

  useEffect(() => {
    if(width < 774) {
      onClose();
    }
  }, [width]);

  return (
    <>
      {
        user === null ?
        <AppShell
      >
          <Routes>       
              <Route path={'/'} element={
              <Auth>
                <Homepage />
              </Auth>
              } />
              <Route path={'/catalog'} element={
              <Auth>
                <Catalog />
              </Auth>
              } />      
            <Route path={'/register'} element={<Register />} />            
            <Route path={'/login'} element={<Login />} />            
          </Routes>
      </AppShell>
      :
      <AppShell
      sidebar={
        <SidebarComp
          toggleBreakpoint={false}
          variant={isOpen ? 'default' : 'compact'}
          transition="width"
          transitionDuration="normal"
          width={isOpen ? '280px' : '14'}
          minWidth="auto"
        >
          <SidebarSection direction={isOpen ? 'row' : 'column'}>
            <Image
              src="https://saas-ui.dev/favicons/favicon-96x96.png"
              boxSize="6"
              mb="1"
              display={isOpen ? 'block' : 'none'}
            />
            <Spacer />
            {
              width < 772 ?
                <>
                </>
                :
                <IconButton
                  onClick={onToggle}
                  variant="ghost"
                  size="sm"
                  icon={isOpen ? <FiChevronsLeft /> : <FiChevronsRight />}
                  aria-label="Toggle Sidebar"
                />
            }
          </SidebarSection>

          <SidebarSection flex="1" overflowY="auto" overflowX="hidden">
            <NavGroup>
              <NavItem icon={<FiHome />} onClick={() => {
                navigate('/');
              }}>
                Homepage
              </NavItem>
              <NavItem icon={<GrCatalogOption />} onClick={() => {
                navigate('/catalog')
              }} >Catalog</NavItem>
            </NavGroup>
          </SidebarSection>
          <SidebarOverlay zIndex="1" />
        </SidebarComp>
      }
    >
        <Nav />     
        <Routes>
            <Route path={'/'} element={
              <Auth>
                <Homepage />
              </Auth>
              } />
              <Route path={'/catalog'} element={
              <Auth>
                <Catalog />
              </Auth>
              } />            
            <Route path={'/register'} element={<Register />} />            
           <Route path={'/login'} element={<Login />} />            
     </Routes>
    </AppShell>
      }
    </>
  )
}

export default App
