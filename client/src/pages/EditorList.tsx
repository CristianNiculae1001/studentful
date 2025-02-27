import { Box } from '@chakra-ui/react';
import Table from '../components/editorList/Table';

function EditorList() {
	return (
		<Box className='editorListContainer' p={'1rem'}>
			<Table />
		</Box>
	);
}

export default EditorList;
