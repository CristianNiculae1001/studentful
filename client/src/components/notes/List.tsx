import { Box } from "@chakra-ui/react"
import { getNotes } from "../../api/getNotes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function List() {
    const [notes, setNotes] = useState<Record<string, unknown>[]>([]);
    const navigate = useNavigate();

    const getNotesHandler = async () => {
        const notes = await getNotes(sessionStorage.getItem('auth') ?? '', 1, 10);
        console.log(notes);
        setNotes(notes?.data);
    }

    useEffect(() => {
        getNotesHandler();
    }, []);

  return (
    // grid container for notes
    <Box className="listContainer" display={'grid'} gridTemplateColumns={'repeat(auto-fill, minmax(200px, 1fr))'} gap={'1rem'} mt={'1rem'}>
        {   
            notes.map((note) => (
                // each note should look like a real notepad page
                <Box key={note.id as number} className="noteContainer" p={'0.5rem'} border={'1px solid #ccc'} borderRadius={'2px'} cursor={'pointer'} transition={'all 0.3s ease'} _hover={{transform: 'scale(1.02)', boxShadow: '0 0 10px rgba(0,0,0,0.1)'}} onClick={() => {
                    navigate(`/note/${note.id}`);
                }}>
                    <Box className="noteTitle" textAlign={'center'} fontWeight={600} fontSize={'1rem'}>{note.title as string}</Box>
                    {
                        note?.tag ?
                        <Box className="noteTag" textAlign={'right'} fontWeight={300} fontSize={'12px'}>{note.tag as string}</Box> :
                        <></>
                    }
                    <Box className="noteCreatedAt" textAlign={'right'} mt={'4px'} fontSize={'14px'} style={!note?.tag ? {position: 'relative', top: '18px'} : undefined}>{new Date(note.created_at as string).toLocaleDateString()}</Box>
                </Box>
            ))
        }
    </Box>
  )
}

export default List