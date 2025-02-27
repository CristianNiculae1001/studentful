import {
	Box,
	Breadcrumb,
	BreadcrumbItem,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	useColorMode,
	useToast,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { getEditorList } from '../../api/getEditorList';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { FiSearch } from 'react-icons/fi';
import { formatDate } from '../../utils/formatDate';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateUserData } from '../../features/user';
import { MdDelete } from 'react-icons/md';
import { deleteEditorItem } from '../../api/deleteEditorItem';

function Table() {
	const gridRef = useRef<AgGridReact>(null);
	const initialRowData = useRef<Record<string, unknown>[]>([]);
	const [data, setData] = useState<Record<string, any>[]>([]);
	const [searchInput, setSearchInput] = useState<string>('');
	const { colorMode } = useColorMode();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const toast = useToast();

	const getEditorListHandler = async () => {
		const response = await getEditorList();
		if (response?.status === 0) {
			localStorage.removeItem('auth');
			dispatch(updateUserData(null));
			navigate('/login');
			return;
		}
		setData(response?.data);
		initialRowData.current = response?.data;
	};

	useEffect(() => {
		getEditorListHandler();
	}, []);

	const filterData = (): void => {
		let filtered = [...initialRowData.current]?.filter(
			(el: Record<string, any>) =>
				el?.title?.toLowerCase().includes(searchInput.toLowerCase()) ||
				el?.tag?.toLowerCase().includes(searchInput.toLowerCase()) ||
				el?.content?.toLowerCase().includes(searchInput.toLowerCase()) ||
				el?.created_at?.toLowerCase().includes(searchInput.toLowerCase()) ||
				el?.updated_at?.toLowerCase().includes(searchInput.toLowerCase())
		);

		setData(filtered);
	};

	useEffect(() => {
		filterData();
	}, [searchInput]);

	const [isSelected, setIsSelected] = useState(false);

	const handleDelete = async (id: string) => {
		setIsSelected(true);
		const response = await deleteEditorItem(id);
		if (response?.status === 1) {
			toast({
				title: 'Item sters cu succes',
				status: 'success',
				duration: 3000,
				isClosable: true,
			});
			getEditorListHandler();
		} else {
			toast({
				title: 'Eroare la stergerea item-ului',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
		setIsSelected(false);
	};

	const columns: ColDef<any>[] = [
		{ headerName: 'Title', field: 'title', flex: 1, tooltipField: 'title' },
		{ headerName: 'Tag', field: 'tag', flex: 1, tooltipField: 'tag' },
		{
			headerName: 'Content',
			field: 'content',
			flex: 2,
			tooltipField: 'content',
		},
		{
			headerName: 'Created At',
			field: 'created_at',
			flex: 1,
			cellRenderer: (params: any) => {
				return <Box>{formatDate(params?.data?.created_at)}</Box>;
			},
			tooltipValueGetter: (params: any) => {
				return formatDate(params?.data?.created_at);
			},
		},
		{
			headerName: 'Updated At',
			field: 'updated_at',
			flex: 1,
			cellRenderer: (params: any) => {
				return <Box>{formatDate(params?.data?.updated_at)}</Box>;
			},
			tooltipValueGetter: (params: any) => {
				return formatDate(params?.data?.updated_at);
			},
		},
		{
			headerName: '',
			maxWidth: 64,
			pinned: 'right',
			sortable: false,
			suppressMovable: true,
			resizable: false,
			cellRenderer: (params: any) => {
				return (
					<IconButton
						icon={<MdDelete fontSize={'22px'} />}
						pos={'relative'}
						top={'6px'}
						aria-label='Edit'
						variant={'link'}
						colorScheme='red'
						onClick={() => handleDelete(params?.data?.id)}
					/>
				);
			},
		},
	];

	return (
		<Box>
			<Box
				display='flex'
				justifyContent={'space-between'}
				alignItems='center'
				mb='1rem'
			>
				<Breadcrumb>
					<BreadcrumbItem>
						<Link to='/editor'>Editor</Link>
					</BreadcrumbItem>

					<BreadcrumbItem isCurrentPage>
						<Link to='/editor/list'>Lista</Link>
					</BreadcrumbItem>
				</Breadcrumb>
				<Box display={'flex'} alignItems={'center'} gap={'1.25rem'}>
					<InputGroup>
						<InputLeftElement>
							<FiSearch />
						</InputLeftElement>
						<Input
							maxW={240}
							type={'search'}
							variant={'flushed'}
							placeholder='Caută...'
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
						/>
					</InputGroup>
				</Box>
			</Box>

			<Box
				className={
					colorMode === 'light' ? 'ag-theme-quartz' : 'ag-theme-quartz-dark'
				}
				h={'calc(100vh - 160px)'}
				mt={'1rem'}
			>
				<AgGridReact
					ref={gridRef}
					rowData={data}
					columnDefs={columns}
					pagination={true}
					paginationAutoPageSize={true}
					enableCellTextSelection={true}
					tooltipTrigger='hover'
					tooltipHideDelay={1000}
					tooltipShowDelay={0}
					rowSelection={isSelected ? undefined : 'single'}
					rowStyle={{ cursor: 'pointer' }}
					onRowClicked={
						isSelected
							? undefined
							: (e) => {
									navigate(`/editor/list/${e?.data?.id}`);
							  }
					}
				/>
			</Box>
		</Box>
	);
}

export default Table;
