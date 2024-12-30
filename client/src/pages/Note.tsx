import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, IconButton, Input, useColorModeValue, useToast } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { addNoteItem } from "../api/addNoteItem";
import { getNoteItemsByNoteId } from "../api/getNoteItemsByNoteId";
import { deleteNoteItem } from "../api/deleteNoteItem";
import { TiDelete } from "react-icons/ti";

function Note() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [note, setNote] = useState<string>('');
    const [noteItems, setNoteItems] = useState<Record<string, unknown>[]>([]);

    const handleAddNote = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter' && id) {
            const addedNoteItem = await addNoteItem(sessionStorage.getItem('auth') || '', {id: parseInt(id), description: note});
            if(addedNoteItem.status === 1) {
                toast({
                    title: "Item adaugat cu succes",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                setNoteItems((prevNoteItems) => [...prevNoteItems, addedNoteItem.data[0]]);
            } else {
                toast({
                    title: "Eroare la adaugarea item-ului",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
            setNote('');
        }
    }

    const fetchNoteItems = async () => {
        if(id) {
            const noteItems = await getNoteItemsByNoteId(sessionStorage.getItem('auth') || '', parseInt(id));

            setNoteItems(noteItems);
        }
    };

    const handleDeleteNoteItem = async (id: string) => {
        if(id) {
            const deletedNoteItem = await deleteNoteItem(sessionStorage.getItem('auth') || '', parseInt(id));
            if(deletedNoteItem.status === 1) {
                toast({
                    title: "Item sters cu succes",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                const newNoteItems = noteItems.filter((noteItem) => noteItem.id !== parseInt(id));
                setNoteItems(newNoteItems);
            } else {
                toast({
                    title: "Eroare la stergerea item-ului",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    }

    useEffect(() => {
        fetchNoteItems();
    }, [id]);

    return (
        <Box className="noteContainer" p={'1rem'}>
            <Breadcrumb>
                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate('/notes')}>Notes</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href='#'>Notita #{id}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Box className="noteItemInputContainer" mb={'1rem'} display={'flex'} justifyContent={'center'} alignItems={'center'} mt={'18dvh'}>
                <Input type={'search'} onChange={(e) => setNote(e.target.value)} variant={'flushed'} value={note} placeholder="Ex: De facut tema la economie" maxW={'50%'} onKeyDown={handleAddNote} />
            </Box>
            <Box className="noteItemsContainer" display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                {noteItems.map((noteItem, index) => (
                    <Box key={index} className="noteItem" p={'1rem'} m={'1rem'} borderRadius={'md'} boxShadow={'md'} bg={useColorModeValue('gray.100', 'gray.900')} w={'40vw'} maxW={'100%'} display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} gap={'1rem'}>
                        <Box className="noteItemDescription" fontSize={'1.2rem'} fontWeight={'bold'} textAlign={'center'} color={useColorModeValue('gray.700', 'gray.500')}>
                            {noteItem.description as string}
                        </Box>
                        <Box>
                            <Box display={'inline-block'} className="noteItemDate" fontSize={'1rem'} fontWeight={'bold'} textAlign={'center'} color={'gray.500'}>
                                {new Date((noteItem.created_at as string)).toLocaleDateString()}
                            </Box>
                            <Box display={'inline-block'} className="noteItemDeleteButton" fontSize={'1.2rem'} fontWeight={'bold'} textAlign={'center'} ml={'8px'}>
                                <IconButton aria-label="Delete note item" icon={<TiDelete style={{width: '20px', height: '20px', marginTop: '4px'}} />} mt={'4px'} colorScheme="red" isRound variant={'link'} onClick={() => handleDeleteNoteItem(noteItem?.id as string)} />
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default Note