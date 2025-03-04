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
import { useNavigate } from 'react-router-dom';

function Link() {
	const [link, setLink] = useState<Record<string, any>>({});
	const [loading, setLoading] = useState<boolean>(false);
	const toast = useToast();
	const navigate = useNavigate();

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
		setLink(lastLink?.data && lastLink?.data[0]);
		setLoading(false);
	};

	useEffect(() => {
		getLastLinkHandler();
	}, []);

	const linkBg = useColorModeValue('white', 'rgba(255, 255, 255, 0.08)');
	const linkBorder = useColorModeValue('#ccc', 'rgba(255, 255, 255, 0.04)');
	const textColor = useColorModeValue('#1d2025', '#EDEDED');
	const noteBg = useColorModeValue('white', 'rgba(255, 255, 255, 0.08)');
	const noteBorder = useColorModeValue('#ccc', 'rgba(255, 255, 255, 0.04)');
	const tagColor = useColorModeValue('gray.600', 'gray.400');

	const generatedUrl = `${window.location.origin}/links/${link?.label}`;

	return (
		<Skeleton isLoaded={!loading} mt={'1.5rem'}>
			<Text fontWeight={600} fontSize={'16px'} mb={'4px'}>
				Ultimul link
			</Text>
			{link ? (
				<>
					<Box
						key={link?.id as number}
						p={4}
						borderRadius={8}
						color={textColor}
						bg={linkBg}
						border={`1px solid ${linkBorder}`}
						display={'flex'}
						flexDir={'column'}
						gap={'1rem'}
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
				</>
			) : (
				<>
					<Box
						textAlign='center'
						display='flex'
						flexDirection='column'
						alignItems='center'
						justifyContent='center'
						p={4}
						borderRadius={8}
						color={textColor}
						bg={linkBg}
						border={`1px solid ${linkBorder}`}
					>
						<Text fontSize='0.9rem' color={tagColor} mb='12px'>
							Creează una nouă pentru a începe!
						</Text>
						<Box
							as='button'
							bg={noteBg}
							color={textColor}
							px='12px'
							py='6px'
							fontSize='14px'
							fontWeight='bold'
							borderRadius='6px'
							border={`1px solid ${noteBorder}`}
							cursor='pointer'
							transition='all 0.3s ease'
							_hover={{ background: noteBorder }}
							onClick={() => navigate('/links')}
						>
							Adaugă un link
						</Box>
					</Box>
				</>
			)}
		</Skeleton>
	);
}

export default Link;
