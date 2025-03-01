import {
	Box,
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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getCatalogStats } from '../../api/getCatalogStats';
import { BarChart, LineChart, Sparkline } from '@saas-ui/charts';

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

	return (
		<Skeleton isLoaded={!loading} className='statsContainer'>
			{Object.keys(stats).length > 0 ? (
				<>
					<Box>
						<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
							<StatCard title='Total Materii' value={stats?.totalSubjects} />
							<StatCard title='Total Credite' value={stats?.totalCredits} />
							<StatCard
								title='Media Generală'
								value={stats?.overallAverage?.toFixed(2)}
							/>
						</SimpleGrid>

						<Box mt={5}>
							<Card title='Evoluția Notelor'>
								<CardHeader
									pb='0'
									display={'flex'}
									justifyContent={'space-between'}
									alignItems={'center'}
								>
									<Heading as='h4' fontWeight='medium' size='md' flex={1}>
										Evolutia Mediilor pe ani
									</Heading>
									<Stat flex={0.4}>
										<StatLabel>
											Randament Educational fata de anul precedent
										</StatLabel>
										<StatNumber textAlign={'center'}>
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
									<Sparkline
										height={'140px'}
										categories={['average']}
										data={stats?.yearlySparkline?.sort((a: any, b: any) =>
											a.year.localeCompare(b.year)
										)}
									/>
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
									<BarChart
										height={'240px'}
										categories={['average']}
										data={stats?.subjectAverages?.map((item: any) => {
											return {
												date: item?.subject,
												average: item?.average,
											};
										})}
									/>
								</CardBody>
							</Card>

							<Card title='Media pe Semestre'>
								<CardBody>
									<CardHeader pb='0'>
										<Heading as='h4' fontWeight='medium' size='md'>
											Media pe Semestre
										</Heading>
									</CardHeader>
									<LineChart
										height={'200px'}
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
								</CardBody>
							</Card>
						</SimpleGrid>

						<Box mt={5}>
							<Card title='Distribuția Notelor'>
								<CardBody>
									<CardHeader pb='0'>
										<Heading as='h4' fontWeight='medium' size='md'>
											Distributia Notelor
										</Heading>
									</CardHeader>
									<BarChart
										height={'200px'}
										categories={['count']}
										data={stats?.gradeDistribution?.map((item: any) => ({
											date: `Nota ${item.grade}`,
											count: item?.count,
										}))}
									/>
								</CardBody>
							</Card>
						</Box>
					</Box>
				</>
			) : (
				<></>
			)}
		</Skeleton>
	);
}

export default Stats;
