import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Input } from "@chakra-ui/react"
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"

function Note() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState<string>('');

    const handleAddNote = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            console.log(note);
            setNote('');
        }
    }

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
                <Input type={'search'} onChange={(e) => setNote(e.target.value)} variant={'flushed'} placeholder="Ex: De facut tema la economie" maxW={'50%'} onKeyDown={handleAddNote} />
            </Box>
        </Box>
    );
}

export default Note