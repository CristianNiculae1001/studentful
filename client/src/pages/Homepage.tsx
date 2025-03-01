import { Box, Text } from '@chakra-ui/react';
import Table from '../components/catalog/assets/Table';
import Note from '../components/homepage/Note';
import Link from '../components/homepage/Link';
import Stats from '../components/homepage/Stats';

function Homepage() {
	return (
		<Box className='homepageContainer' p={'1rem'} overflowY={'auto'}>
			<Box
				display={'flex'}
				justifyContent={'space-between'}
				alignItems={'flex-start'}
				gap={'1.25rem'}
			>
				<Box flex={1}>
					<Text fontWeight={600} fontSize={'16px'}>
						Catalog
					</Text>
					<Table inHomepage={true} />
				</Box>
				<Box flex={0.4}>
					<Note />
					<Link />
				</Box>
			</Box>
			<Stats />
		</Box>
	);
}

export default Homepage;
