import {
	Box,
	Button,
	Card,
	CardBody,
	CardHeader,
	Heading,
	SimpleGrid,
	Skeleton,
	Stat,
	StatLabel,
	StatNumber,
	useToast,
	Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getCatalogStats } from '../../api/getCatalogStats';
import { BarChart, LineChart, Sparkline } from '@saas-ui/charts';
import { FiBarChart2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function Stats() {
	const [stats, setStats] = useState<Record<string, any>>({});
	const [loading, setLoading] = useState<boolean>(false);

	const toast = useToast();

	const getStatsHandler = async () => {
		setLoading(true);
		const stats = await getCatalogStats();
		if (stats?.error) {
			toast({
				title: 'Error',
				description: stats.error,
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}
		setStats(stats?.data);
		setLoading(false);
	};

	useEffect(() => {
		getStatsHandler();
	}, []);

	const StatCard = ({ title, value }: { title: string; value: number }) => (
		<Card>
			<CardHeader>
				<Stat>
					<StatLabel>{title}</StatLabel>
					<StatNumber>{value}</StatNumber>
				</Stat>
			</CardHeader>
		</Card>
	);

	const EmptyState = ({
		title,
		message,
	}: {
		title: string;
		message: string;
	}) => {
		const navigate = useNavigate();

		return (
			<Box textAlign='center' p={5}>
				<FiBarChart2 size={50} color='gray' />
				<Text fontSize='lg' fontWeight='bold' mt={3}>
					{title}
				</Text>
				<Text fontSize='md' color='gray.500' mt={2}>
					{message}
				</Text>
				<Button mt={4} colorScheme='blue' onClick={() => navigate('/catalog')}>
					📚 Adaugă Note
				</Button>
			</Box>
		);
	};

	return (
		<Skeleton isLoaded={!loading} className='statsContainer' mt='1rem'>
			{Object.keys(stats).length > 0 ? (
				<>
					<Box>
						<SimpleGrid columns={{ base: 1, md: 3, lg: 3 }} spacing={5}>
							<StatCard
								title='Total Materii'
								value={stats?.totalSubjects || 0}
							/>
							<StatCard
								title='Total Credite'
								value={stats?.totalCredits || 0}
							/>
							<StatCard
								title='Media Generală'
								value={stats?.overallAverage?.toFixed(2) || 'N/A'}
							/>
						</SimpleGrid>

						<Box mt={5}>
							<Card title='Evoluția Notelor'>
								<CardHeader
									pb='0'
									display='flex'
									justifyContent='space-between'
									alignItems='center'
								>
									<Heading as='h4' fontWeight='medium' size='md' flex={1}>
										Evoluția Mediilor pe ani
									</Heading>
									<Stat flex={0.4}>
										<StatLabel textAlign='center'>
											Randament Educațional
										</StatLabel>
										<StatNumber textAlign='center'>
											{stats.lastYearGrowth !== null ? (
												<span
													style={{
														color: stats.lastYearGrowth >= 0 ? 'green' : 'red',
													}}
												>
													{stats.lastYearGrowth > 0
														? `+${stats.lastYearGrowth}%`
														: `${stats.lastYearGrowth}%`}
												</span>
											) : (
												'N/A'
											)}
										</StatNumber>
									</Stat>
								</CardHeader>
								<CardBody>
									{stats?.yearlySparkline?.length > 0 ? (
										<Sparkline
											height='240px'
											categories={['average']}
											data={stats?.yearlySparkline?.sort((a: any, b: any) =>
												a.year.localeCompare(b.year)
											)}
										/>
									) : (
										<EmptyState
											title='Nu există date despre evoluția mediilor'
											message='Începe prin adăugarea unor note în catalog.'
										/>
									)}
								</CardBody>
							</Card>
						</Box>

						<SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mt={5}>
							<Card title='Media Notelor pe Materii'>
								<CardBody>
									<CardHeader pb='0'>
										<Heading as='h4' fontWeight='medium' size='md'>
											Media Notelor pe Materii
										</Heading>
									</CardHeader>
									{stats?.subjectAverages?.length > 0 ? (
										<BarChart
											height='300px'
											categories={['average']}
											data={stats?.subjectAverages?.map((item: any) => ({
												date: item?.subject,
												average: item?.average,
											}))}
										/>
									) : (
										<EmptyState
											title='Nu există date despre media materiilor'
											message='Adaugă note în catalog pentru a vedea aceste statistici.'
										/>
									)}
								</CardBody>
							</Card>

							<Card title='Media pe Semestre'>
								<CardBody>
									<CardHeader pb='0'>
										<Heading as='h4' fontWeight='medium' size='md'>
											Media pe Semestre
										</Heading>
									</CardHeader>
									{stats?.semesterAverages?.length > 0 ? (
										<LineChart
											height='300px'
											categories={['average']}
											data={stats?.semesterAverages
												?.map((item: any) => ({
													date: `${item?.year} | S${
														item?.semester[item?.semester.length - 1]
													}`,
													average: item.average,
												}))
												.sort((a: any, b: any) => a.date.localeCompare(b.date))}
										/>
									) : (
										<EmptyState
											title='Nu există date despre media pe semestre'
											message='Adaugă note pentru a urmări progresul tău.'
										/>
									)}
								</CardBody>
							</Card>
						</SimpleGrid>

						<Box mt={5}>
							<Card title='Distribuția Notelor'>
								<CardBody>
									<CardHeader pb='0'>
										<Heading as='h4' fontWeight='medium' size='md'>
											Distribuția Notelor
										</Heading>
									</CardHeader>
									{stats?.gradeDistribution?.length > 0 ? (
										<BarChart
											height='400px'
											categories={['count']}
											data={stats?.gradeDistribution?.map((item: any) => ({
												date: `Nota ${item.grade}`,
												count: item?.count,
											}))}
										/>
									) : (
										<EmptyState
											title='Nu există date despre distribuția notelor'
											message='Adaugă note pentru a vedea statistici detaliate.'
										/>
									)}
								</CardBody>
							</Card>
						</Box>
					</Box>
				</>
			) : (
				<EmptyState
					title='Nu există statistici disponibile'
					message='Începe prin adăugarea unor note în catalog pentru a vedea datele tale.'
				/>
			)}
		</Skeleton>
	);
}

export default Stats;
