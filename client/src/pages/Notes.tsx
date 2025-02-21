import { Box, IconButton, useDisclosure } from '@chakra-ui/react'
import { FiPlus } from 'react-icons/fi'
import AddNoteModal from '../components/notes/AddNoteModal';
import List from '../components/notes/List';
import { useState } from 'react';

function Notes() {
  const {onOpen, isOpen, onClose} = useDisclosure();
  const [isAddedNote, setIsAddedNote] = useState(false);

  return (
    <Box className='notesPageContainer' p={'1rem'}>
      <Box className="menuContainer" textAlign={'end'}>
        <IconButton icon={<FiPlus />} aria-label="Add Entry" fontSize={16} isRound colorScheme={'blue'} onClick={onOpen} />
      </Box>
      <List isAddedNote={isAddedNote}  />
      <AddNoteModal isOpen={isOpen} onClose={onClose} isAddedNote={isAddedNote} setIsAddedNote={setIsAddedNote} />
    </Box>
  )
}

export default Notes