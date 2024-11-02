import { Box, useColorMode } from "@chakra-ui/react"
import { useEffect, useMemo, useState } from "react"
import { getCatalog } from "../../../api/getCatalog";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { ColDef, ColGroupDef } from "ag-grid-community";

function Table() {
    const [catalogData, setCatalogData] = useState<Record<string, unknown>[]>([]);

    const {colorMode} = useColorMode();

    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
    const [rowData, setRowData] = useState<any[]>([]);
    const [columnDefs, setColumnDefs] = useState<(ColDef | ColGroupDef)[]>([
        { field: "an", headerName: "An" },
        { headerName: "Semestrul 1", children: [
            {
                field: 'name_1', headerName: 'Materie',
            }, 
            {
                field: 'grades_1', headerName: 'Note',
            }, 
            {
                field: 'credits_1', headerName: 'Nr. Credite',
            }
        ]},
        { headerName: "Semestrul 2", children: [
            {
                field: 'name_2', headerName: 'Materie',
            }, 
            {
                field: 'grades_2', headerName: 'Note',
            }, 
            {
                field: 'credits_2', headerName: 'Nr. Credite',
            }
        ]},
    ]);
    const defaultColDef = useMemo<ColDef>(() => {
        return {
            flex: 1,
        };
    }, []);

    const getCatalogData = async () => {
        const response = await getCatalog(sessionStorage.getItem('auth') ?? '');
        setCatalogData(response);        
        
        const data = response?.data?.map((el: Record<string, any>) => {            
            const an = Object.keys(el?.data[0])[0];
            const semesters = Object.values(el?.data[0]);
            const sem1 = (semesters[0] as Record<string, any>)?.sem1;
            const sem2 = (semesters[0] as Record<string, any>)?.sem2;            
            
            const processedSem1: Record<string, any>[] = sem1?.map((s1: any) => {
                return {
                    an,
                    id: s1?.id,
                    name_1: s1?.name,
                    grades_1: s1?.note?.join(','),
                    credits_1: s1?.credite,
                };
            });

            const processedSem2: Record<string, any>[] = sem2?.map((s2: any) => {
                return {
                    an,
                    id: s2?.id,
                    name_2: s2?.name,
                    grades_2: s2?.note?.join(','),
                    credits_2: s2?.credite,
                };
            });

            const output = []
            
            for(let i = 0; i < Math.max(processedSem1.length, processedSem2.length); i++) {
                if(processedSem1.length > processedSem2.length) {
                    let result = {...processedSem1[i]};
                    if(processedSem2[i]) {
                        result = {...result, ...processedSem2[i]};
                    }
                    output.push(result);
                } else {
                    let result = {...processedSem2[i]};
                    if(processedSem1[i]) {
                        result = {...result, ...processedSem1[i]};
                    }
                    output.push(result);
                }
            }

            return output;
        });        
        const rows: any = []

        data.forEach((r: any) => {
            Object.values(r).forEach(v => {
                rows.push(v);
            })
        })
        
        setRowData(rows);
    };

    useEffect(() => {
        getCatalogData();
    }, []);

    return (
        <Box className="tableContainer" h={'calc(100vh - 220px)'} mt={'1rem'}>
            <Box style={gridStyle} className={colorMode === 'light' ? "ag-theme-quartz" : "ag-theme-quartz-dark"}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                />
            </Box>
        </Box>
    )
}

export default Table