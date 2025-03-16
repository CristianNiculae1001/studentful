import { Box, useColorMode, useToast } from '@chakra-ui/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getCatalog } from '../../../api/getCatalog';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { CellValueChangedEvent, ColDef, ColGroupDef } from 'ag-grid-community';
import { updateCatalog } from '../../../api/updateCatalog';

function Table({
	isSuccessful,
	setIsSuccessful,
	inHomepage,
}: {
	isSuccessful?: boolean;
	setIsSuccessful?: React.Dispatch<React.SetStateAction<boolean>>;
	inHomepage?: boolean;
}) {
	const toast = useToast();
	const { colorMode } = useColorMode();

	const gridRef = useRef<AgGridReact>(null);
	const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
	const [rowData, setRowData] = useState<any[]>([]);
	const [columnDefs, _] = useState<(ColDef | ColGroupDef)[]>([
		{ field: 'an', headerName: 'An', editable: false },
		{
			headerName: 'Semestrul 1',
			children: [
				{
					field: 'name_1',
					headerName: 'Materie',
					tooltipField: 'name_1',
				},
				{
					field: 'grades_1',
					headerName: 'Note',
					tooltipField: 'grades_1',
				},
				{
					field: 'puncte_1',
					headerName: 'Puncte',
					tooltipField: 'puncte_1',
				},
				{
					field: 'credits_1',
					headerName: 'Nr. Credite',
					tooltipField: 'credits_1',
				},
				{
					field: 'data_1',
					headerName: 'Data',
					tooltipField: 'data_1',
				},
			],
		},
		{
			headerName: 'Semestrul 2',
			children: [
				{
					field: 'name_2',
					headerName: 'Materie',
					tooltipField: 'name_2',
				},
				{
					field: 'grades_2',
					headerName: 'Note',
					tooltipField: 'grades_2',
				},
				{
					field: 'puncte_2',
					headerName: 'Puncte',
					tooltipField: 'puncte_2',
				},
				{
					field: 'credits_2',
					headerName: 'Nr. Credite',
					tooltipField: 'credits_2',
				},
				{
					field: 'data_2',
					headerName: 'Data',
					tooltipField: 'data_2',
				},
			],
		},
	]);
	const defaultColDef = useMemo<ColDef>(() => {
		return {
			flex: 1,
			editable: true,
		};
	}, []);

	const handleCatalogUpdate = async (
		event?: CellValueChangedEvent<any, any>
	) => {
		const updatedData: Record<
			string,
			{
				sem1: {
					credite: number;
					id: string;
					name: string;
					note: number[];
					puncte: number[] | null;
					data: string;
				}[];
				sem2: {
					credite: number;
					id: string;
					name: string;
					note: number[];
					puncte: number[] | null;
					data: string;
				}[];
			}
		>[] = [];
		const groupedDataByAn: Record<
			string,
			{
				sem1: {
					credite: number;
					id: string;
					name: string;
					note: number[];
					puncte: number[] | null;
					data: string;
				}[];
				sem2: {
					credite: number;
					id: string;
					name: string;
					note: number[];
					puncte: number[] | null;
					data: string;
				}[];
			}
		> = {};
		let iterator = event
			? event.api.getRenderedNodes()
			: gridRef.current && gridRef?.current.api.getRenderedNodes();
		iterator?.forEach((element) => {
			const data = element.data;
			if (!groupedDataByAn[data?.an]) {
				groupedDataByAn[data?.an] = { sem1: [], sem2: [] };
			}
			const sem1 = {
				credite: data?.credits_1 as number,
				id: data?.id_1 as string,
				name: data?.name_1 as string,
				note: data?.grades_1?.split(',')?.map((e: string) => +e) as number[],
				puncte: data?.puncte_1
					? (data?.puncte_1?.split(',')?.map((e: string) => +e) as number[])
					: null,
				data: data?.data_1 as string,
			};
			const sem2 = {
				credite: data?.credits_2 as number,
				id: data?.id_2 as string,
				name: data?.name_2 as string,
				note: data?.grades_2?.split(',')?.map((e: string) => +e) as number[],
				puncte: data?.puncte_2
					? (data?.puncte_2?.split(',')?.map((e: string) => +e) as number[])
					: null,
				data: data?.data_2 as string,
			};
			if (!Object.values(sem1).every((e) => e === undefined)) {
				groupedDataByAn[data?.an]?.sem1?.push(sem1);
			}
			if (!Object.values(sem2).every((e) => e === undefined)) {
				groupedDataByAn[data?.an]?.sem2?.push(sem2);
			}
		});
		Object.entries(groupedDataByAn).forEach(([key, value]) => {
			updatedData.push({ [key]: value });
		});
		const result = await updateCatalog(
			localStorage.getItem('auth') ?? '',
			updatedData
		);
		if (result?.status) {
			toast({
				title: 'Actualizare reusita',
				status: 'success',
				description: 'Catalogul a fost actualizat cu succes',
				isClosable: true,
				duration: 2000,
				position: 'top-right',
			});
		} else {
			toast({
				title: 'Error',
				status: 'error',
				description: result?.message,
				isClosable: true,
				duration: 2000,
				position: 'top-right',
			});
		}
	};

	const getCatalogData = async () => {
		const response = await getCatalog(localStorage.getItem('auth') ?? '');
		// setCatalogData(response);

		const data =
			response?.data &&
			response?.data[0]?.data?.map((el: Record<string, any>) => {
				const an = Object.keys(el);
				const semesters = Object.values(el);
				const sem1 = (semesters[0] as Record<string, any>)?.sem1;
				const sem2 = (semesters[0] as Record<string, any>)?.sem2;

				const processedSem1: Record<string, any>[] = sem1?.map((s1: any) => {
					return {
						an,
						id_1: s1?.id,
						name_1: s1?.name,
						grades_1: s1?.note?.join(','),
						credits_1: s1?.credite,
						puncte_1: s1?.puncte ? s1?.puncte?.join(',') : '',
						data_1: s1?.data,
					};
				});

				const processedSem2: Record<string, any>[] = sem2?.map((s2: any) => {
					return {
						an,
						id_2: s2?.id,
						name_2: s2?.name,
						grades_2: s2?.note?.join(','),
						credits_2: s2?.credite,
						puncte_2: s2?.puncte ? s2?.puncte?.join(',') : '',
						data_2: s2?.data,
					};
				});

				const output = [];

				for (
					let i = 0;
					i < Math.max(processedSem1.length, processedSem2.length);
					i++
				) {
					if (processedSem1.length > processedSem2.length) {
						let result = { ...processedSem1[i] };
						if (processedSem2[i]) {
							result = { ...result, ...processedSem2[i] };
						}
						output.push(result);
					} else {
						let result = { ...processedSem2[i] };
						if (processedSem1[i]) {
							result = { ...result, ...processedSem1[i] };
						}
						output.push(result);
					}
				}

				return output;
			});
		const rows: any = [];

		data?.forEach((r: any) => {
			Object.values(r).forEach((v) => {
				rows.push(v);
			});
		});

		setRowData(rows);
	};

	const onGridReady = () => {
		document.addEventListener('keydown', (e) => {
			// stergerea unui rand pe apasarea DELETE
			if (e.keyCode === 46) {
				const sel =
					gridRef.current?.api && gridRef.current?.api.getSelectedRows();
				gridRef.current?.api &&
					gridRef.current?.api.applyTransaction({ remove: sel });
			}
		});
	};

	useEffect(() => {
		getCatalogData();
	}, []);

	useEffect(() => {
		if (isSuccessful) {
			getCatalogData();
			setIsSuccessful && setIsSuccessful(false);
		}
	}, [isSuccessful]);

	return (
		<Box
			className='tableContainer'
			h={inHomepage ? '20rem' : 'calc(100vh - 220px)'}
			mt={inHomepage ? 0 : '1rem'}
		>
			<Box
				style={gridStyle}
				className={
					colorMode === 'light' ? 'ag-theme-quartz' : 'ag-theme-quartz-dark'
				}
			>
				<AgGridReact
					ref={gridRef}
					rowData={rowData}
					columnDefs={columnDefs}
					defaultColDef={defaultColDef}
					onCellValueChanged={handleCatalogUpdate}
					onGridReady={onGridReady}
					rowSelection={'single'}
					animateRows={true}
					tooltipShowDelay={0}
					tooltipHideDelay={2000}
				/>
			</Box>
		</Box>
	);
}

export default Table;
