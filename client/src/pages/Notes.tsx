import { Box, IconButton, useDisclosure } from '@chakra-ui/react'
import { FiPlus } from 'react-icons/fi'
import AddNoteModal from '../components/notes/AddNoteModal';

function Notes() {
  const {onOpen, isOpen, onClose} = useDisclosure();
  return (
    <Box className='notesPageContainer' p={'1rem'}>
      <Box className="menuContainer" textAlign={'end'}>
        <IconButton icon={<FiPlus />} aria-label="Add Entry" fontSize={16} isRound colorScheme={'blue'} onClick={onOpen} />
      </Box>
      <AddNoteModal isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}

export default Notes