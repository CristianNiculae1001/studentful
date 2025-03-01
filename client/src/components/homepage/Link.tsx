import {
	Box,
	useToast,
	Text,
	Skeleton,
	useColorModeValue,
} from '@chakra-ui/react';
import { getLastLink } from '../../api/getLastLink';
import { useState, useEffect } from 'react';
import { formatDate } from '../../utils/formatDate';

function Link() {
	const [link, setLink] = useState<Record<string, any>>({});
	const [loading, setLoading] = useState<boolean>(false);
	const toast = useToast();

	const getLastLinkHandler = async () => {
		setLoading(true);
		const lastLink = await getLastLink();
		if (lastLink?.error) {
			toast({
				title: 'Error',
				description: lastLink.error,
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}
		setLink(lastLink?.data[0]);
		setLoading(false);
	};

	useEffect(() => {
		getLastLinkHandler();
	}, []);

	const linkBg = useColorModeValue('white', '#252A34');
	const linkBorder = useColorModeValue('#ccc', '#393E46');
	const textColor = useColorModeValue('#1d2025', '#EDEDED');

	const generatedUrl = `${window.location.origin}/links/${link?.label}`;

	return (
		<Skeleton isLoaded={!loading} mt={'1.25rem'}>
			<Text fontWeight={600} fontSize={'16px'}>
				Ultimul link
			</Text>
			<Box
				key={link.id as number}
				p={4}
				mb={4}
				borderRadius={8}
				color={textColor}
				bg={linkBg}
				border={`1px solid ${linkBorder}`}
			>
				<Text fontSize={'16px'} fontWeight={600} mb={'8px'}>
					<a href={generatedUrl} target='_blank'>
						{generatedUrl}
					</a>
				</Text>
				<Text>
					Creat pe:{' '}
					<Box as={'span'} fontWeight={500}>
						{formatDate(link?.created_at)}
					</Box>
				</Text>
			</Box>
		</Skeleton>
	);
}

export default Link;
